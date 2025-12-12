const { PrismaClient, TicketStatus, AuditStatus, PaymentMode } = require('./src/generated/prisma');

const prisma = new PrismaClient();

async function testTicketCreation() {
  try {
    console.log('Testing Prisma client...');
    console.log('TicketStatus:', TicketStatus);
    console.log('AuditStatus:', AuditStatus);
    console.log('PaymentMode:', PaymentMode);
    
    // First, check if we have a user
    const user = await prisma.user.findFirst();
    console.log('Found user:', user ? user.name : 'No user found');
    
    // Check if we have a customer
    const customer = await prisma.customer.findFirst();
    console.log('Found customer:', customer ? customer.fullName : 'No customer found');
    
    if (!user || !customer) {
      console.log('Missing required data. User:', !!user, 'Customer:', !!customer);
      await prisma.$disconnect();
      return;
    }
    
    // Try to create a test ticket
    console.log('\nAttempting to create ticket...');
    const ticket = await prisma.ticket.create({
      data: {
        customerName: customer.fullName,
        customerPhone: customer.phoneNumber,
        paymentAmount: 100.0,
        status: TicketStatus.Failed,
        date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        reasonForPayment: 'Test payment',
        preparedBy: user.name,
        ticketNumber: '000001',
        modeOfPayment: PaymentMode.CASH,
        auditStatus: AuditStatus.Pending,
      },
    });
    
    console.log('✅ Ticket created successfully!', ticket.id);
    
    // Clean up - delete the test ticket
    await prisma.ticket.delete({ where: { id: ticket.id } });
    console.log('✅ Test ticket deleted');
    
  } catch (error) {
    console.error('❌ Error creating ticket:');
    console.error('Error type:', error.constructor.name);
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    if (error.meta) {
      console.error('Error meta:', JSON.stringify(error.meta, null, 2));
    }
    console.error('Full error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testTicketCreation();









