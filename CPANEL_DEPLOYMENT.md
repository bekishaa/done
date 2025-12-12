# cPanel Deployment Guide

## ✅ Prisma-Free Deployment

This application uses **mysql2** directly (not Prisma), making cPanel deployment much simpler!

## Pre-Deployment Checklist

1. **Environment Variables** - Set these in cPanel:
   - `DATABASE_URL=mysql://user:password@host:port/database`
   - `NODE_ENV=production`
   - `NEXT_PUBLIC_APP_URL=https://yourdomain.com` (your actual domain)
   - (Optional) `AFRO_API_KEY` and `AFRO_SENDER_NAME` for SMS functionality

2. **No Prisma Generation Needed** - The app uses mysql2 directly, so no `prisma generate` step is required!

## Deployment Steps

### Option 1: Git Deployment (Recommended)

1. **Prepare locally:**
   ```bash
   npm run prepare:cpanel
   ```

2. **Commit and push:**
   ```bash
   git add .
   git commit -m "Prepare for cPanel deployment"
   git push
   ```

3. **On cPanel:**
   - Set up Node.js app (Node.js version 18+)
   - Connect to your Git repository
   - Set environment variables in cPanel
   - Set build command: `npm run build`
   - Set start command: `npm start`
   - Deploy!

### Option 2: Manual Upload

1. **Build locally:**
   ```bash
   npm install
   npm run build
   ```

2. **Upload to cPanel:**
   - Upload the entire project folder
   - Set environment variables in cPanel
   - Run `npm install --production` in terminal
   - Run `npm run build`
   - Start the Node.js app

## Important Notes

✅ **No Prisma Required** - The app uses mysql2, so no Prisma client generation is needed
✅ **No Binary Dependencies** - No need to worry about platform-specific binaries
✅ **Simple Build** - Just `npm install` and `npm run build`

## Troubleshooting

### Database Connection Issues

If you get database connection errors:

1. Verify `DATABASE_URL` is set correctly in cPanel
2. Test connection: `node scripts/quick-fix-login.js`
3. Check MySQL user has proper permissions
4. Ensure MySQL server is running

### Build Errors

If build fails:

1. Check Node.js version (should be 18+)
2. Verify all environment variables are set
3. Check `package.json` scripts are correct
4. Review build logs in cPanel

### Runtime Errors

If app doesn't start:

1. Check `NODE_ENV=production` is set
2. Verify `DATABASE_URL` format is correct
3. Check file permissions (should be readable)
4. Review application logs in cPanel

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | ✅ Yes | MySQL connection string |
| `NODE_ENV` | ✅ Yes | Set to `production` |
| `NEXT_PUBLIC_APP_URL` | ✅ Yes | Your domain URL |
| `AFRO_API_KEY` | ❌ No | For SMS functionality |
| `AFRO_SENDER_NAME` | ❌ No | For SMS functionality |

## Support

For issues, check:
- Application logs in cPanel
- Database connection status
- Node.js version compatibility
- Environment variable configuration

