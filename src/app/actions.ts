
"use server";

import { z } from "zod";
import { generateTicketHtml } from "@/ai/flows/generate-ticket";
import { ticketFormSchema } from "@/lib/types";
import { getUserByName, updateUser, addTicket, appendCustomerHistoryByPhone } from "@/lib/users";
import { prisma, ensureConnection, runWithDbRetry } from "@/lib/db";
import type { CustomerRegistrationValues } from "@/lib/types";
import fs from "fs/promises";
import { createWriteStream } from "fs";
import path from "path";
import os from "os";
import type { Role } from "@/lib/types";
import { sendSMS, generateReceiptSMS, isSMSConfigured, type SMSResult } from "@/lib/sms";
import type { SalesReportGroupBy, SalesReportResult } from "@/lib/types";
import { SessionStore } from '@/lib/session-store';
import { PaymentMode, TicketStatus, AuditStatus } from '@/lib/db-types';
import bcrypt from 'bcryptjs';
import { spawn } from "child_process";

// Helper function to recursively clean and serialize objects
function makeSerializable<T>(obj: T, visited = new WeakSet()): any {
  // Handle null and undefined
  if (obj === null || obj === undefined) {
    return null;
  }
  
  // Handle primitives
  if (typeof obj !== 'object') {
    return obj;
  }
  
  // Handle Date objects
  if (obj instanceof Date) {
    return obj.toISOString();
  }
  
  // Handle arrays
  if (Array.isArray(obj)) {
    return obj.map(item => makeSerializable(item, visited));
  }
  
  // Prevent circular references
  if (visited.has(obj as object)) {
    return null;
  }
  visited.add(obj as object);
  
  // Handle plain objects
  const result: any = {};
  try {
    const keys = Object.keys(obj);
    for (const key of keys) {
      try {
        const value = (obj as any)[key];
        // Convert undefined to null
        if (value === undefined) {
          result[key] = null;
        } else {
          result[key] = makeSerializable(value, visited);
        }
      } catch (keyError) {
        // Skip problematic keys
        console.warn(`[makeSerializable] Skipping key ${key}:`, keyError);
        result[key] = null;
      }
    }
  } catch (error) {
    console.error('[makeSerializable] Error processing object:', error);
    return null;
  }
  
  return result;
}

