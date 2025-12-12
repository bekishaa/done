#!/usr/bin/env node

/**
 * Pre-deployment script for cPanel
 * 
 * This script prepares your project for cPanel deployment.
 * 
 * Note: This project uses mysql2 directly (not Prisma), so no client generation is needed.
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 Preparing Receipt Rocket for cPanel Deployment...\n');

// Verify database configuration exists
const envPath = path.join(__dirname, '..', '.env');
const envLocalPath = path.join(__dirname, '..', '.env.local');

console.log('📋 Step 1: Checking environment configuration...');
if (!fs.existsSync(envPath) && !fs.existsSync(envLocalPath)) {
  console.warn('  ⚠️  Warning: No .env or .env.local file found.');
  console.warn('  Make sure to set DATABASE_URL in your cPanel environment variables.\n');
} else {
  console.log('  ✅ Environment file found\n');
}

// Verify database connection file exists
const dbMysqlPath = path.join(__dirname, '..', 'src', 'lib', 'db-mysql.ts');
if (fs.existsSync(dbMysqlPath)) {
  console.log('  ✅ Database layer (mysql2) found\n');
} else {
  console.error('  ❌ Error: Database layer not found at:', dbMysqlPath);
  process.exit(1);
}

console.log('✅ Preparation complete!\n');
console.log('📦 Next steps for cPanel deployment:');
console.log('   1. Set environment variables in cPanel:');
console.log('      - DATABASE_URL=mysql://user:password@host:port/database');
console.log('      - NODE_ENV=production');
console.log('      - (Optional) AFRO_API_KEY, AFRO_SENDER_NAME for SMS\n');
console.log('   2. Deploy to cPanel:');
console.log('      - Upload your project (or pull from Git)');
console.log('      - Run: npm install --production');
console.log('      - Run: npm run build');
console.log('      - Start your application (Node.js app)\n');
console.log('   3. Test the connection:');
console.log('      node scripts/quick-fix-login.js\n');
console.log('✅ No Prisma generation needed - using mysql2 directly!\n');














