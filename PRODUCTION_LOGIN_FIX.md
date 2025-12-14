# Production Login Error Fix Guide

## Quick Fix Checklist

If you're getting "An error occurred during login" on your production site (be.apps-gihonsaccos.com), follow these steps:

## Step 1: Verify Environment Variables in cPanel

1. Go to **cPanel → Application Manager** (or **Node.js App**)
2. Click on your **Receipt Rocket** application
3. Click **"Environment Variables"** or **"Settings"**
4. Verify these are set:

```
DATABASE_URL=mysql://appsgiho_user:%23Gihon_60908@localhost:3306/appsgiho_re
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://be.apps-gihonsaccos.com
NEXT_PUBLIC_BASE_URL=https://be.apps-gihonsaccos.com
NEXTAUTH_URL=https://be.apps-gihonsaccos.com
```

**⚠️ CRITICAL:** After changing environment variables, you MUST **RESTART your Node.js application** in cPanel!

## Step 2: Check Application Logs

1. In cPanel → **Application Manager** → Your App
2. Click **"Logs"** or **"Error Logs"**
3. Look for messages starting with `[Login]`
4. Common errors you'll see:

- `[Login] DATABASE_URL: NOT SET` → Environment variable not configured
- `Access denied for user 'appsgiho_user'` → Wrong password or user doesn't exist
- `ECONNREFUSED` → MySQL server not running or wrong host
- `ER_ACCESS_DENIED_ERROR` → Incorrect MySQL credentials

## Step 3: Test Database Connection

In cPanel Terminal or SSH, run:

```bash
# Test MySQL connection
mysql -h localhost -u appsgiho_user -p'#Gihon_60908' appsgiho_re -e "SELECT 1;"
```

If this fails, your database credentials are wrong. Check:
- Username is correct: `appsgiho_user`
- Password is correct: `#Gihon_60908` (note the `#` character)
- Database exists: `appsgiho_re`

## Step 4: Verify Database Tables Exist

```bash
mysql -h localhost -u appsgiho_user -p'#Gihon_60908' appsgiho_re -e "SHOW TABLES;"
```

You should see tables like:
- `User`
- `Customer`
- `Ticket`
- `CustomerHistory`

If tables are missing, see Step 5.

## Step 5: Create Database Tables (if missing)

In cPanel Terminal, navigate to your project and run:

```bash
cd ~/domains/be.apps-gihonsaccos.com/public_html
# or wherever your project is located

# Create tables
npm run db:push

# Seed default users
npm run db:seed
```

Or use the quick fix script:

```bash
node scripts/quick-fix-login.js
```

## Step 6: Verify Users Exist

```bash
mysql -h localhost -u appsgiho_user -p'#Gihon_60908' appsgiho_re -e "SELECT email, role, isActive FROM User;"
```

You should see users like:
- `superadmin@test.com`
- `admin@test.com`
- `sales@test.com`

If no users exist, run `npm run db:seed` or `node scripts/quick-fix-login.js`

## Step 7: Restart Application

**This is critical!** After making any changes:

1. In cPanel → **Application Manager** → Your App
2. Click **"Restart"** or **"Reload"**
3. Wait for the app to restart
4. Try logging in again

## Common Issues & Solutions

### Issue: "Database authentication failed"
**Solution:**
- Verify `DATABASE_URL` in cPanel environment variables
- Check password is URL-encoded: `%23` for `#`
- Test connection manually with `mysql` command
- Restart application after changing variables

### Issue: "Cannot connect to database"
**Solution:**
- Verify MySQL is running on server
- Check `localhost` is correct (for same-server MySQL)
- Verify MySQL user has proper permissions
- Check Remote MySQL settings in cPanel

### Issue: "Invalid email or password"
**Solution:**
- Database might not be seeded
- Run `npm run db:seed` or `node scripts/quick-fix-login.js`
- Verify users exist in database

### Issue: Environment variables not loading
**Solution:**
- Make sure variables are set in **cPanel Application Manager** (not just in `.env` file)
- **RESTART the application** after setting variables
- Check logs to confirm variables are loaded

## Password Encoding Note

The password `#Gihon_60908` must be URL-encoded in the DATABASE_URL:
- `#` becomes `%23`
- Full password: `%23Gihon_60908`

The application code automatically decodes this, but the environment variable must have the encoded version.

## Default Login Credentials

After seeding, use:
- **Email:** `superadmin@test.com`
- **Password:** `password123`

**⚠️ IMPORTANT:** Change these passwords in production!

## Still Not Working?

1. Check cPanel application logs for detailed error messages
2. Verify MySQL service is running on the server
3. Test database connection manually
4. Ensure all environment variables are set correctly
5. Restart the application after any changes

## Quick Diagnostic Script

Run this in cPanel Terminal to diagnose issues:

```bash
cd ~/domains/be.apps-gihonsaccos.com/public_html
node scripts/quick-fix-login.js
```

This will:
- Test database connection
- Show existing users
- Create default users if database is empty
- Display any connection errors