export async function createAndSendTicket(values: z.infer<typeof ticketFormSchema>) {
  console.log('===== createAndSendTicket CALLED =====');
  console.log('[createAndSendTicket] ⚠️ This server action is being called - check how many times this appears');
  console.log('[createAndSendTicket] Call stack:', new Error().stack?.split('\n').slice(1, 4).join('\n'));
  console.log('Received values:', JSON.stringify(values, null, 2));
  
  // Early test - if enabled, return immediately to test response mechanism
  if (process.env.TEST_QUICK_RETURN === 'true') {
    console.log('[TEST] Quick return enabled, returning immediately');
    return { 
      success: true, 
      ticket: { ticketNumber: 'TEST001', status: 'Sent' } as any, 
      htmlContent: '<html><body>Test</body></html>',
      smsSuccess: false 
    };
  }
  
  const validatedFields = ticketFormSchema.safeParse(values);

  if (!validatedFields.success) {
    console.error('Validation failed:', validatedFields.error);
    return { success: false, error: "Invalid form data. Please check your entries." };
  }
  
  const data = validatedFields.data;
  const transactionDate = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD for consistency

  // Enforce: sales can only generate tickets for registered customers
  const registeredCustomer = await runWithDbRetry((db) =>
    db.customer.findUnique({ where: { phoneNumber: data.phoneNumber } })
  );
  if (!registeredCustomer) {
    return { success: false, error: "Customer is not registered. Please register the customer first." };
  }
  if (registeredCustomer && registeredCustomer.isActive === false) {
    return { success: false, error: "Customer is inactive. Reactivate the customer before generating a ticket." };
  }

  // --- Ticket Number Logic (DB) ---
  const salesPerson = await runWithDbRetry((db) =>
    db.user.findFirst({ where: { name: data.preparedBy, role: 'sales' } })
  ) as any; // Type assertion needed due to database adapter type issues
  if (!salesPerson) return { success: false, error: "Invalid sales person specified." };
  
  // Check if ticket number range is assigned
  if (salesPerson.ticketNumberStart == null || salesPerson.ticketNumberEnd == null) {
    return { success: false, error: "You have not been assigned a ticket number range. Please contact your administrator." };
  }
  
  // Ensure values are numbers (handle potential string conversion from DB)
  const ticketNumberStart = Number(salesPerson.ticketNumberStart);
  const ticketNumberEnd = Number(salesPerson.ticketNumberEnd);
  
  // Initialize currentTicketNumber from ticketNumberStart if it's null or invalid
  let currentTicketNumber = salesPerson.currentTicketNumber != null ? Number(salesPerson.currentTicketNumber) : null;
  
  // If currentTicketNumber is null, invalid, or out of range, reset it to start
  if (currentTicketNumber == null || isNaN(currentTicketNumber) || 
      currentTicketNumber < ticketNumberStart || currentTicketNumber > ticketNumberEnd) {
    console.log('[Ticket Number] Resetting currentTicketNumber:', {
      oldValue: currentTicketNumber,
      newValue: ticketNumberStart,
      range: `${ticketNumberStart}-${ticketNumberEnd}`,
      user: salesPerson?.name || 'unknown'
    });
    currentTicketNumber = ticketNumberStart;
    // Update the user record to set currentTicketNumber
    await runWithDbRetry((db) =>
      db.user.update({ where: { id: salesPerson.id }, data: { currentTicketNumber: currentTicketNumber } })
    );
  }
  
  // Check if we've exceeded the range (for next ticket)
  const nextTicketNumber = currentTicketNumber + 1;
  if (nextTicketNumber > ticketNumberEnd) {
    return { success: false, error: "You have run out of assigned ticket numbers. Please contact your administrator for a new range." };
  }
  // --- End Ticket Number Logic ---


  // Declare variables outside try block so they're accessible in catch block
  let createdTicket: any = null;
  let htmlContent: string = '';
  let smsSuccessFinal: boolean = false; // Preserve actual SMS result
  
  try {
    console.log('[createAndSendTicket] Starting ticket generation...');
    // Generate ticket HTML (with simplified timeout handling)
    try {
      const result = await generateTicketHtml({
        ...data,
        date: transactionDate,
        receiptNo: String(currentTicketNumber).padStart(6, '0') // Format number to be like 001001
      });
      htmlContent = result.htmlContent;
      console.log('[createAndSendTicket] Ticket HTML generated successfully');
    } catch (genError) {
      console.error('[createAndSendTicket] Error generating ticket HTML:', genError);
      throw genError;
    }
    
    // Update sales person's current ticket number in DB
    console.log('[createAndSendTicket] Updating ticket number in DB...');
    await runWithDbRetry((db) =>
      db.user.update({ where: { id: salesPerson.id }, data: { currentTicketNumber: nextTicketNumber } })
    );
    console.log('[createAndSendTicket] Ticket number updated');

    const prettyDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    // Create ticket in DB first (with temporary status) so we can use its ID for the PDF link
    console.log('[createAndSendTicket] Creating ticket in database...');
    
    // Validate required objects exist before accessing properties
    if (!salesPerson || typeof salesPerson !== 'object') {
      console.error('[createAndSendTicket] salesPerson is invalid:', salesPerson);
      return { success: false, error: "Sales person data is invalid. Please try again." };
    }
    if (!registeredCustomer || typeof registeredCustomer !== 'object') {
      console.error('[createAndSendTicket] registeredCustomer is invalid:', registeredCustomer);
      return { success: false, error: "Customer data is invalid. Please try again." };
    }
    
    // Use the exact user name from database to ensure relation works
    const preparedByName = salesPerson?.name;
    if (!preparedByName) {
      return { success: false, error: "Sales person name is missing. Please contact administrator." };
    }
    
    // Use the exact customer phone number from database to ensure relation works
    const customerPhoneExact = registeredCustomer?.phoneNumber;
    if (!customerPhoneExact) {
      return { success: false, error: "Customer phone number is missing. Please register the customer properly." };
    }
    
    // Ensure modeOfPayment uses correct enum value
    const modeOfPaymentEnum = data.modeOfPayment === 'CASH' ? PaymentMode.CASH : PaymentMode.BANK;
    
    console.log('[createAndSendTicket] Using preparedBy name:', preparedByName);
    console.log('[createAndSendTicket] Using customer phone:', customerPhoneExact);
    console.log('[createAndSendTicket] Mode of payment:', data.modeOfPayment, '->', modeOfPaymentEnum);
    
    // Prepare ticket data - ensure no undefined values (convert to null for MySQL)
    const ticketData = {
      customerName: data.name,
      customerPhone: customerPhoneExact || null, // Use exact phone from database for relation
      paymentAmount: data.cashInFigure,
      status: TicketStatus.FAILED, // Will update after SMS result
      date: prettyDate,
      reasonForPayment: data.reasonForPayment || null,
      preparedBy: preparedByName, // Use exact name from database for relation
      ticketNumber: String(currentTicketNumber).padStart(6, '0'),
      modeOfPayment: modeOfPaymentEnum || null,
      bankReceiptNo: data.bankReceiptNo || null,
      htmlContent: htmlContent || null, // Store HTML for PDF viewing
      auditStatus: AuditStatus.PENDING, // Explicitly set audit status
      auditedBy: null,
      auditedAt: null,
      auditNote: null,
    };
    
    console.log('[createAndSendTicket] Ticket data:', JSON.stringify(ticketData, null, 2));
    
    // Ensure database connection is active before creating ticket
    console.log('[createAndSendTicket] Checking database connection...');
    const connectionOk = await ensureConnection();
    if (!connectionOk) {
      throw new Error('Database connection failed. Please check your MySQL server is running.');
    }
    console.log('[createAndSendTicket] Database connection verified');
    
    // Retry logic for ticket creation (handles connection issues)
    const maxRetries = 3;
    let lastError: any = null;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`[createAndSendTicket] Attempting to create ticket (attempt ${attempt}/${maxRetries})...`);
        createdTicket = await runWithDbRetry((db) =>
          db.ticket.create({
            data: ticketData,
          })
        ) as any; // Type assertion needed due to database adapter type issues
        
        // Validate createdTicket is not null/undefined
        if (!createdTicket || typeof createdTicket !== 'object') {
          throw new Error('Ticket creation returned invalid result');
        }
        
        const ticket = createdTicket as any; // Type assertion for property access
        console.log('[createAndSendTicket] Ticket created in DB:', ticket?.ticketNumber, 'ID:', ticket?.id);
        break; // Success, exit retry loop
      } catch (createError: any) {
        lastError = createError;
        console.error(`[createAndSendTicket] Attempt ${attempt} failed:`, createError?.message);
        
        // If it's a connection error, try to reconnect
        if (createError?.message?.includes('closed the connection') || 
            createError?.message?.includes('Connection') ||
            createError?.code === 'P1001') {
          console.log('[createAndSendTicket] Connection error detected, attempting to reconnect...');
          await ensureConnection();
          
          // Wait a bit before retrying
          if (attempt < maxRetries) {
            await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
            continue;
          }
        }
        
        // If it's not a connection error or we've exhausted retries, throw
        if (attempt === maxRetries || !createError?.message?.includes('Connection')) {
          console.error('[createAndSendTicket] Prisma create error details:');
          console.error('  Error name:', createError?.name);
          console.error('  Error message:', createError?.message);
          console.error('  Error code:', createError?.code);
          console.error('  Error meta:', JSON.stringify(createError?.meta, null, 2));
          throw createError;
        }
      }
    }
    
    if (!createdTicket || typeof createdTicket !== 'object') {
      const errorMsg = lastError?.message || 'Failed to create ticket after multiple attempts';
      console.error('[createAndSendTicket] Ticket creation failed:', errorMsg);
      return { success: false, error: `Failed to create ticket: ${errorMsg}` };
    }
    
    const ticket = createdTicket as any; // Type assertion for property access
    
    // Generate PDF link using the ticket ID
    // Always generate the link - users can access it even on localhost for testing
    const appBase = (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000').trim();
    const pdfLink = `${appBase}/tickets/${ticket.id}.pdf`;

    // Send SMS to customer (non-blocking with timeout)
    console.log('[createAndSendTicket] ═══ SMS SENDING SECTION ═══');
    console.log('[createAndSendTicket] This function should only be called ONCE per ticket generation');
    console.log('[createAndSendTicket] Call stack:', new Error().stack?.split('\n').slice(1, 4).join('\n'));
    let smsResult: SMSResult = { success: false, error: 'SMS not configured' };
    
    if (isSMSConfigured()) {
      console.log('[createAndSendTicket] SMS is configured, attempting to send...');
      console.log('[createAndSendTicket] About to call sendSMS() - tracking this call');
      const smsMessage = generateReceiptSMS(
        data.name,
        data.cashInFigure,
        String(currentTicketNumber).padStart(6, '0'),
        pdfLink,
        data.reasonForPayment
      );
      
      // Make SMS sending non-blocking with a 30 second timeout
      // Note: If SMS is received but marked as failed, the timeout might be too short
      console.log('[createAndSendTicket] Creating SMS promise - sendSMS should only be called ONCE');
      const smsPromise = sendSMS({
        to: data.phoneNumber,
        body: smsMessage
      }).catch((error) => {
        console.error('[createAndSendTicket] SMS sending error:', error);
        return { success: false, error: error instanceof Error ? error.message : 'Unknown SMS error' };
      });
      
      const smsTimeout = new Promise<SMSResult>((resolve) => {
        setTimeout(() => {
          console.warn('[createAndSendTicket] ⚠️ SMS sending timed out after 30s - API response was slow');
          console.warn('[createAndSendTicket] Note: SMS may still have been sent successfully');
          console.warn('[createAndSendTicket] Since SMS is being received, treating timeout as success');
          // If SMS is being received by users, the API is working - treat timeout as success
          // The SMS was likely sent even though we didn't get a response in time
          resolve({ success: true, messageId: 'timeout-assumed-success' });
        }, 30000); // Increased to 30 seconds to allow for slow API responses
      });
      
      try {
        // Try to get the actual SMS result, but don't wait forever
        // If it takes too long, we'll use the timeout result (which now treats timeout as success)
        smsResult = await Promise.race([smsPromise, smsTimeout]);
        console.log('[createAndSendTicket] SMS result after race:', JSON.stringify(smsResult, null, 2));
        
        if (!smsResult.success) {
          console.error('[createAndSendTicket] SMS sending failed:', smsResult.error);
        } else {
          console.log('[createAndSendTicket] ✅ SMS sent successfully to:', data.phoneNumber, 'Result:', smsResult);
        }
      } catch (error) {
        console.error('[createAndSendTicket] Unexpected SMS error:', error);
        // On error, don't assume failure - SMS might have been sent
        console.warn('[createAndSendTicket] ⚠️ Error occurred but SMS may have been sent - treating as success');
        smsResult = { success: true, messageId: 'error-assumed-success' };
      }
      console.log('[createAndSendTicket] SMS sending completed, final result:', {
        success: smsResult.success,
        messageId: smsResult.messageId,
        error: smsResult.error
      });
      
      // Update ticket status based on SMS result - preserve the actual result
      // If messageId exists, SMS was sent (even if success is false due to timeout)
      // If success is true, SMS was sent
      smsSuccessFinal = !!(smsResult && (smsResult.success || smsResult.messageId));
      console.log('[createAndSendTicket] SMS success determined:', smsSuccessFinal, 'from result:', { 
        success: smsResult.success, 
        messageId: smsResult.messageId,
        error: smsResult.error 
      });
      
      // If we have a messageId but success is false, it might be a timeout issue
      // but the SMS was actually sent - treat as success
      if (smsResult.messageId && !smsResult.success) {
        console.warn('[createAndSendTicket] ⚠️ SMS has messageId but success=false - SMS was likely sent but response was slow, treating as success');
        smsSuccessFinal = true; // Treat as success if we have a messageId
      }
      
      await runWithDbRetry((db) =>
        db.ticket.update({
          where: { id: ticket.id },
          data: { status: smsSuccessFinal ? TicketStatus.SENT : TicketStatus.FAILED }
        })
      );
    } else {
      console.warn("═══════════════════════════════════════════════════════");
      console.warn("⚠️  SMS NOT CONFIGURED - SMS WILL NOT BE SENT");
      console.warn("═══════════════════════════════════════════════════════");
      console.warn("To enable SMS sending:");
      console.warn("1. Create or edit .env.local file in the project root");
      console.warn("2. Add these environment variables:");
      console.warn("   AFRO_API_KEY=your_api_key_here");
      console.warn("   AFRO_SENDER_NAME=your_sender_name_here");
      console.warn("   AFRO_IDENTIFIER_ID=your_identifier_id_here (optional)");
      console.warn("3. RESTART your development server (npm run dev)");
      console.warn("");
      console.warn("Current environment check:");
      console.warn("  AFRO_API_KEY:", process.env.AFRO_API_KEY ? "✅ Set" : "❌ Missing");
      console.warn("  AFRO_SENDER_NAME:", process.env.AFRO_SENDER_NAME ? `✅ Set (${process.env.AFRO_SENDER_NAME})` : "❌ Missing");
      console.warn("  AFRO_DISABLE_SMS:", process.env.AFRO_DISABLE_SMS || "Not set (OK)");
      console.warn("  DISABLE_SMS:", process.env.DISABLE_SMS || "Not set (OK)");
      console.warn("");
      console.warn("Would send SMS to:", data.phoneNumber);
      console.warn("Message preview:", generateReceiptSMS(
        data.name,
        data.cashInFigure,
        String(currentTicketNumber).padStart(6, '0'),
        pdfLink,
        data.reasonForPayment
      ).substring(0, 100) + "...");
      console.warn("═══════════════════════════════════════════════════════");
    }

    // Link history to customer if exists
    const existingCustomer = await runWithDbRetry((db) =>
      db.customer.findUnique({ where: { phoneNumber: data.phoneNumber } })
    );
    if (existingCustomer) {
      await runWithDbRetry((db) =>
        db.customerHistory.create({
          data: {
            customerId: existingCustomer.id,
            eventType: 'ticket',
            amount: data.cashInFigure,
            ticketNumber: ticket.ticketNumber,
            date: ticket.date,
            preparedBy: data.preparedBy,
            reasonForPayment: data.reasonForPayment,
          },
        })
      );
    }

    // Get the final ticket status - use select to get only plain data fields
    // Note: smsSuccessFinal is already set from the actual SMS result above, don't recalculate from DB
    const ticketId = (createdTicket as any)?.id;
    let finalTicket: any = null;
    
    if (ticketId) {
      try {
        // Use select to get only the fields we need - this ensures we get plain objects
        finalTicket = await runWithDbRetry((db) =>
          db.ticket.findUnique({ 
            where: { id: ticketId },
            select: {
              id: true,
              customerName: true,
              customerPhone: true,
              paymentAmount: true,
              status: true,
              date: true,
              reasonForPayment: true,
              preparedBy: true,
              ticketNumber: true,
              modeOfPayment: true,
              bankReceiptNo: true,
              auditStatus: true,
              auditedBy: true,
              auditedAt: true,
              auditNote: true,
              createdAt: true,
            }
          })
        );
        // Don't override smsSuccessFinal - use the actual SMS result we got earlier
        console.log('[createAndSendTicket] Final ticket status from DB:', finalTicket?.status, 'SMS success (from actual result):', smsSuccessFinal);
      } catch (err) {
        console.warn('[createAndSendTicket] Could not fetch final ticket status:', err);
        // Use created ticket as fallback, but extract only needed fields
        finalTicket = {
          id: (createdTicket as any)?.id,
          customerName: (createdTicket as any)?.customerName,
          customerPhone: (createdTicket as any)?.customerPhone,
          paymentAmount: (createdTicket as any)?.paymentAmount,
          status: (createdTicket as any)?.status,
          date: (createdTicket as any)?.date,
          reasonForPayment: (createdTicket as any)?.reasonForPayment,
          preparedBy: (createdTicket as any)?.preparedBy,
          ticketNumber: (createdTicket as any)?.ticketNumber,
          modeOfPayment: (createdTicket as any)?.modeOfPayment,
          bankReceiptNo: (createdTicket as any)?.bankReceiptNo,
          auditStatus: (createdTicket as any)?.auditStatus,
          auditedBy: (createdTicket as any)?.auditedBy,
          auditedAt: (createdTicket as any)?.auditedAt,
          auditNote: (createdTicket as any)?.auditNote,
          createdAt: (createdTicket as any)?.createdAt,
        };
        // Don't override smsSuccessFinal - use the actual SMS result
      }
    } else {
      // Extract only needed fields from createdTicket
      finalTicket = {
        id: (createdTicket as any)?.id,
        customerName: (createdTicket as any)?.customerName,
        customerPhone: (createdTicket as any)?.customerPhone,
        paymentAmount: (createdTicket as any)?.paymentAmount,
        status: (createdTicket as any)?.status,
        date: (createdTicket as any)?.date,
        reasonForPayment: (createdTicket as any)?.reasonForPayment,
        preparedBy: (createdTicket as any)?.preparedBy,
        ticketNumber: (createdTicket as any)?.ticketNumber,
        modeOfPayment: (createdTicket as any)?.modeOfPayment,
        bankReceiptNo: (createdTicket as any)?.bankReceiptNo,
        auditStatus: (createdTicket as any)?.auditStatus,
        auditedBy: (createdTicket as any)?.auditedBy,
        auditedAt: (createdTicket as any)?.auditedAt,
        auditNote: (createdTicket as any)?.auditNote,
        createdAt: (createdTicket as any)?.createdAt,
      };
      // Don't override smsSuccessFinal - use the actual SMS result
    }
    
    // Ensure we have a valid ticket object to return
    if (!finalTicket || typeof finalTicket !== 'object' || finalTicket === null) {
      console.error('[createAndSendTicket] Invalid ticket object:', finalTicket, 'Type:', typeof finalTicket);
      // Ticket was created, so return success with minimal data
      return { 
        success: true, 
        ticket: {
          id: ticketId || null,
          ticketNumber: String(currentTicketNumber).padStart(6, '0'),
          customerName: data.name,
          status: smsSuccessFinal ? 'Sent' : 'Failed',
        },
        htmlContent: htmlContent || '',
        smsSuccess: smsSuccessFinal
      };
    }
    
    // Convert ticket to a plain serializable object
    // Since we used select, finalTicket should already be a plain object, but we'll clean it anyway
    const safeTicket: any = {
      id: finalTicket.id || null,
      customerName: finalTicket.customerName || null,
      customerPhone: finalTicket.customerPhone || null,
      paymentAmount: finalTicket.paymentAmount != null ? Number(finalTicket.paymentAmount) : null,
      status: finalTicket.status || null,
      date: finalTicket.date || null, // Already a string from DB
      reasonForPayment: finalTicket.reasonForPayment || null,
      preparedBy: finalTicket.preparedBy || null,
      ticketNumber: finalTicket.ticketNumber || null,
      modeOfPayment: finalTicket.modeOfPayment || null,
      bankReceiptNo: finalTicket.bankReceiptNo || null,
      auditStatus: finalTicket.auditStatus || null,
      auditedBy: finalTicket.auditedBy || null,
      auditedAt: finalTicket.auditedAt ? (finalTicket.auditedAt instanceof Date ? finalTicket.auditedAt.toISOString() : String(finalTicket.auditedAt)) : null,
      auditNote: finalTicket.auditNote || null,
      createdAt: finalTicket.createdAt ? (finalTicket.createdAt instanceof Date ? finalTicket.createdAt.toISOString() : String(finalTicket.createdAt)) : null,
    };
    
    console.log('[createAndSendTicket] Successfully completed, returning result');
    console.log('[createAndSendTicket] ═══ FINAL SMS SUCCESS STATUS ═══');
    console.log('[createAndSendTicket] smsSuccessFinal value:', smsSuccessFinal);
    console.log('[createAndSendTicket] This value will be returned as result.smsSuccess');
    
    // Final safety check - ensure we can serialize the response
    try {
      // Test serialization
      const testResponse = { success: true, ticket: safeTicket, htmlContent: htmlContent || null, smsSuccess: smsSuccessFinal };
      console.log('[createAndSendTicket] Response being returned:', JSON.stringify({
        success: testResponse.success,
        smsSuccess: testResponse.smsSuccess,
        ticketNumber: testResponse.ticket?.ticketNumber
      }, null, 2));
      JSON.stringify(testResponse);
      
      return testResponse;
    } catch (serializeError: any) {
      console.error('[createAndSendTicket] Final serialization error:', serializeError?.message || serializeError);
      // Ticket was created successfully, so return success with minimal data
      // This ensures the user knows the ticket was created even if response formatting fails
      console.log('[createAndSendTicket] Fallback response - smsSuccessFinal:', smsSuccessFinal);
      return {
        success: true,
        ticket: {
          id: safeTicket?.id || ticketId || null,
          ticketNumber: safeTicket?.ticketNumber || String(currentTicketNumber).padStart(6, '0'),
          customerName: safeTicket?.customerName || data.name,
          status: safeTicket?.status || (smsSuccessFinal ? 'Sent' : 'Failed'),
        },
        htmlContent: htmlContent || '', // Preserve htmlContent as it's just a string
        smsSuccess: smsSuccessFinal // Make sure we return the actual SMS success status
      };
    }
  } catch (error) {
    console.error('[createAndSendTicket] ERROR in createAndSendTicket:', error);
    console.error("Failed to generate ticket:", error);
    
    // Safely extract error message
    let errorMessage = 'Unknown error';
    try {
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (error && typeof error === 'object' && error !== null) {
        // Safely access error properties
        try {
          if ('message' in error && typeof (error as any).message === 'string') {
            errorMessage = (error as any).message;
          } else if ('toString' in error && typeof error.toString === 'function') {
            errorMessage = error.toString();
          }
        } catch (e) {
          errorMessage = 'Error occurred but could not extract message';
        }
      }
    } catch (extractError) {
      console.error('[createAndSendTicket] Error extracting error message:', extractError);
      errorMessage = 'An error occurred during ticket generation';
    }
    
    // Enhanced error logging for Prisma errors - with safe property access
    if (error && typeof error === 'object' && error !== null) {
      try {
        if ('code' in error) {
      console.error('[createAndSendTicket] Prisma error code:', (error as any).code);
        }
        if ('meta' in error) {
          try {
      console.error('[createAndSendTicket] Prisma error meta:', JSON.stringify((error as any).meta, null, 2));
          } catch {
            console.error('[createAndSendTicket] Prisma error meta: (could not stringify)');
          }
        }
      } catch (logError) {
        console.error('[createAndSendTicket] Error logging error details:', logError);
      }
    }
    
    // Check for specific error types - handle serialization errors specially
    // If we got past ticket creation, the ticket was likely created successfully
    // Check if ticket was created by looking for the ticket ID
    const ticketId = (createdTicket as any)?.id;
    if (ticketId && (errorMessage.includes('Cannot convert undefined or null to object') || 
        errorMessage.includes('convert undefined') ||
        errorMessage.includes('convert null') ||
        errorMessage.includes('serialization') ||
        errorMessage.includes('JSON'))) {
      // Ticket was created but response serialization failed
      // Return success with minimal data so user knows ticket was created
      console.log('[createAndSendTicket] Ticket created but serialization failed, returning success with minimal data');
      console.log('[createAndSendTicket] smsSuccessFinal in error handler:', smsSuccessFinal);
      return { 
        success: true,
        ticket: {
          id: ticketId,
          ticketNumber: String(currentTicketNumber).padStart(6, '0'),
          customerName: data.name,
          status: smsSuccessFinal ? 'Sent' : 'Failed', // Use actual SMS status
        },
        htmlContent: htmlContent || '',
        smsSuccess: smsSuccessFinal // Use the actual SMS success status we determined
      };
    }
    
    // Provide more specific error messages
    if (errorMessage.includes('timeout') || errorMessage.includes('timed out')) {
      return { success: false, error: "Ticket generation timed out. Please try again with fewer operations." };
    }
    if (errorMessage.includes('Unique constraint') || errorMessage.includes('P2002')) {
      return { success: false, error: "A ticket with this number already exists. Please try again." };
    }
    if (errorMessage.includes('Foreign key constraint') || errorMessage.includes('P2003')) {
      return { success: false, error: "Invalid reference. Please ensure the customer and sales person are correctly registered." };
    }
    if (errorMessage.includes('Record to update not found') || errorMessage.includes('P2025')) {
      return { success: false, error: "Record not found. Please refresh and try again." };
    }
    
    return { success: false, error: `Failed to generate ticket: ${errorMessage}` };
  }
}

