
'use server';

/**
 * @fileOverview Generates an HTML ticket from payment details.
 *
 * - generateTicketHtml - A function that generates an HTML ticket.
 * - GenerateTicketHtmlInput - The input type for the generateTicketHtml function.
 * - GenerateTicketHtmlOutput - The return type for the generateTicketHtml function.
 */

import { z } from 'zod';
import fs from 'fs/promises';
import path from 'path';

const GenerateTicketHtmlInputSchema = z.object({
  name: z.string().describe('The name of the customer.'),
  phoneNumber: z.string().describe("The customer's phone number."),
  reasonForPayment: z.string().describe('The reason for the payment.'),
  cashInFigure: z.number().describe('The amount paid, in figures.'),
  amountInWords: z.string().describe('The amount paid, in words.'),
  payersIdentification: z.string().optional().describe("The payer's identification number."),
  modeOfPayment: z.enum(['CASH', 'BANK']).describe('The method of payment.'),
  bankReceiptNo: z.string().optional().describe('The bank receipt number, if applicable.'),
  preparedBy: z.string().describe('The name of the person who prepared the ticket.'),
  cashierSignature: z.string().optional().describe('The name of the cashier for signature.'),
  date: z.string().describe('The date of the transaction.'),
  receiptNo: z.string().describe('The sequential receipt number.'),
});
export type GenerateTicketHtmlInput = z.infer<typeof GenerateTicketHtmlInputSchema>;

const GenerateTicketHtmlOutputSchema = z.object({
  htmlContent: z.string().describe('The HTML content of the ticket, formatted as a single, self-contained HTML document.'),
});
export type GenerateTicketHtmlOutput = z.infer<typeof GenerateTicketHtmlOutputSchema>;

async function loadStampDataUrl(): Promise<string | null> {
  const candidates = [
    { file: path.resolve(process.cwd(), "public", "stamp.png"), webPath: "/stamp.png" },
    { file: path.resolve(process.cwd(), "public", "images", "company-stamp.png"), webPath: "/images/company-stamp.png" },
  ];

  console.log("[Stamp] Resolving stamp asset path...");

  for (const candidate of candidates) {
    try {
      await fs.access(candidate.file);
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL?.trim().replace(/\/$/, "") || "";
      const resolvedUrl = baseUrl ? `${baseUrl}${candidate.webPath}` : candidate.webPath;
      console.log("[Stamp] Using stamp image:", candidate.file, "->", resolvedUrl);
      return resolvedUrl;
    } catch {
      console.log("[Stamp] Not found at:", candidate.file);
    }
  }

  console.warn("[Stamp] No stamp image found in the public directory. Place stamp.png under /public to enable the watermark.");
  return null;
}

export async function generateTicketHtml(input: GenerateTicketHtmlInput): Promise<GenerateTicketHtmlOutput> {
  const transactionId = Date.now().toString() + Math.floor(100 + Math.random() * 900).toString();
  const transactionTime = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });

  const stampDataUrl = await loadStampDataUrl();

  // Use data URL if found, otherwise use empty string to hide broken image
  const stampSrc = stampDataUrl || '';
  
  if (!stampSrc) {
    console.warn('[Stamp] No stamp image available. Ticket will be generated without stamp.');
  } else {
    console.log('[Stamp] Stamp image ready, will be included in ticket.');
  }

  const htmlContent = createTicketHtml({
    ...input,
    transactionId,
    time: transactionTime,
  }, stampSrc);

  return { htmlContent };
}


