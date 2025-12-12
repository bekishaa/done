# cPanel MySQL Database Setup Guide

This guide will help you create a MySQL database in cPanel and connect it to your Receipt Rocket application.

> **Note:** This application uses MySQL exclusively. All database operations require a MySQL connection.

## 🚀 Quick Start Summary

1. **Create database** in cPanel → MySQL Database Wizard
2. **Create user** with ALL PRIVILEGES
3. **Set `DATABASE_URL`** in cPanel environment variables
4. **Run commands:** `npx prisma generate` → `npx prisma db push` → `npm run db:seed`
5. **Test connection** with `node scripts/quick-fix-login.js`

**Total time:** ~5-10 minutes

> All database assets (schema, seed script, setup automation, SQL snapshot) are in the `database/` folder.

## Step 1: Create MySQL Database in cPanel

### Visual Walkthrough

1. **Log into cPanel**
   - Navigate to your cPanel dashboard (usually `https://yourdomain.com/cpanel` or `https://yourdomain.com:2083`)

2. **Find the Databases Section**
   - Scroll down to find the **"Databases"** section
   - Look for the **"MySQL Database Wizard"** icon
   - Click on it to start the wizard

3. **Step 1: Create Database**
   - In the **"New Database"** field, enter a name (e.g., `receiptrocket`)
   - **Important:** cPanel automatically prefixes your username, so if your username is `john` and you enter `receiptrocket`, the actual database name will be `john_receiptrocket`
   - Click **"Next Step"** button

4. **Step 2: Create Database User**
   - In the **"Username"** field, enter a username (e.g., `receiptrocket_user`)
   - Again, cPanel will prefix it (e.g., `john_receiptrocket_user`)
   - In the **"Password"** field, enter a strong password
     - Use the **"Password Generator"** button for a secure password
     - **⚠️ SAVE THIS PASSWORD** - you'll need it for the connection string!
   - Click **"Create User"** button

5. **Step 3: Add User to Database**
   - You'll see a page showing your database and user
   - In the **"Add User to Database"** section:
     - Make sure **"ALL PRIVILEGES"** checkbox is selected
   - Click **"Make Changes"** button