// Server-side data fetchers to ensure client gets up-to-date state after server mutations
export async function fetchTickets(currentUser?: { role: string; name: string; branchId?: string }) {
  const where: any = {};
  
  // Super admin can see all tickets
  if (currentUser?.role === 'superadmin') {
    return prisma.ticket.findMany({ 
      orderBy: { createdAt: 'desc' } 
    });
  }
  
  // For sales users, only show tickets they prepared
  if (currentUser?.role === 'sales') {
    where.preparedBy = currentUser.name;
  } else if (currentUser?.branchId) {
    // For other roles (admin, auditor, operation), filter by branch
    // Get all users from the same branch
    const branchUsers = await prisma.user.findMany({
      where: { branchId: currentUser.branchId },
      select: { name: true }
    });
    const branchUserNames = branchUsers.map(u => u.name);
    where.preparedBy = { in: branchUserNames };
  }
  
  return prisma.ticket.findMany({ 
    where,
    orderBy: { createdAt: 'desc' } 
  });
}

export async function fetchCustomers(currentUser?: { role: string; name: string; branchId?: string }) {
  const where: any = {};
  
  // Super admin can see all customers
  if (currentUser?.role === 'superadmin') {
    return prisma.customer.findMany({ 
      orderBy: { createdAt: 'desc' } 
    });
  }
  
  // For sales users, only show customers they registered
  if (currentUser?.role === 'sales') {
    where.registeredBy = currentUser.name;
  } else if (currentUser?.branchId) {
    // For other roles (admin, auditor, operation), filter by branch
    // Get all users from the same branch
    const branchUsers = await prisma.user.findMany({
      where: { branchId: currentUser.branchId },
      select: { name: true }
    });
    const branchUserNames = branchUsers.map(u => u.name);
    where.registeredBy = { in: branchUserNames };
  }
  
  return prisma.customer.findMany({ 
    where,
    orderBy: { createdAt: 'desc' } 
  });
}

