# cPanel Deployment Troubleshooting Guide

## Login Error: "An error occurred during login"

If you're getting this error when trying to log in on your cPanel-hosted site, follow these steps:

## Step 1: Check Database Setup

### 1.1 Verify DATABASE_URL Format

In cPanel → **Application Manager** (or **Environment Variables**), confirm that `DATABASE_URL` exists and matches the MySQL syntax:

```
mysql://USERNAME:PASSWORD@HOST:PORT/DATABASE
```

Examples:
- `mysql://appuser:SuperSecret@localhost:3306/receiptrocket`
- `mysql://appuser:SuperSecret@server123.yourhost.com:3306/appuser_receiptrocket`

### 1.2 Test MySQL Credentials

Open **Terminal** (or SSH) in cPanel and run:

```bash
mysql -h <host> -u <user> -p'<password>' -e "SHOW DATABASES;"
```

Replace `<host>`, `<user>`, `<password>` with the values from `DATABASE_URL`. If this command fails, fix the credentials or grant privileges before continuing.

### 1.3 Confirm Database and Tables

Once logged in to MySQL, ensure the Prisma tables exist:

```sql
USE <database_name>;
SHOW TABLES;
```

If tables are missing, run the setup commands in **Step 2**.

## Step 2: Create and Seed Database

### 2.1 Access Terminal/SSH

In cPanel, use **Terminal** or **SSH Access** to run commands:

```bash
# Navigate to your project directory
cd ~/public_html  # or wherever your project is located

# Install dependencies (if not already done)
npm install

# Generate Prisma client
npx prisma generate

# Create database schema
npx prisma db push

# Seed database with default users
npx prisma db seed
```

### 2.2 Alternative: Use Node.js Script

If you can't use terminal, create a setup script:

1. Create a file `setup-db.js` in your project root:
```javascript
const { execSync } = require('child_process');
const path = require('path');

console.log('Setting up database...');

try {
  // Generate Prisma client
  console.log('Generating Prisma client...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  
  // Push schema
  console.log('Creating database schema...');
  execSync('npx prisma db push', { stdio: 'inherit' });
  
  // Seed database
  console.log('Seeding database...');
  execSync('npx prisma db seed', { stdio: 'inherit' });
  
  console.log('✅ Database setup complete!');
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}
```

2. Run it via Node.js App in cPanel or via terminal:
```bash
node setup-db.js
```

## Step 3: Allow Remote Access (if needed)

If your MySQL server requires IP whitelisting:

1. In cPanel, open **Remote MySQL**
2. Add the server's public IP address (or `127.0.0.1` for same-server apps)
3. Restart the Node.js application after updating the access list

## Step 4: Verify Environment Variables

In cPanel, ensure these environment variables are set:

```env
DATABASE_URL=mysql://your_db_user:your_password@localhost:3306/your_db_name
NODE_ENV=production
```

**Important:** After changing environment variables, **restart your Node.js application** in cPanel!

## Step 5: Check Server Logs

1. In cPanel, go to **Application Manager** or **Node.js App**
2. Click on your application
3. View **Logs** or **Error Logs**
4. Look for `[Login]` prefixed messages to see what's happening

Common errors you might see:
- `DATABASE_URL: NOT SET` - Environment variable not configured
- `ER_ACCESS_DENIED_ERROR` - Incorrect MySQL username/password
- `ECONNREFUSED 127.0.0.1:3306` - MySQL server not reachable from cPanel

## Step 6: Manual Database Check

If you have database access, verify users exist:

1. Use Prisma Studio (if accessible):
```bash
npx prisma studio
```

2. Or use the MySQL CLI / phpMyAdmin:
```bash
mysql -h <host> -u <user> -p<password> appsgiho_receiptrocket_db -e "SELECT email, role, isActive FROM User;"
```

You should see:
- `superadmin@test.com` with role `superadmin`
- `admin@test.com` with role `admin`
- etc.

## Step 7: Quick Fix Script

Create a file `quick-fix-login.js` in your project root:

```javascript
const { PrismaClient } = require('./src/generated/prisma');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function quickFix() {
  try {
    console.log('Checking database connection...');
    
    // Test connection
    await prisma.$connect();
    console.log('✅ Database connected');
    
    // Check if users exist
    const userCount = await prisma.user.count();
    console.log(`Found ${userCount} users in database`);
    
    if (userCount === 0) {
      console.log('No users found. Creating default user...');
      
      const hashedPassword = await bcrypt.hash('password123', 10);
      
      await prisma.user.create({
        data: {
          email: 'superadmin@test.com',
          name: 'Super Admin',
          password: hashedPassword,
          role: 'superadmin',
          branchId: 'main-branch',
          isActive: true,
        },
      });
      
      console.log('✅ Default user created!');
      console.log('Email: superadmin@test.com');
      console.log('Password: password123');
    } else {
      // List existing users
      const users = await prisma.user.findMany({
        select: { email: true, role: true, isActive: true }
      });
      console.log('Existing users:');
      users.forEach(u => {
        console.log(`  - ${u.email} (${u.role}) - Active: ${u.isActive}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Full error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

quickFix();
```

Run it:
```bash
node quick-fix-login.js
```

## Step 8: Common Issues and Solutions

### Issue: "Database connection error"
**Solution:** 
- Confirm `DATABASE_URL` matches `mysql://user:pass@host:3306/db`
- Test the credentials via `mysql -h host -u user -p db`
- Verify the MySQL user has `ALL PRIVILEGES` on the target database
- If connecting remotely, whitelist your server IP under **Remote MySQL**

### Issue: "Invalid email or password"
**Solution:**
- Database might not be seeded
- Run `npx prisma db seed`
- Or use the quick-fix script above

### Issue: "Account is locked"
**Solution:**
- Too many failed login attempts
- Reset in database or wait for lockout period

### Issue: "Relation does not exist" / missing tables
**Solution:**
- Run `npx prisma db push` to create tables
- Re-run `npx prisma db seed` to populate default data
- Confirm you're pointing to the correct MySQL database

## Step 9: Verify After Fix

After applying fixes:

1. **Restart your Node.js application** in cPanel
2. Try logging in with:
   - Email: `superadmin@test.com`
   - Password: `password123`
3. Check server logs for `[Login]` messages
4. If still failing, check logs for specific error messages

## Step 10: Contact Support

If none of the above works, provide these details:

1. Error message from login page
2. Server logs (especially `[Login]` messages)
3. `DATABASE_URL` value (without sensitive info)
4. MySQL host/database name you are connecting to
5. Whether `mysql -h host -u user -p` succeeds from the server
6. Output of `npx prisma db seed` command

## Default Login Credentials

After seeding, use these credentials:

| Role | Email | Password |
|------|-------|----------|
| Super Admin | superadmin@test.com | password123 |
| Admin | admin@test.com | password123 |
| Sales | sales@test.com | password123 |
| Auditor | auditor@test.com | password123 |
| Operation | operation@test.com | password123 |

**⚠️ IMPORTANT:** Change these passwords in production!

