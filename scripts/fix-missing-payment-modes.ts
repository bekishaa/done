#!/usr/bin/env tsx

/**
 * Script to fix tickets with missing payment mode information
 * 
 * This script:
 * 1. Finds all tickets where modeOfPayment is null/undefined
 * 2. If a ticket has a bankReceiptNo, sets modeOfPayment to BANK
 * 3. Otherwise, sets modeOfPayment to CASH (default behavior)
 */

import { PrismaClient, PaymentMode } from '@prisma/client';

const prisma = new PrismaClient();

async function fixMissingPaymentModes() {
  console.log('🔍 Searching for tickets with missing payment mode...\n');

  try {
    // Find all tickets with missing payment mode
    const ticketsWithMissingPaymentMode = await prisma.ticket.findMany({
      where: {
        OR: [
          { modeOfPayment: null },
          { modeOfPayment: undefined as any },
        ],
      },
      select: {
        id: true,
        ticketNumber: true,
        paymentAmount: true,
        bankReceiptNo: true,
        date: true,
        customerName: true,
      },
    });

    const totalCount = ticketsWithMissingPaymentMode.length;

    if (totalCount === 0) {
      console.log('✅ No tickets with missing payment mode found. All tickets are up to date!');
      return;
    }

    console.log(`📊 Found ${totalCount} ticket(s) with missing payment mode:\n`);

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
        console.log(`  ✓ ${ticket.ticketNumber} → BANK (has bank receipt: ${ticket.bankReceiptNo})`);
      } else {
        cashCount++;
        console.log(`  ✓ ${ticket.ticketNumber} → CASH`);
      }
    }

    console.log(`\n✅ Successfully updated ${totalCount} ticket(s):`);
    console.log(`   - ${cashCount} set to CASH`);
    console.log(`   - ${bankCount} set to BANK`);
    console.log('\n🎉 Data quality issue resolved!');

  } catch (error) {
    console.error('❌ Error fixing payment modes:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
fixMissingPaymentModes()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error('Script failed:', error);
    process.exit(1);
  });

