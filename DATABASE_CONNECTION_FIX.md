# Database Connection Fix Guide

## Current Issue
Prisma cannot connect to MySQL at `localhost:3306` because the MySQL server is not running or not accessible.

## Solution Options

### Option 1: Use Local MySQL (Recommended for Development)

1. **Install/Start MySQL Server:**
   - If you have XAMPP/WAMP: Start MySQL from the control panel
   - If you have MySQL installed: Start the MySQL service
   - Windows: Open Services → Find "MySQL" → Start it

2. **Update `.env` file with your MySQL credentials:**
   ```env
   DATABASE_URL="mysql://root:YOUR_PASSWORD@localhost:3306/receiptrocket"
   ```
   Replace `YOUR_PASSWORD` with your actual MySQL root password.

3. **Create the database (if it doesn't exist):**
   ```sql
   CREATE DATABASE receiptrocket;
   ```

4. **Run Prisma commands:**
   ```bash
   npm run db:push
   npm run db:seed
   ```

### Option 2: Connect to Remote cPanel Database

If you want to use your cPanel database, update `.env`:

```env
DATABASE_URL="mysql://appsgiho_user:%23Gihon_60908@YOUR_CPANEL_HOST:3306/appsgiho_re"
```

Replace `YOUR_CPANEL_HOST` with your actual cPanel server hostname or IP address (not `localhost`).

**Note:** For remote connections, you may need to:
- Allow your IP address in cPanel's Remote MySQL settings
- Use the correct hostname (often something like `mysql.yourdomain.com` or an IP address)

## Quick Test

After updating your `.env` file, test the connection:

```bash
npx prisma db pull --schema database/schema.prisma
```

If successful, you'll see the database schema. If it fails, check:
1. MySQL server is running
2. Credentials are correct
3. Database exists (for local) or remote access is allowed (for cPanel)

## Next Steps

Once connected, run:
```bash
npm run db:push    # Creates tables
npm run db:seed    # Adds sample data
npm run dev        # Start development server
```