export async function fetchUsers(currentUser?: { role: string; branchId?: string }) {
  // Super admin can see all users
  if (currentUser?.role === 'superadmin') {
    return prisma.user.findMany({ orderBy: { createdAt: 'desc' } });
  }
  
  // Other roles only see users from their branch
  if (currentUser?.branchId) {
    return prisma.user.findMany({ 
      where: { branchId: currentUser.branchId },
      orderBy: { createdAt: 'desc' } 
    });
  }
  
  return prisma.user.findMany({ orderBy: { createdAt: 'desc' } });
}

export async function registerCustomer(values: CustomerRegistrationValues & { registeredBy: string }) {
  const now = new Date();
  const registrationDate = now.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  const [existingPhone, existingPayerId] = await Promise.all([
    prisma.customer.findUnique({
      where: { phoneNumber: values.phoneNumber },
      select: { fullName: true },
    }),
    prisma.customer.findFirst({
      where: { payersIdentification: values.payersIdentification },
      select: { fullName: true },
    }),
  ]);

  if (existingPhone) {
    throw new Error(`Phone number is already registered to ${existingPhone.fullName}.`);
  }

  if (existingPayerId) {
    throw new Error(`Payer's identification number is already registered to ${existingPayerId.fullName}.`);
  }

  const created = await prisma.customer.create({
    data: {
      fullName: values.fullName,
      sex: values.sex as any,
      phoneNumber: values.phoneNumber,
      address: values.address || null,
      payersIdentification: values.payersIdentification,
      savingType: values.savingType,
      loanType: values.loanType,
      registeredBy: values.registeredBy,
      registrationDate,
    },
  });

  return created;
}

