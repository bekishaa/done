/**
 * Quick Fix Script for Login Issues in cPanel
 * 
 * This script:
 * 1. Tests database connection
 * 2. Checks if users exist
 * 3. Creates default superadmin user if database is empty
 * 4. Lists existing users
 * 
 * Usage: node scripts/quick-fix-login.js
 */

function sanitizeConnectionString(url) {
  return url ? url.replace(/\/\/.+?:.+?@/, "//***:***@") : url;
}

// Set default DATABASE_URL if not provided
if (!process.env.DATABASE_URL) {
  const defaultMysqlUrl = "mysql://root:password@localhost:3306/receiptrocket";
  process.env.DATABASE_URL = process.env.MYSQL_URL || defaultMysqlUrl;
  console.log(`[Quick Fix] DATABASE_URL not set, using default: ${sanitizeConnectionString(process.env.DATABASE_URL)}`);
} else {
  console.log(`[Quick Fix] Using DATABASE_URL: ${sanitizeConnectionString(process.env.DATABASE_URL)}`);
}

const dbUrl = process.env.DATABASE_URL;

if (dbUrl.startsWith('file:')) {
  console.error('[Quick Fix] ❌ Detected SQLite connection string.');
  console.error('This project now targets MySQL exclusively. Please update DATABASE_URL to the format:');
  console.error('mysql://USERNAME:PASSWORD@HOST:PORT/DATABASE');
  process.exit(1);
}

// Import Prisma client
let PrismaClient;
try {
  PrismaClient = require('../src/generated/prisma').PrismaClient;
} catch (error) {
  console.error('[Quick Fix] ❌ Failed to import Prisma Client');
  console.error('[Quick Fix] Error:', error.message);
  console.error('[Quick Fix] Please run: npx prisma generate');
  process.exit(1);
}

const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function quickFix() {
  try {
    console.log('\n🔧 Quick Fix for Login Issues\n');
    console.log('='.repeat(50));
    
    // Test connection
    console.log('\n[1/4] Testing database connection...');
    await prisma.$connect();
    console.log('✅ Database connected successfully');
    
    // Check if users exist
    console.log('\n[2/4] Checking existing users...');
    const userCount = await prisma.user.count();
    console.log(`Found ${userCount} user(s) in database`);
    
    if (userCount === 0) {
      console.log('\n[3/4] No users found. Creating default superadmin user...');
      
      const hashedPassword = await bcrypt.hash('password123', 10);
      
      const superAdmin = await prisma.user.create({
        data: {
          email: 'superadmin@test.com',
          name: 'Super Admin',
          password: hashedPassword,
          role: 'superadmin',
          branchId: 'main-branch',
          isActive: true,
          failedLoginAttempts: 0,
          isLocked: false,
        },
      });
      
      console.log('✅ Default superadmin user created!');
      console.log(`   ID: ${superAdmin.id}`);
      console.log(`   Email: ${superAdmin.email}`);
      console.log(`   Password: password123`);
      
      // Also create other default users
      console.log('\n[4/4] Creating other default users...');
      
      const defaultUsers = [
        { email: 'admin@test.com', name: 'Branch Admin', role: 'admin' },
        { email: 'sales@test.com', name: 'Sales User', role: 'sales' },
        { email: 'auditor@test.com', name: 'Auditor User', role: 'auditor' },
        { email: 'operation@test.com', name: 'Operation User', role: 'operation' },
      ];
      
      for (const userData of defaultUsers) {
        try {
          await prisma.user.create({
            data: {
              email: userData.email,
              name: userData.name,
              password: hashedPassword,
              role: userData.role,
              branchId: 'main-branch',
              isActive: true,
              failedLoginAttempts: 0,
              isLocked: false,
            },
          });
          console.log(`   ✅ Created: ${userData.email}`);
        } catch (error) {
          if (error.code === 'P2002') {
            console.log(`   ⚠️  Already exists: ${userData.email}`);
          } else {
            console.error(`   ❌ Error creating ${userData.email}:`, error.message);
          }
        }
      }
      
    } else {
      console.log('\n[3/4] Listing existing users...');
      const users = await prisma.user.findMany({
        select: { 
          id: true,
          email: true, 
          name: true,
          role: true, 
          isActive: true,
          isLocked: true,
          failedLoginAttempts: true
        },
        orderBy: { email: 'asc' }
      });
      
      console.log('\nExisting users:');
      users.forEach((u, index) => {
        const status = u.isActive ? (u.isLocked ? '🔒 LOCKED' : '✅ Active') : '❌ Inactive';
        console.log(`\n${index + 1}. ${u.email}`);
        console.log(`   Name: ${u.name}`);
        console.log(`   Role: ${u.role}`);
        console.log(`   Status: ${status}`);
        if (u.failedLoginAttempts > 0) {
          console.log(`   Failed attempts: ${u.failedLoginAttempts}`);
        }
      });
      
      // Check if superadmin exists
      const superAdmin = users.find(u => u.email === 'superadmin@test.com');
      if (!superAdmin) {
        console.log('\n[4/4] Superadmin user not found. Creating...');
        const hashedPassword = await bcrypt.hash('password123', 10);
        
        await prisma.user.create({
          data: {
            email: 'superadmin@test.com',
            name: 'Super Admin',
            password: hashedPassword,
            role: 'superadmin',
            branchId: 'main-branch',
            isActive: true,
            failedLoginAttempts: 0,
            isLocked: false,
          },
        });
        
        console.log('✅ Superadmin user created!');
      } else {
        console.log('\n[4/4] Superadmin user exists');
        
        // Unlock if locked
        if (superAdmin.isLocked) {
          console.log('   Unlocking superadmin account...');
          await prisma.user.update({
            where: { email: 'superadmin@test.com' },
            data: {
              isLocked: false,
              failedLoginAttempts: 0,
              lockedAt: null,
            },
          });
          console.log('   ✅ Account unlocked');
        }
      }
    }
    
    console.log('\n' + '='.repeat(50));
    console.log('\n✅ Quick fix completed!\n');
    console.log('📋 Default Login Credentials:');
    console.log('   Email: superadmin@test.com');
    console.log('   Password: password123\n');
    console.log('⚠️  IMPORTANT: Change these passwords in production!\n');
    
  } catch (error) {
    console.error('\n❌ Error during quick fix:');
    console.error('   Type:', error.constructor.name);
    console.error('   Message:', error.message);
    
    if (error.message.includes('ECONNREFUSED') || error.message.includes('connect ECONN')) {
      console.error('\n💡 Solution: MySQL server is unreachable. Check:');
      console.error('   1. Host and port in DATABASE_URL');
      console.error('   2. MySQL service status (is it running?)');
      console.error('   3. Firewall or cPanel remote access settings');
    } else if (error.message.includes('ER_ACCESS_DENIED_ERROR') || error.message.includes('Access denied')) {
      console.error('\n💡 Solution: Invalid MySQL credentials. Verify:');
      console.error('   1. Username & password in DATABASE_URL');
      console.error('   2. User privileges on the target database');
      console.error('   3. Special characters are URL-encoded');
    } else {
      console.error('\n💡 Full error:', error);
    }
    
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the fix
quickFix();

