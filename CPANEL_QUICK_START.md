# 🚀 cPanel Quick Start Guide

## The Problem
cPanel doesn't support running `prisma generate` during deployment.

## The Solution
**Generate Prisma Client locally and commit it to your repository.**

---

## Quick Steps

### 1. On Your Local Machine (Before Deployment)

```bash
# Generate Prisma Client for Linux (cPanel)
npm run prepare:cpanel

# Or manually:
npx prisma generate --schema=database/schema.prisma

# Commit the generated files
git add src/generated/prisma/
git commit -m "Add generated Prisma Client for cPanel"
git push
```

### 2. Deploy to cPanel

```bash
# In cPanel Terminal or via Git:
cd ~/public_html/your-app

# Install dependencies (skip prisma generate - already committed)
npm install --production

# Build your app
npm run build

# Start your app
npm start
```

### 3. Test Connection

```bash
node scripts/quick-fix-login.js
```

---

## That's It! ✅

The generated Prisma Client files are now part of your repository, so cPanel doesn't need to generate them.

---

## Need More Details?

See the full guide: **`CPANEL_PRISMA_DEPLOYMENT.md`**

---

## Troubleshooting

**"Cannot find module '@/generated/prisma'"**
→ Make sure `src/generated/prisma/` exists in your deployment

**"Query engine binary not found"**
→ Regenerate with: `npm run prepare:cpanel` and commit again

**Still having issues?**
→ Check `CPANEL_PRISMA_DEPLOYMENT.md` for detailed troubleshooting



