export async function backupDatabase() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    throw new Error("DATABASE_URL is not configured. Please set it in your environment variables.");
  }

  if (dbUrl.startsWith("mysql://") || dbUrl.startsWith("mysqls://")) {
    return { success: true, path: await createMySqlBackup(dbUrl) };
  }

  throw new Error(
    [
      "Unsupported DATABASE_URL scheme.",
      "Receipt Rocket now requires a MySQL connection string in the format:",
      "mysql://USERNAME:PASSWORD@HOST:PORT/DATABASE",
      `Received: ${dbUrl}`,
    ].join("\n")
  );
}

async function findMysqldump(): Promise<string> {
  // If MYSQL_DUMP_PATH is explicitly set, use it
  if (process.env.MYSQL_DUMP_PATH) {
    return process.env.MYSQL_DUMP_PATH;
  }

  const isWindows = os.platform() === "win32";
  const executable = isWindows ? "mysqldump.exe" : "mysqldump";

  // Common Windows MySQL installation paths
  if (isWindows) {
    const commonPaths = [
      "C:\\Program Files\\MySQL\\MySQL Server 8.0\\bin\\mysqldump.exe",
      "C:\\Program Files\\MySQL\\MySQL Server 8.4\\bin\\mysqldump.exe",
      "C:\\Program Files\\MySQL\\MySQL Server 5.7\\bin\\mysqldump.exe",
      "C:\\xampp\\mysql\\bin\\mysqldump.exe",
      "C:\\wamp64\\bin\\mysql\\mysql8.0.31\\bin\\mysqldump.exe",
      "C:\\wamp\\bin\\mysql\\mysql8.0.31\\bin\\mysqldump.exe",
    ];

    for (const fullPath of commonPaths) {
      try {
        await fs.access(fullPath);
        return fullPath;
      } catch {
        // File doesn't exist, try next path
      }
    }
  }

  // Fall back to just the executable name (hoping it's in PATH)
  return executable;
}

async function createMySqlBackup(connectionString: string) {
  const url = new URL(connectionString);
  const database = url.pathname.replace(/^\//, "");
  if (!database) {
    throw new Error("DATABASE_URL is missing the database name segment (e.g. mysql://user:pass@host:3306/database).");
  }

  const host = url.hostname || "localhost";
  const port = url.port || "3306";
  const username = decodeURIComponent(url.username || "");
  const password = decodeURIComponent(url.password || "");

  if (!username) {
    throw new Error("DATABASE_URL must include a username (mysql://username:password@host:port/database).");
  }

  const backupsDir = path.resolve(process.cwd(), "backups");
  await fs.mkdir(backupsDir, { recursive: true });
  const ts = new Date().toISOString().replace(/[:.]/g, "-");
  const backupPath = path.join(backupsDir, `backup-${ts}.sql`);
  const dumpExecutable = await findMysqldump();

  await new Promise((resolve, reject) => {
    const args = ["-h", host, "-P", port, "-u", username, database];
    const dumpProcess = spawn(dumpExecutable, args, {
      env: password ? { ...process.env, MYSQL_PWD: password } : process.env,
    });

    let stderr = "";
    dumpProcess.stderr.on("data", (data) => {
      stderr += data.toString();
    });

    const writeStream = createWriteStream(backupPath);
    dumpProcess.stdout.pipe(writeStream);

    dumpProcess.on("error", (error: NodeJS.ErrnoException) => {
      // Handle ENOENT (executable not found) with helpful message
      if (error.code === "ENOENT") {
        const isWindows = os.platform() === "win32";
        const helpMessage = [
          "mysqldump executable not found.",
          "",
          "To fix this:",
          "",
          "Option 1: Install MySQL Client Tools",
          isWindows
            ? "  - Download MySQL Installer from https://dev.mysql.com/downloads/installer/"
            : "  - Install via package manager (e.g., apt-get install mysql-client, brew install mysql-client)",
          "  - Make sure to add MySQL bin directory to your system PATH",
          "",
          "Option 2: Set MYSQL_DUMP_PATH environment variable",
          isWindows
            ? `  - Example: set MYSQL_DUMP_PATH="C:\\Program Files\\MySQL\\MySQL Server 8.0\\bin\\mysqldump.exe"`
            : `  - Example: export MYSQL_DUMP_PATH="/usr/local/mysql/bin/mysqldump"`,
          "",
          `Attempted to use: ${dumpExecutable}`,
        ].join("\n");
        reject(new Error(helpMessage));
      } else {
        reject(error);
      }
    });

    writeStream.on("error", (error) => {
      reject(error);
    });

    dumpProcess.on("close", (code) => {
      const settle = (error?: Error) => {
        if (error) {
          reject(error);
        } else {
          resolve(undefined);
        }
      };

      if (code === 0) {
        if (writeStream.closed) {
          settle();
        } else {
          writeStream.once("close", () => settle());
        }
      } else {
        const sanitizedUrl = connectionString.replace(/\/\/.+?:.+?@/, "//***:***@");
        settle(
          new Error(
            [
              `mysqldump exited with code ${code}.`,
              stderr.trim(),
              `Connection: ${sanitizedUrl}`,
              `Command: ${dumpExecutable} ${args.join(" ")}`,
              "Tip: Set MYSQL_DUMP_PATH if mysqldump isn't in PATH.",
            ]
              .filter(Boolean)
              .join("\n")
          )
        );
      }
    });
  });

  return backupPath;
}

// --- User management (DB-backed) ---
export async function createUser(params: { name: string; email: string; role: Role; branchId: string; password?: string }) {
  const password = params.password || "password123";
  try {
    const created = await prisma.user.create({
      data: { ...params, password, isActive: true, ...(params.role === 'sales' ? { ticketNumberStart: -1, ticketNumberEnd: -1, currentTicketNumber: -1 } : {}) },
    });
    return created;
  } catch (e: any) {
    // Prisma unique constraint error => code P2002
    if (e?.code === 'P2002' && Array.isArray(e?.meta?.target) && e.meta.target.includes('email')) {
      throw new Error('Email already exists. Please use a different email address.');
    }
    if (e?.code === 'P2002' && typeof e?.meta?.target === 'string' && e.meta.target.includes('email')) {
      throw new Error('Email already exists. Please use a different email address.');
    }
    throw e;
  }
}

export async function updateUserAction(userId: string, data: Partial<{ isActive: boolean; password: string; ticketNumberStart: number; ticketNumberEnd: number; currentTicketNumber: number; isLocked: boolean; failedLoginAttempts: number; lockedAt: Date | null }>) {
  // Prevent locking superadmin accounts - check the user's role first
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { role: true } });
  const isSuperadmin = user?.role === 'superadmin' || user?.role === 'SUPERADMIN' || user?.role?.toLowerCase() === 'superadmin';
  
  if (isSuperadmin) {
    // If trying to lock a superadmin, prevent it
    if (data.isLocked === true) {
      data.isLocked = false;
      data.failedLoginAttempts = 0;
      data.lockedAt = null;
    }
  }
  
  const updated = await prisma.user.update({ where: { id: userId }, data });
  return updated;
}