6. **Step 4: Complete**
   - You'll see a success message: "You have successfully added a user to a database"
   - **Write down these details** (you'll need them):
     - Database name: `yourusername_receiptrocket`
     - Database user: `yourusername_receiptrocket_user`
     - Database password: `(the password you created)`
     - Database host: Usually `localhost` (shown on the success page)

### Quick Example

If your cPanel username is `john`:
- **Database name you enter:** `receiptrocket` → **Actual name:** `john_receiptrocket`
- **Username you enter:** `receiptrocket_user` → **Actual username:** `john_receiptrocket_user`
- **Password:** `MySecurePass123!` (save this!)
- **Host:** `localhost`

---

## Step 2: Verify Your Database Connection Details

After creating the database, verify the details:

1. **In cPanel, go to "MySQL Databases"** (or "Manage My Databases")
   - You'll see your database listed with full connection details
   - Note the exact database name, username, and host

2. **Typical Connection Details:**
   - **Host**: Usually `localhost` (sometimes `127.0.0.1` or a specific hostname like `mysql.yourdomain.com`)
   - **Port**: `3306` (MySQL default port)
   - **Database Name**: `yourusername_receiptrocket` (with your username prefix)
   - **Username**: `yourusername_receiptrocket_user` (with your username prefix)
   - **Password**: `(the password you created)`

---

## Step 3: Configure Your Application

### 1. Verify Prisma Schema

Your `database/schema.prisma` should already be configured for MySQL:

```prisma
datasource db {
  provider = "mysql"
  url      = env("C:\Users\bereket\Desktop\receiptrocket")
}
```

✅ If it shows `provider = "mysql"`, you're good to go!

### 2. Set Environment Variable

**In cPanel (for production):**

1. Go to **"Application Manager"** or **"Node.js App"** (depending on your cPanel version)
2. Find your Receipt Rocket application
3. Click **"Environment Variables"** or **"Settings"**
4. Add or edit `DATABASE_URL` with this format:

```
mysql://yourusername_receiptrocket_user:your_password@localhost:3306/yourusername_receiptrocket
```

**For local development:**

Create or update `.env.local` file in your project root:

```env
# MySQL Database Connection
DATABASE_URL="mysql://yourusername_receiptrocket_user:your_password@localhost:3306/yourusername_receiptrocket"
```

### Connection String Format

```
mysql://USERNAME:PASSWORD@HOST:PORT/DATABASE_NAME
```

### Real Example

If your details are:
- Username: `john_receiptrocket_user`
- Password: `MySecurePass123!`
- Host: `localhost`
- Database: `john_receiptrocket`

Your connection string would be:
```
mysql://john_receiptrocket_user:MySecurePass123!@localhost:3306/john_receiptrocket
```

**⚠️ Important:** If your password contains special characters like `@`, `#`, `$`, etc., you may need to URL-encode them:
- `@` becomes `%40`
- `#` becomes `%23`
- `$` becomes `%24`
- `%` becomes `%25`
- etc.

---

## Step 4: Install Database Driver

The MySQL driver should already be installed. If not, run:

```bash
npm install @prisma/client mysql2
```

✅ Check your `package.json` - `mysql2` should already be listed in dependencies.

---

## Step 5: Generate Prisma Client and Create Database Tables

**In cPanel Terminal/SSH or via Node.js App:**

1. **Generate Prisma Client:**
   ```bash
   npx prisma generate
   ```
   This creates the Prisma client code for your MySQL database.

2. **Push Schema to Database:**
   ```bash
   npx prisma db push
   ```
   This will create all the tables (User, Customer, Ticket, etc.) in your MySQL database.

3. **Seed Initial Data (Optional but Recommended):**
   ```bash
   npm run db:seed
   ```
   This creates default users (superadmin, admin, sales, etc.) so you can log in immediately.

   **Default login credentials after seeding:**
   - Email: `superadmin@test.com`
   - Password: `password123`
   
   ⚠️ **Change these passwords in production!**

---

## Step 6: Verify Connection

Test your database connection:

```bash
npx prisma studio
```

This will open Prisma Studio in your browser where you can view and manage your database tables.

**Or test with a quick connection check:**

```bash
node scripts/quick-fix-login.js
```

This script will:
- Test the database connection
- Show existing users
- Create default users if the database is empty

---

## Step 7: Remote Database Access (Optional - Development Only)

If you need to connect from your local development machine to the cPanel database:

1. **In cPanel:**
   - Go to **"Remote MySQL"** or **"Remote Database Access"** in the Databases section
   - Add your local IP address to the allowed hosts list
   - ⚠️ **Only do this for development!** For production, always use `localhost`

2. **Update Connection String (for local development):**
   - Use your cPanel server's IP address or domain name instead of `localhost`
   - Example: `mysql://user:pass@yourdomain.com:3306/database`
   - Or: `mysql://user:pass@123.45.67.89:3306/database`

---

## Troubleshooting

### Connection Refused Error
**Symptoms:** `ECONNREFUSED` or `Can't connect to MySQL server`

**Solutions:**
- Verify the host is correct (try `localhost`, `127.0.0.1`, or your server's hostname)
- Check if the port is correct (should be `3306` for MySQL)
- Ensure your IP is whitelisted if connecting remotely (see Step 7)
- Check if MySQL service is running on your cPanel server

### Access Denied Error
**Symptoms:** `ER_ACCESS_DENIED_ERROR` or `Access denied for user`

**Solutions:**
- Double-check username and password (remember the username prefix!)
- Verify user has **ALL PRIVILEGES** on the database
- Try resetting the database user password in cPanel
- Make sure you're using the full username with prefix (e.g., `john_receiptrocket_user`, not just `receiptrocket_user`)

### Database Not Found Error
**Symptoms:** `Unknown database` or `Database doesn't exist`

**Solutions:**
- Verify the exact database name (including username prefix)
- Check that the database was created successfully in cPanel
- Go to "MySQL Databases" in cPanel to see the exact database name

### SSL Connection Issues
If you get SSL errors, you can add SSL parameters to your connection string:

```env
DATABASE_URL="mysql://user:pass@host:3306/db?sslaccept=accept_invalid_certs"
```

### Special Characters in Password
If your password contains special characters (`@`, `#`, `$`, `%`, etc.), URL-encode them:
- Use an online URL encoder: https://www.urlencoder.org/
- Or escape them manually (see Step 3 for examples)

### "This project now targets MySQL exclusively" Error
If you see this error, it means your `DATABASE_URL` is still using SQLite format (`file:./...`).

**Solution:** Update `DATABASE_URL` to MySQL format:
```
mysql://username:password@localhost:3306/database
```

---

## Security Best Practices

1. **Use Strong Passwords**: Create a strong, unique password for your database user
2. **Limit Remote Access**: Only allow remote connections from trusted IPs if needed
3. **Regular Backups**: Use cPanel's backup feature to regularly backup your database
4. **Environment Variables**: Never commit `.env` files to version control
5. **SSL Connections**: Use SSL for database connections when possible

---

## Quick Reference: Connection String Format

### MySQL Connection String Format:
```
mysql://USERNAME:PASSWORD@HOST:PORT/DATABASE_NAME
```

### Real-World Example:
```
mysql://john_receiptrocket_user:MyStr0ng!P@ss@localhost:3306/john_receiptrocket
```

**Breaking it down:**
- `mysql://` - Protocol
- `john_receiptrocket_user` - Username (with cPanel prefix)
- `MyStr0ng!P@ss` - Password
- `localhost` - Host (usually `localhost` in cPanel)
- `3306` - Port (MySQL default)
- `john_receiptrocket` - Database name (with cPanel prefix)

---

## Next Steps

After setting up your database:

1. ✅ Test the connection with `npx prisma studio`
2. ✅ Run migrations: `npx prisma migrate deploy` (for production)
3. ✅ Seed initial data if needed: `npm run db:seed`
4. ✅ Update your production environment variables
5. ✅ Test your application with the new database

---

## Need Help?

- Check Prisma documentation: https://www.prisma.io/docs
- Contact your hosting provider for specific cPanel database settings
- Verify your cPanel version supports the database type you're using

