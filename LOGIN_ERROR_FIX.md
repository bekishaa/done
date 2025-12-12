# Login Error Fix Guide

## Error: "An error occurred during login" or "Login failed"

Follow these steps in order:

## Step 1: Check Server Logs in cPanel

1. Go to **cPanel → Application Manager** (or **Node.js App**)
2. Click on your Receipt Rocket application
3. Click **"Logs"** or **"Error Logs"**
4. Look for messages starting with `[Login]`
5. Check for:
   - `[Login] DATABASE_URL: NOT SET` → Environment variable not loaded
   - `[Login] Database error:` → Connection problem
   - `[Login] User not found` → No users in database

## Step 2: Verify Environment Variables Are Set

1. In cPanel → **Application Manager** → Your App → **Environment Variables**
2. Verify these are set:
   ```
   DATABASE_URL=mysql://appsgiho_user:%23Gihon_60908@localhost:3306/appsgiho_re
   NEXT_PUBLIC_APP_URL=https://fa.apps-gihonsaccos.com
   ```
3. **IMPORTANT:** After setting/changing environment variables, **RESTART your Node.js application** in cPanel!

## Step 3: Test Database Connection

Open **Terminal** or **SSH** in cPanel and run:

```bash
# Navigate to your project
cd ~/public_html  # or wherever your app is located

# Test MySQL connection
mysql -h localhost -u appsgiho_user -p'#Gihon_60908' -e "USE appsgiho_re; SHOW TABLES;"
```

If this fails, your database credentials are wrong.

## Step 4: Create Database Tables

If tables don't exist, run these commands in Terminal/SSH:

```bash
cd ~/public_html  # or your project directory

# Generate Prisma client
npx prisma generate

# Create database tables
npx prisma db push

# Seed default users
npm run db:seed
```

Or use the quick fix script:

```bash
node scripts/quick-fix-login.js
```

## Step 5: Verify Users Exist

Run the diagnostic script:

```bash
node scripts/quick-fix-login.js
```

This will:
- Test database connection
- Show existing users
- Create default users if database is empty

## Step 6: Try Default Login Credentials

After seeding, try logging in with:

- **Email:** `superadmin@test.com`
- **Password:** `password123`

Or check what users exist by running:
```bash
node scripts/quick-fix-login.js
```

## Step 7: Check for Account Lockout

If you've tried logging in multiple times with wrong password, the account might be locked.

Run this in Terminal to unlock:
```bash
node -e "
const { PrismaClient } = require('./src/generated/prisma');
const prisma = new PrismaClient();
(async () => {
  await prisma.user.updateMany({
    where: { isLocked: true },
    data: { isLocked: false, failedLoginAttempts: 0, lockedAt: null }
  });
  console.log('✅ All accounts unlocked');
  await prisma.\$disconnect();
})();
"
```

## Common Issues & Solutions

### Issue 1: "DATABASE_URL: NOT SET"
**Solution:**
- Set `DATABASE_URL` in cPanel environment variables
- **Restart the Node.js application** after setting

### Issue 2: "Database connection error"
**Solution:**
- Verify MySQL credentials are correct
- Check if password special characters are URL-encoded (`#` = `%23`)
- Test connection with: `mysql -h localhost -u appsgiho_user -p'#Gihon_60908' appsgiho_re`

### Issue 3: "User not found" or "Invalid email or password"
**Solution:**
- Run `npm run db:seed` to create default users
- Or run `node scripts/quick-fix-login.js` to create users

### Issue 4: Tables don't exist
**Solution:**
```bash
npx prisma generate
npx prisma db push
npm run db:seed
```

### Issue 5: Environment variables not loading
**Solution:**
- Make sure variables are set in cPanel (not just in `.env` file)
- **Restart the Node.js application** in cPanel after setting variables
- Check logs to confirm variables are loaded

## Quick Diagnostic Commands

Run these in Terminal/SSH to diagnose:

```bash
# 1. Check if DATABASE_URL is set
echo $DATABASE_URL

# 2. Test database connection
node scripts/quick-fix-login.js

# 3. Check if Prisma client is generated
ls -la src/generated/prisma/

# 4. List database tables
mysql -h localhost -u appsgiho_user -p'#Gihon_60908' appsgiho_re -e "SHOW TABLES;"

# 5. Check users in database
mysql -h localhost -u appsgiho_user -p'#Gihon_60908' appsgiho_re -e "SELECT email, role, isActive, isLocked FROM User;"
```

## Still Not Working?

1. Check cPanel error logs for detailed error messages
2. Verify MySQL service is running
3. Confirm database user has ALL PRIVILEGES on the database
4. Try resetting the database user password in cPanel
5. Contact your hosting provider if MySQL connection fails