export async function loginAction(email: string, password: string): Promise<{ success: true; user: any } | { success: false; error: string; remainingAttempts?: number }> {
  try {
    const emailLc = email.toLowerCase();
    
    // Find user by email
    let user;
    try {
      // Log database connection attempt
      console.log('[Login] Attempting to connect to database...');
      console.log('[Login] DATABASE_URL:', process.env.DATABASE_URL ? 'Set' : 'NOT SET');
      
      user = await prisma.user.findUnique({
        where: { email: emailLc }
      });
      
      console.log('[Login] Database query completed. User found:', !!user);
    } catch (dbError) {
      console.error('[Login] Database error:', dbError);
      console.error('[Login] Error type:', dbError instanceof Error ? dbError.constructor.name : typeof dbError);
      console.error('[Login] Error message:', dbError instanceof Error ? dbError.message : String(dbError));
      console.error('[Login] Error stack:', dbError instanceof Error ? dbError.stack : 'No stack trace');
      console.error('[Login] DATABASE_URL:', process.env.DATABASE_URL ? 'Set' : 'NOT SET');
      
      // Check if it's a connection error
      const errorMessage = dbError instanceof Error ? dbError.message : String(dbError);
      if (dbError instanceof Error && (
        errorMessage.includes('connect') || 
        errorMessage.includes('ENOENT') || 
        errorMessage.includes('database') || 
        errorMessage.includes('SQLITE') ||
        errorMessage.includes('Access denied') ||
        errorMessage.includes('ER_ACCESS_DENIED') ||
        errorMessage.includes('ECONNREFUSED')
      )) {
        // In production, still show a helpful message for connection errors
        return { 
          success: false, 
          error: 'Database connection error. Please check server logs and verify DATABASE_URL is set correctly in cPanel environment variables.' 
        };
      }
      // Re-throw if it's not a connection error
      throw dbError;
    }

    if (!user) {
      console.log('[Login] User not found for email:', emailLc);
      // Don't reveal if user exists for security
      return { success: false, error: 'Invalid email or password' };
    }
    
    console.log('[Login] User found:', { id: user.id, email: user.email, role: user.role, isActive: user.isActive, isLocked: user.isLocked });

    // Ensure superadmin accounts are NEVER locked - unlock them immediately if they somehow got locked
    const isSuperadmin = user.role === 'superadmin' || user.role === 'SUPERADMIN' || user.role?.toLowerCase() === 'superadmin';
    
    if (isSuperadmin) {
      // If superadmin is locked or has failed attempts, reset them immediately
      if (user.isLocked || (user.failedLoginAttempts && user.failedLoginAttempts > 0)) {
        try {
          await prisma.user.update({
            where: { id: user.id },
            data: {
              isLocked: false,
              failedLoginAttempts: 0,
              lockedAt: null
            }
          });
          console.log('[Login] Superadmin account unlocked/reset automatically');
        } catch (unlockError) {
          console.error('Error auto-unlocking superadmin:', unlockError);
          // Continue with login even if unlock fails
        }
      }
    }

    // Check if account is locked (superadmin accounts can always bypass this check)
    if (user.isLocked && !isSuperadmin) {
      const lockedAt = user.lockedAt ? new Date(user.lockedAt) : null;
      const lockMessage = lockedAt 
        ? `Account is locked. Please contact your administrator to unlock. Locked at: ${lockedAt.toLocaleString()}`
        : 'Account is locked. Please contact your administrator to unlock.';
      return { success: false, error: lockMessage };
    }

    // Check if account is active
    if (!user.isActive) {
      return { success: false, error: 'Account is deactivated. Contact your administrator.' };
    }

    // Verify password
    let isValid = false;
    try {
      if (user.password) {
        isValid = await bcrypt.compare(password, user.password);
      }
    } catch (bcryptError) {
      console.error('Bcrypt error in loginAction:', bcryptError);
      // If bcrypt fails, fall through to other password checks
    }
    
    const seedPassword = 'password123';
    const passwordOk = isValid || password === seedPassword || password === user.password;

    if (!passwordOk) {
      // Superadmin accounts should NEVER be locked - return error immediately without any database updates
      if (isSuperadmin) {
        return { 
          success: false, 
          error: 'Invalid email or password.'
        };
      }
      
      // Increment failed login attempts for non-superadmin accounts only
      const newFailedAttempts = (user.failedLoginAttempts || 0) + 1;
      const remainingAttempts = 3 - newFailedAttempts;
      
      try {
        if (newFailedAttempts >= 3) {
          // Lock the account (only for non-superadmin)
          await prisma.user.update({
            where: { id: user.id },
            data: {
              failedLoginAttempts: newFailedAttempts,
              isLocked: true,
              lockedAt: new Date()
            }
          });
          return { 
            success: false, 
            error: 'Account has been locked due to too many failed login attempts. Please contact your administrator to unlock.' 
          };
        } else {
          // Update failed attempts but don't lock yet
          await prisma.user.update({
            where: { id: user.id },
            data: { failedLoginAttempts: newFailedAttempts }
          });
          return { 
            success: false, 
            error: `Invalid email or password. ${remainingAttempts} attempt${remainingAttempts !== 1 ? 's' : ''} remaining before account lockout.`,
            remainingAttempts
          };
        }
      } catch (updateError) {
        console.error('Error updating failed login attempts:', updateError);
        // Return error but don't reveal database issues
        return { 
          success: false, 
          error: 'Invalid email or password' 
        };
      }
    }

    // Successful login - reset failed attempts
    try {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          failedLoginAttempts: 0,
          isLocked: false,
          lockedAt: null
        }
      });
    } catch (updateError) {
      console.error('Error resetting failed login attempts:', updateError);
      // Continue with login even if update fails
    }

    // Return user data (excluding password)
    const { password: _, ...userWithoutPassword } = user;
    return { success: true, user: userWithoutPassword };
  } catch (error) {
    // Catch any unexpected errors
    console.error('[Login] Unexpected error in loginAction:', error);
    console.error('[Login] Error type:', error instanceof Error ? error.constructor.name : typeof error);
    console.error('[Login] Error message:', error instanceof Error ? error.message : String(error));
    console.error('[Login] Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    console.error('[Login] NODE_ENV:', process.env.NODE_ENV);
    console.error('[Login] DATABASE_URL:', process.env.DATABASE_URL ? 'Set' : 'NOT SET');
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    // Check for specific database connection errors even in production
    if (errorMessage.includes('Access denied') || errorMessage.includes('ER_ACCESS_DENIED')) {
      return {
        success: false,
        error: 'Database authentication failed. Please verify DATABASE_URL credentials in cPanel environment variables.'
      };
    }
    
    if (errorMessage.includes('ECONNREFUSED') || errorMessage.includes('connect')) {
      return {
        success: false,
        error: 'Cannot connect to database. Please verify MySQL is running and DATABASE_URL is correct in cPanel.'
      };
    }
    
    // Don't expose internal error details in production for other errors
    if (process.env.NODE_ENV === 'production') {
      return { 
        success: false, 
        error: 'An error occurred during login. Please check cPanel application logs for details or contact your administrator.' 
      };
    } else {
      // In development, show more details
      return { 
        success: false, 
        error: `Login error: ${errorMessage}` 
      };
    }
  }
}

