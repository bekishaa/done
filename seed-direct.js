const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

const DATABASE_URL = process.env.DATABASE_URL || 'mysql://root:@localhost:3306/receiptrocket';

// Parse DATABASE_URL
const url = new URL(DATABASE_URL.replace('mysql://', 'http://'));
const config = {
  host: url.hostname,
  port: url.port || 3306,
  user: url.username || 'root',
  password: url.password || '',
  database: url.pathname.replace('/', '') || 'receiptrocket',
  multipleStatements: true
};

async function seed() {
  console.log('🌱 Starting database seed...');
  console.log(`Connecting to ${config.database}...`);

  const connection = await mysql.createConnection(config);

  try {
    // Hash password
    const hashedPassword = await bcrypt.hash('password123', 10);
    console.log('✅ Password hashed');

    // Create users (branchId is just a string, not a foreign key)
    await connection.query(`
      INSERT INTO user (id, email, name, password, role, branchId, isActive, failedLoginAttempts, isLocked, createdAt, updatedAt, ticketNumberStart, ticketNumberEnd, currentTicketNumber) VALUES
      ('user_superadmin', 'superadmin@test.com', 'Super Admin', ?, 'SUPERADMIN', 'branch_main', true, 0, false, NOW(), NOW(), NULL, NULL, NULL),
      ('user_admin', 'admin@test.com', 'Branch Admin', ?, 'ADMIN', 'branch_main', true, 0, false, NOW(), NOW(), NULL, NULL, NULL),
      ('user_sales', 'sales@test.com', 'Sales User', ?, 'SALES', 'branch_main', true, 0, false, NOW(), NOW(), 1001, 2000, 1001),
      ('user_auditor', 'auditor@test.com', 'Auditor User', ?, 'AUDITOR', 'branch_main', true, 0, false, NOW(), NOW(), NULL, NULL, NULL),
      ('user_operation', 'operation@test.com', 'Operation User', ?, 'OPERATION', 'branch_main', true, 0, false, NOW(), NOW(), NULL, NULL, NULL)
      ON DUPLICATE KEY UPDATE email=email;
    `, [hashedPassword, hashedPassword, hashedPassword, hashedPassword, hashedPassword]);
    console.log('✅ Users created');

    console.log('\n✅ Database seeded successfully!');
    console.log('\nLogin credentials:');
    console.log('  Email: sales@test.com');
    console.log('  Password: password123');

  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    throw error;
  } finally {
    await connection.end();
  }
}

seed().catch(console.error);