function createTicketHtml(
  data: GenerateTicketHtmlInput & { transactionId: string, time: string },
  stampSrc: string
): string {
  const { 
    receiptNo,
    date,
    time,
    name,
    reasonForPayment,
    cashInFigure,
    preparedBy,
    payersIdentification,
    modeOfPayment,
    bankReceiptNo,
    transactionId,
  } = data;
  
  const stampPath = stampSrc;
  
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Payment Receipt</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">
        <style>
            body { 
                font-family: 'Roboto', sans-serif; 
                background-color: #f0f2f5; 
                color: #1a202c; 
                margin: 0; 
                padding: 1rem;
                display: flex;
                justify-content: center;
                align-items: flex-start;
                min-height: 100vh;
            }
            .receipt-container { 
                max-width: 450px; 
                width: 100%;
                background-color: #ffffff; 
                border-radius: 16px; 
                box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
                overflow: hidden;
            }
            .header {
                background-color: #5D4037; /* Dark Brown */
                color: white;
                padding: 1.5rem;
                text-align: center;
                border-bottom: 5px solid #8B4513; /* Brown Accent */
            }
            .header h1 {
                margin: 0;
                font-size: 1.5rem;
                font-weight: 700;
            }
             .details-card {
                margin: 1.5rem;
                border: 1px solid #e2e8f0;
                border-radius: 8px;
                overflow: hidden;
             }
             .card-header {
                background-color: #795548; /* Medium Brown */
                color: white;
                padding: 0.75rem 1.25rem;
                font-weight: 500;
             }
            .details-grid { 
                padding: 1.25rem;
                display: grid;
                gap: 1rem;
                position: relative;
            }
            .detail-item {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                padding-bottom: 1rem;
                border-bottom: 1px dashed #cbd5e1;
            }
            .detail-item:last-child {
                border-bottom: none;
                padding-bottom: 0;
            }
            .label { 
                font-weight: 500; 
                color: #4a5568;
                flex-basis: 40%;
            }
            .value { 
                font-weight: 500;
                color: #1a202c;
                text-align: right;
                flex-basis: 60%;
            }
            .value .sub-value {
                display: block;
                font-size: 0.875rem;
                color: #718096;
            }
             .value-amount {
                font-size: 1.25rem;
                font-weight: 700;
                color: #5D4037;
             }
             .watermark {
                position: absolute;
                inset: 0;
                display: flex;
                align-items: center;
                justify-content: center;
                pointer-events: none;
                z-index: 0;
             }
             .watermark img {
                max-width: 80%;
                opacity: 0.42; /* Increase visibility */
                mix-blend-mode: multiply; /* Preserve stamp color and blend with paper */
                filter: none; /* Keep original blue */
             }
             .footer {
                padding: 1.5rem;
                text-align: center;
                font-size: 0.8rem;
                color: #718096;
                background-color: #f7fafc;
             }
        </style>
    </head>
    <body>
        <div class="receipt-container">
            <div class="header">
                <h1>Gihon Saccos</h1>
            </div>
            <div class="details-card">
                 <div class="card-header">Payment Details</div>
                 <div class="details-grid">
                    ${stampPath ? `<div class="watermark"><img src="${stampPath}" alt="Company Stamp" onerror="this.style.display='none'" /></div>` : ''}
                    <div class="detail-item">
                        <div class="label">Transaction Time</div>
                        <div class="value">
                            ${date}
                            <span class="sub-value">${time}</span>
                        </div>
                    </div>
                     <div class="detail-item">
                        <div class="label">Transaction Type</div>
                        <div class="value">${reasonForPayment}</div>
                    </div>
                     <div class="detail-item">
                        <div class="label">Amount</div>
                        <div class="value value-amount">${cashInFigure.toFixed(2)} ETB</div>
                    </div>
                     <div class="detail-item">
                        <div class="label">Customer Name</div>
                        <div class="value">${name}</div>
                    </div>
                     <div class="detail-item">
                        <div class="label">Sales Name</div>
                        <div class="value">${preparedBy}</div>
                    </div>
                    <div class="detail-item">
                        <div class="label">Payment Mode</div>
                        <div class="value">${modeOfPayment === 'BANK' ? 'Bank' : 'Cash'}</div>
                    </div>
                    ${modeOfPayment === 'BANK' && bankReceiptNo ? `
                    <div class="detail-item">
                        <div class="label">Bank Receipt No</div>
                        <div class="value">${bankReceiptNo}</div>
                    </div>
                    ` : ''}
                     ${payersIdentification ? `
                     <div class="detail-item">
                        <div class="label">Payer ID</div>
                        <div class="value">${payersIdentification}</div>
                    </div>
                     ` : ''}
                     <div class="detail-item">
                        <div class="label">Ticket No</div>
                        <div class="value">${receiptNo}</div>
                    </div>
                     <div class="detail-item">
                        <div class="label">Transaction ID</div>
                        <div class="value">${transactionId}</div>
                    </div>
                 </div>
            </div>
            <div class="footer">
                Thank you for your payment!
            </div>
        </div>
    </body>
    </html>
  `;
}


// Genkit flow removed; using local HTML generation for reliability.