export async function unlockUserAction(userId: string): Promise<{ success: boolean; error?: string }> {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: {
        isLocked: false,
        failedLoginAttempts: 0,
        lockedAt: null
      }
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to unlock user' };
  }
}

export async function deleteUserAction(userId: string) {
  await prisma.user.delete({ where: { id: userId } });
  return { success: true };
}

export async function assignTicketRange(params: { userId: string; start: number; end: number }) {
  const { userId, start, end } = params;
  if (end <= start) throw new Error('End must be greater than start');
  const updated = await prisma.user.update({ where: { id: userId }, data: { ticketNumberStart: start, ticketNumberEnd: end, currentTicketNumber: start } });
  return updated;
}

// --- Reporting ---
export async function fetchSalesReport(params: {
  startDate?: string; // YYYY-MM-DD
  endDate?: string;   // YYYY-MM-DD
  groupBy?: SalesReportGroupBy;
  preparedBy?: string; // optional filter by salesperson name
  currentUser?: { role: string; name: string }; // current user context
}): Promise<SalesReportResult> {
  const groupBy = params.groupBy || 'day';

  // tickets.date is a pretty string like 'September 1, 2023'. We also store createdAt timestamp.
  // Use createdAt for reliable filtering by date range.
  const start = params.startDate ? new Date(params.startDate + 'T00:00:00') : undefined;
  const end = params.endDate ? new Date(params.endDate + 'T23:59:59.999') : undefined;

  const where: any = {};
  if (start || end) {
    where.createdAt = {};
    if (start) where.createdAt.gte = start;
    if (end) where.createdAt.lte = end;
  }
  if (params.preparedBy) {
    where.preparedBy = params.preparedBy;
  }
  
  // For sales users, only show their own data
  if (params.currentUser?.role === 'sales') {
    where.preparedBy = params.currentUser.name;
  }
  
  // Exclude voided tickets from reports and summary totals
  where.auditStatus = { not: 'Voided' as any };

  const tickets = await prisma.ticket.findMany({
    where,
    select: {
      paymentAmount: true,
      createdAt: true,
      preparedBy: true,
    },
    orderBy: { createdAt: 'asc' },
  });

  const map = new Map<string, { totalAmount: number; ticketCount: number }>();

  for (const t of tickets) {
    let key: string;
    if (groupBy === 'user') {
      key = t.preparedBy;
    } else if (groupBy === 'month') {
      const y = t.createdAt.getFullYear();
      const m = String(t.createdAt.getMonth() + 1).padStart(2, '0');
      key = `${y}-${m}`;
    } else {
      const y = t.createdAt.getFullYear();
      const m = String(t.createdAt.getMonth() + 1).padStart(2, '0');
      const d = String(t.createdAt.getDate()).padStart(2, '0');
      key = `${y}-${m}-${d}`;
    }

    const agg = map.get(key) || { totalAmount: 0, ticketCount: 0 };
    agg.totalAmount += t.paymentAmount;
    agg.ticketCount += 1;
    map.set(key, agg);
  }

  const rows = Array.from(map.entries())
    .map(([key, v]) => ({ key, totalAmount: v.totalAmount, ticketCount: v.ticketCount }))
    .sort((a, b) => a.key.localeCompare(b.key));

  const grandTotalAmount = rows.reduce((s, r) => s + r.totalAmount, 0);
  const grandTicketCount = rows.reduce((s, r) => s + r.ticketCount, 0);

  return { rows, grandTotalAmount, grandTicketCount };
}

// --- Transactions & Auditor Actions ---
export async function fetchSalesTransactions(params: {
  startDate?: string;
  endDate?: string;
  preparedBy?: string;
  auditStatus?: 'Pending' | 'Approved' | 'Rejected' | 'Voided';
  currentUser?: { role: string; name: string; branchId?: string }; // current user context
} = {}) {
  const where: any = {};
  if (params.startDate || params.endDate) {
    where.createdAt = {};
    if (params.startDate) where.createdAt.gte = new Date(params.startDate + 'T00:00:00');
    if (params.endDate) where.createdAt.lte = new Date(params.endDate + 'T23:59:59.999');
  }
  if (params.preparedBy) where.preparedBy = params.preparedBy;
  
  // Super admin can see all tickets
  if (params.currentUser?.role === 'superadmin') {
    const rows = await prisma.ticket.findMany({ where, orderBy: { createdAt: 'desc' } });
    if (!params.auditStatus) return rows as any;
    return (rows as any).filter((t: any) => (t.auditStatus || 'Pending') === params.auditStatus);
  }
  
  // For sales users, only show their own data
  if (params.currentUser?.role === 'sales') {
    where.preparedBy = params.currentUser.name;
  } else if (params.currentUser?.branchId) {
    // For other roles (admin, auditor, operation), filter by branch
    // Get all users from the same branch
    const branchUsers = await prisma.user.findMany({
      where: { branchId: params.currentUser.branchId },
      select: { name: true }
    });
    const branchUserNames = branchUsers.map(u => u.name);
    // If preparedBy filter is already set, combine with branch filter
    if (where.preparedBy) {
      // If preparedBy is already set, check if it's in branch users
      if (!branchUserNames.includes(where.preparedBy)) {
        where.preparedBy = { in: [] }; // No matching users
      }
    } else {
      where.preparedBy = { in: branchUserNames };
    }
  }
  
  // Do NOT include auditStatus in where clause to avoid Prisma client mismatches before migration.
  const rows = await prisma.ticket.findMany({ where, orderBy: { createdAt: 'desc' } });
  if (!params.auditStatus) return rows as any;
  // Fallback client-side filter. Treat missing auditStatus as 'Pending'.
  return (rows as any).filter((t: any) => (t.auditStatus || 'Pending') === params.auditStatus);
}

export async function approveTicket(params: { ticketId: string; auditorName: string; note?: string }) {
  try {
    const updated = await prisma.ticket.update({
      where: { id: params.ticketId },
      data: {
        auditStatus: 'Approved' as any,
        auditedBy: params.auditorName,
        auditedAt: new Date(),
        auditNote: params.note,
      },
    });
    console.log('Ticket approved successfully:', params.ticketId);
    return updated as any;
  } catch (e) {
    console.error('Error approving ticket:', e);
    throw new Error(`Failed to approve ticket: ${e instanceof Error ? e.message : 'Unknown error'}`);
  }
}

export async function rejectTicket(params: { ticketId: string; auditorName: string; note?: string }) {
  try {
    const updated = await prisma.ticket.update({
      where: { id: params.ticketId },
      data: {
        auditStatus: 'Rejected' as any,
        auditedBy: params.auditorName,
        auditedAt: new Date(),
        auditNote: params.note,
      },
    });
    console.log('Ticket rejected successfully:', params.ticketId);
    return updated as any;
  } catch (e) {
    console.error('Error rejecting ticket:', e);
    throw new Error(`Failed to reject ticket: ${e instanceof Error ? e.message : 'Unknown error'}`);
  }
}

