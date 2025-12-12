import { PrismaClient, Role, Sex, PaymentMode } from '../src/generated/prisma';
import bcrypt from 'bcryptjs';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set. Please configure a MySQL connection string before running the seed script.');
}

if (!process.env.DATABASE_URL.startsWith('mysql://')) {
  throw new Error('This seed script now targets MySQL. Please update DATABASE_URL to a MySQL connection string (mysql://username:password@host:port/database).');
}

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create branches
  const mainBranch = await prisma.branch.upsert({
    where: { name: 'Main Branch' },
    update: {},
    create: {
      name: 'Main Branch',
      address: 'Addis Ababa, Ethiopia',
      phone: '+251-11-123-4567',
      email: 'main@gihon.com',
    },
  });

  const boleBranch = await prisma.branch.upsert({
    where: { name: 'Bole Branch' },
    update: {},
    create: {
      name: 'Bole Branch',
      address: 'Bole, Addis Ababa, Ethiopia',
      phone: '+251-11-234-5678',
      email: 'bole@gihon.com',
    },
  });

  console.log('✅ Branches created');

  // Hash password for users
  const hashedPassword = await bcrypt.hash('password123', 10);

  // Create users
  const superAdmin = await prisma.user.upsert({
    where: { email: 'superadmin@test.com' },
    update: {},
    create: {
      email: 'superadmin@test.com',
      name: 'Super Admin',
      password: hashedPassword,
      role: Role.SUPERADMIN,
      branchId: mainBranch.id,
      isActive: true,
    },
  });

  const admin = await prisma.user.upsert({
    where: { email: 'admin@test.com' },
    update: {},
    create: {
      email: 'admin@test.com',
      name: 'Branch Admin',
      password: hashedPassword,
      role: Role.ADMIN,
      branchId: mainBranch.id,
      isActive: true,
    },
  });

  const salesUser = await prisma.user.upsert({
    where: { email: 'sales@test.com' },
    update: {},
    create: {
      email: 'sales@test.com',
      name: 'Sales User',
      password: hashedPassword,
      role: Role.SALES,
      branchId: mainBranch.id,
      isActive: true,
      ticketNumberStart: 1001,
      ticketNumberEnd: 2000,
      currentTicketNumber: 1001,
    },
  });

  const auditor = await prisma.user.upsert({
    where: { email: 'auditor@test.com' },
    update: {},
    create: {
      email: 'auditor@test.com',
      name: 'Auditor User',
      password: hashedPassword,
      role: Role.AUDITOR,
      branchId: mainBranch.id,
      isActive: true,
    },
  });

  const operation = await prisma.user.upsert({
    where: { email: 'operation@test.com' },
    update: {},
    create: {
      email: 'operation@test.com',
      name: 'Operation User',
      password: hashedPassword,
      role: Role.OPERATION,
      branchId: mainBranch.id,
      isActive: true,
    },
  });

  const boleSales = await prisma.user.upsert({
    where: { email: 'sales@bole.com' },
    update: {},
    create: {
      email: 'sales@bole.com',
      name: 'Bole Sales',
      password: hashedPassword,
      role: Role.SALES,
      branchId: boleBranch.id,
      isActive: false,
    },
  });

  console.log('✅ Users created');

  // Create sample customers
  const customer1 = await prisma.customer.upsert({
    where: { payersIdentification: 'ID-001' },
    update: {},
    create: {
      fullName: 'John Doe',
      sex: Sex.MALE,
      phoneNumber: '0912345678',
      address: 'Kazanchis, Addis Ababa',
      payersIdentification: 'ID-001',
      savingType: 'GIHON Regular Saving Account',
      loanType: 'Tiguhan small business loan',
      branchId: mainBranch.id,
    },
  });

  const customer2 = await prisma.customer.upsert({
    where: { payersIdentification: 'ID-002' },
    update: {},
    create: {
      fullName: 'Jane Smith',
      sex: Sex.FEMALE,
      phoneNumber: '0912345679',
      address: 'Bole, Addis Ababa',
      payersIdentification: 'ID-002',
      savingType: 'Michu Current Saving Account',
      loanType: 'Mothers Loan',
      branchId: boleBranch.id,
    },
  });

  console.log('✅ Sample customers created');

  // Create sample tickets (use upsert to handle existing data)
  const ticket1 = await prisma.ticket.upsert({
    where: { ticketNumber: 'TKT-1001' },
    update: {},
    create: {
      ticketNumber: 'TKT-1001',
      name: customer1.fullName,
      phoneNumber: customer1.phoneNumber,
      reasonForPayment: 'Tiguhan small business loan',
      cashInFigure: 5000.00,
      amountInWords: 'Five thousand birr only',
      payersIdentification: customer1.payersIdentification,
      modeOfPayment: PaymentMode.CASH,
      preparedBy: salesUser.name,
      userId: salesUser.id,
      customerId: customer1.id,
      branchId: mainBranch.id,
    },
  });

  const ticket2 = await prisma.ticket.upsert({
    where: { ticketNumber: 'TKT-1002' },
    update: {},
    create: {
      ticketNumber: 'TKT-1002',
      name: customer2.fullName,
      phoneNumber: customer2.phoneNumber,
      reasonForPayment: 'Mothers Loan',
      cashInFigure: 3000.00,
      amountInWords: 'Three thousand birr only',
      payersIdentification: customer2.payersIdentification,
      modeOfPayment: PaymentMode.BANK,
      bankReceiptNo: 'BR-1234',
      preparedBy: salesUser.name,
      userId: salesUser.id,
      customerId: customer2.id,
      branchId: boleBranch.id,
    },
  });

  console.log('✅ Sample tickets created');

  // Create SMS logs
  await prisma.smsLog.create({
    data: {
      ticketId: ticket1.id,
      phoneNumber: customer1.phoneNumber,
      message: `Dear ${customer1.fullName}, Your payment of ETB 5000.00 has been processed. Ticket: ${ticket1.ticketNumber}`,
      status: 'SENT',
      messageId: 'msg_001',
      sentAt: new Date(),
    },
  });

  console.log('✅ Sample SMS logs created');

  console.log('🎉 Database seeded successfully!');
  console.log('\n📊 Summary:');
  console.log(`- Branches: 2`);
  console.log(`- Users: 6`);
  console.log(`- Customers: 2`);
  console.log(`- Tickets: 2`);
  console.log(`- SMS Logs: 1`);
  console.log('\n🔑 Default login credentials:');
  console.log('Super Admin: superadmin@test.com / password123');
  console.log('Admin: admin@test.com / password123');
  console.log('Sales: sales@test.com / password123');
  console.log('Auditor: auditor@test.com / password123');
  console.log('Operation: operation@test.com / password123');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
