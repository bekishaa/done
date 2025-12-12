# 🚀 cPanel Prisma Deployment Guide

## Problem: Prisma Not Supported in cPanel

cPanel hosting environments often have limitations that prevent Prisma from working:
- ❌ Cannot run `prisma generate` during deployment
- ❌ Prisma CLI may not be available
- ❌ Binary targets may not match the server architecture
- ❌ Build scripts may not execute properly

## ✅ Solution: Pre-Generate Prisma Client

The best solution is to **generate Prisma Client locally** and **commit it to your repository** before deploying to cPanel.

---

## Step 1: Generate Prisma Client Locally

Before deploying to cPanel, run these commands on your local machine:

```bash
# 1. Make sure you're in the project root
cd /path/to/receiptrocket

# 2. Install dependencies (if not already done)
npm install

# 3. Generate Prisma Client for Linux (cPanel servers are usually Linux)
npx prisma generate --schema=database/schema.prisma

# 4. Verify the generated files exist
ls -la src/generated/prisma/
```

**Important:** The generated Prisma Client should include Linux binary targets. Your `schema.prisma` already has:
```prisma
binaryTargets = ["native", "rhel-openssl-1.0.x"]
```

This should work for most cPanel Linux servers.

---

## Step 2: Commit Generated Files

The generated Prisma Client files need to be committed to your repository:

```bash
# Check what files were generated
git status

# Add the generated Prisma Client
git add src/generated/prisma/

# Commit them
git commit -m "Add generated Prisma Client for cPanel deployment"

# Push to your repository
git push
```

**Note:** The `.gitignore` file has been updated to allow committing these files for cPanel deployment.

---

## Step 3: Update Prisma Schema for cPanel

Your `database/schema.prisma` should have the correct binary targets. Verify it includes:

```prisma
generator client {
  provider      = "prisma-client-js"
  output        = "../src/generated/prisma"
  binaryTargets = ["native", "rhel-openssl-1.0.x"]
}
```

The `rhel-openssl-1.0.x` target is important for older Linux servers (common in cPanel).

---

## Step 4: Deploy to cPanel

### Option A: Using Git (Recommended)

1. **Push your code** (including generated Prisma Client) to your Git repository
2. **In cPanel:**
   - Go to **Git Version Control** or use **Terminal/SSH**
   - Clone or pull your repository
   - Run: `npm install --production`
   - **Skip** `prisma generate` (already committed)
   - Run: `npm run build`
   - Start your application

### Option B: Manual Upload

1. **Upload your entire project** to cPanel (via File Manager or FTP)
2. **In cPanel Terminal:**
   ```bash
   cd ~/public_html/your-app-directory
   npm install --production
   npm run build
   npm start
   ```

---

## Step 5: Verify Deployment

After deployment, test that Prisma works:

```bash
# In cPanel Terminal, test the connection
node -e "const { PrismaClient } = require('./src/generated/prisma'); const prisma = new PrismaClient(); prisma.\$connect().then(() => console.log('✅ Prisma connected!')).catch(e => console.error('❌ Error:', e));"
```

Or use the existing test script:
```bash
node scripts/quick-fix-login.js
```

---

## Alternative Solution: Postinstall Script

If you cannot commit generated files, we've added a `postinstall` script to `package.json` that will attempt to generate Prisma Client after `npm install`.

**However, this may not work in all cPanel environments** because:
- Prisma CLI might not be available
- Build tools might not be installed
- Permissions might be restricted

**This is why pre-generating and committing is the recommended approach.**

---

## Troubleshooting

### Issue: "Cannot find module '@/generated/prisma'"

**Solution:**
1. Verify `src/generated/prisma/` exists in your deployment
2. Check that files were uploaded correctly
3. Regenerate locally and re-upload:
   ```bash
   npx prisma generate --schema=database/schema.prisma
   ```

### Issue: "Query engine binary not found"

**Solution:**
1. The binary target might not match your cPanel server
2. Update `schema.prisma` binary targets:
   ```prisma
   binaryTargets = ["native", "rhel-openssl-1.0.x", "debian-openssl-3.0.x"]
   ```
3. Regenerate locally and re-upload

### Issue: "Prisma Client has not been generated yet"

**Solution:**
1. The generated files are missing
2. Generate locally: `npx prisma generate --schema=database/schema.prisma`
3. Commit and push, or manually upload `src/generated/prisma/`

### Issue: "Permission denied" when running prisma generate

**Solution:**
- This is why we pre-generate locally
- Don't run `prisma generate` on cPanel
- Use the pre-generated files from your repository

---

## Quick Deployment Checklist

- [ ] Generate Prisma Client locally: `npx prisma generate --schema=database/schema.prisma`
- [ ] Verify `src/generated/prisma/` exists and has files
- [ ] Commit generated files to Git
- [ ] Push to repository
- [ ] Deploy to cPanel (via Git or manual upload)
- [ ] Run `npm install --production` (skip `prisma generate`)
- [ ] Run `npm run build`
- [ ] Test database connection
- [ ] Start application

---

## Why This Works

1. **Pre-generation:** Prisma Client is generated on your local machine where you have full control
2. **Committed files:** The generated files are part of your repository, so they're always available
3. **No build-time dependency:** cPanel doesn't need to run `prisma generate` during deployment
4. **Binary targets:** The schema includes Linux binary targets that work on cPanel servers

---

## Important Notes

⚠️ **Binary Compatibility:**
- If your cPanel server uses a different Linux distribution, you may need to add more binary targets
- Common targets: `rhel-openssl-1.0.x`, `debian-openssl-3.0.x`, `linux-musl`
- Check your server: `uname -a` and `cat /etc/os-release`

⚠️ **File Size:**
- Generated Prisma Client files are large (~10-20MB)
- Make sure your Git repository can handle this
- Consider using Git LFS if needed

⚠️ **Updates:**
- When you update `schema.prisma`, regenerate locally and commit again
- Always test locally before deploying

---

## Next Steps

After successful deployment:
1. ✅ Test database connection
2. ✅ Run database migrations (if needed): `npx prisma db push --schema=database/schema.prisma`
3. ✅ Seed initial data: `npm run db:seed`
4. ✅ Test your application

---

## Need Help?

If you still encounter issues:
1. Check cPanel server architecture: `uname -m` and `uname -a`
2. Verify Node.js version: `node --version` (should be 18+)
3. Check Prisma version: `npx prisma --version`
4. Review server logs for specific error messages
5. Contact your hosting provider for cPanel-specific limitations