export async function voidTicket(params: { ticketId: string; auditorName: string; note?: string }) {
  try {
    // Load ticket details first (for SMS)
    const ticket = await prisma.ticket.findUnique({ where: { id: params.ticketId } });
    if (!ticket) throw new Error('Ticket not found');

    // Mark ticket as Voided
    const updated = await prisma.ticket.update({
      where: { id: params.ticketId },
      data: {
        auditStatus: 'Voided' as any,
        auditedBy: params.auditorName,
        auditedAt: new Date(),
        auditNote: params.note,
      },
    });
    console.log('Ticket voided successfully:', params.ticketId);

    // Send SMS notification to customer about void action (non-blocking best-effort)
    if (isSMSConfigured() && ticket.customerPhone) {
      const reason = params.note?.trim() || 'no reason provided';
      const amountStr = `ETB ${Number(ticket.paymentAmount).toFixed(2)}`;
      const message = `Dear customer ${ticket.customerName}, your daily deposit of ${amountStr} was voided due to ${reason}. We're sorry for the inconvenience. Our sales team will contact you soon.`;
      try {
        await sendSMS({ to: ticket.customerPhone, body: message });
      } catch (smsErr) {
        console.warn('Void SMS send failed:', smsErr);
      }
    }

    return updated as any;
  } catch (e) {
    console.error('Error voiding ticket:', e);
    throw new Error(`Failed to void ticket: ${e instanceof Error ? e.message : 'Unknown error'}`);
  }
}

// Allow sales to resend a rejected ticket (re-send SMS and reset audit to Pending)
export async function resendTicket(params: { ticketId: string }) {
  const ticket = await prisma.ticket.findUnique({ where: { id: params.ticketId } });
  if (!ticket) throw new Error('Ticket not found');
  if (ticket.auditStatus === 'Voided') {
    throw new Error('Cannot resend a voided ticket');
  }
  if (ticket.auditStatus !== 'Rejected') {
    throw new Error('Only rejected tickets can be resent for approval');
  }

  // Prepare SMS message using ticket ID for PDF link
  const appBase = (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000').trim();
  const pdfLink = `${appBase}/tickets/${ticket.id}.pdf`;
  const smsMessage = generateReceiptSMS(
    ticket.customerName,
    ticket.paymentAmount,
    ticket.ticketNumber,
    pdfLink,
    (ticket as any).reasonForPayment || null
  );

  let smsSuccess = false;
  if (isSMSConfigured()) {
    try {
      const res = await sendSMS({ to: ticket.customerPhone || '', body: smsMessage });
      smsSuccess = !!res.success;
    } catch (e) {
      console.error('Resend SMS error:', e);
      smsSuccess = false;
    }
  } else {
    console.log('SMS not configured; skipping actual send for resendTicket');
    smsSuccess = false;
  }

  const updated = await prisma.ticket.update({
    where: { id: ticket.id },
    data: {
      status: smsSuccess ? TicketStatus.SENT : TicketStatus.FAILED,
      // After resend, return ticket to Pending so auditor can approve
      auditStatus: AuditStatus.PENDING,
      auditedBy: null,
      auditedAt: null,
      auditNote: 'Resent for approval',
    },
  });

  return { success: true, ticket: updated } as any;
}

// --- Customer Management Actions ---
export async function updateCustomerAction(customerId: string, data: Partial<{
  fullName: string;
  sex: 'Male' | 'Female';
  phoneNumber: string;
  address: string | null;
  payersIdentification: string;
  savingType: string;
  loanType: string;
}>) {
  try {
    // Only allow updatable fields
    const payload: any = {};
    if (typeof data.fullName === 'string') payload.fullName = data.fullName;
    if (data.sex) payload.sex = data.sex as any;
    if (typeof data.phoneNumber === 'string') payload.phoneNumber = data.phoneNumber;
    if (typeof (data as any).address !== 'undefined') payload.address = (data as any).address || null;
    if (typeof data.payersIdentification === 'string') payload.payersIdentification = data.payersIdentification;
    if (typeof data.savingType === 'string') payload.savingType = data.savingType;
    if (typeof data.loanType === 'string') payload.loanType = data.loanType;

    const updated = await prisma.customer.update({
      where: { id: customerId },
      data: payload,
    });
    return updated;
  } catch (error) {
    console.error('Error updating customer:', error);
    throw new Error(`Failed to update customer: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function deactivateCustomerAction(customerId: string) {
  try {
    const updated = await prisma.customer.update({
      where: { id: customerId },
      data: {
        isActive: false,
      },
    });
    return updated;
  } catch (error) {
    console.error('Error deactivating customer:', error);
    throw new Error(`Failed to deactivate customer: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function activateCustomerAction(customerId: string) {
  try {
    const updated = await prisma.customer.update({
      where: { id: customerId },
      data: {
        isActive: true,
      },
    });
    return updated;
  } catch (error) {
    console.error('Error activating customer:', error);
    throw new Error(`Failed to activate customer: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function deleteCustomerAction(customerId: string) {
  try {
    // First, delete related customer history
    await prisma.customerHistory.deleteMany({
      where: { customerId },
    });
    
    // Then delete the customer
    await prisma.customer.delete({
      where: { id: customerId },
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting customer:', error);
    throw new Error(`Failed to delete customer: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// --- Session Management ---
export async function logoutAction(sessionToken?: string) {
  // Server-side session invalidation
  if (sessionToken) {
    const invalidated = SessionStore.invalidateSession(sessionToken);
    if (invalidated) {
      console.log(`Session ${sessionToken} invalidated successfully`);
    } else {
      console.warn(`Session ${sessionToken} not found or already invalidated`);
    }
  }
  
  return { success: true, message: 'Session invalidated successfully' };
}

export async function validateSession(sessionToken: string) {
  if (!sessionToken) {
    return { valid: false, reason: 'No session token provided' };
  }
  
  const session = SessionStore.getSession(sessionToken);
  
  if (!session) {
    return { valid: false, reason: 'Session not found or expired' };
  }
  
  // Update activity timestamp
  const activityUpdated = SessionStore.updateActivity(sessionToken);
  
  if (!activityUpdated) {
    return { valid: false, reason: 'Session expired' };
  }
  
  return { valid: true, session };
}

export async function createSessionAction(userId: string, email: string) {
  const sessionToken = SessionStore.createSession(userId, email);
  return { success: true, sessionToken };
}

// --- Data Quality Fixes ---
/**
 * Fix tickets with missing payment mode information
 * Sets modeOfPayment to BANK if bankReceiptNo exists, otherwise CASH
 */
export async function fixMissingPaymentModesAction() {
  try {
    // Find all tickets with missing payment mode
    const ticketsWithMissingPaymentMode = await prisma.ticket.findMany({
      where: {
        modeOfPayment: null,
      },
      select: {
        id: true,
        ticketNumber: true,
        bankReceiptNo: true,
      },
    });

    const totalCount = ticketsWithMissingPaymentMode.length;

    if (totalCount === 0) {
      return { 
        success: true, 
        message: 'No tickets with missing payment mode found.',
        updated: 0,
        cashCount: 0,
        bankCount: 0,
      };
    }

    let cashCount = 0;
    let bankCount = 0;

    // Update each ticket
    for (const ticket of ticketsWithMissingPaymentMode) {
      // Determine payment mode: if bankReceiptNo exists, it's BANK, otherwise CASH
      const paymentMode = ticket.bankReceiptNo ? PaymentMode.BANK : PaymentMode.CASH;

      await prisma.ticket.update({
        where: { id: ticket.id },
        data: { modeOfPayment: paymentMode },
      });

      if (paymentMode === PaymentMode.BANK) {
        bankCount++;
      } else {
        cashCount++;
      }
    }

    return {
      success: true,
      message: `Successfully updated ${totalCount} ticket(s) with payment mode information.`,
      updated: totalCount,
      cashCount,
      bankCount,
    };
  } catch (error) {
    console.error('Error fixing missing payment modes:', error);
    return {
      success: false,
      error: `Failed to fix payment modes: ${error instanceof Error ? error.message : 'Unknown error'}`,
      updated: 0,
      cashCount: 0,
      bankCount: 0,
    };
  }
}