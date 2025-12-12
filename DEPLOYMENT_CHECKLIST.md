# 🚀 Pre-Deployment Checklist for Gihon SACCOS

## ✅ Critical Pre-Deployment Steps

### 1. Environment Variables Setup

Create a `.env.production` or set environment variables in your hosting platform:

```env
# Database (Production)
DATABASE_URL="mysql://user:password@host:3306/receiptrocket"
# Alternative: postgresql://user:password@host:5432/receiptrocket

# SMS Configuration (AfroMessage)
AFRO_API_KEY=your_production_api_key
AFRO_SENDER_NAME=GihonSaccos
AFRO_IDENTIFIER_ID=your_identifier_id
AFRO_BASE_URL=https://api.afromessage.com

# App Configuration
NEXT_PUBLIC_APP_URL=https://your-domain.com
# For localhost testing: ALLOW_LOCALHOST_SMS_LINK=true

# Security (Important!)
# DO NOT set these to 'true' in production:
# AFRO_DISABLE_SMS=false
# DISABLE_SMS=false
```

**⚠️ IMPORTANT:** Never commit `.env.local` or `.env.production` to Git!

### 2. Database Setup

#### For Production:
- [ ] Provision a managed MySQL (or PostgreSQL) instance
- [ ] Run migrations: `npx prisma migrate deploy`
- [ ] Generate Prisma client: `npx prisma generate`
- [ ] Verify database connection

#### For cPanel Deployment:
- [ ] **IMPORTANT:** Read `CPANEL_PRISMA_DEPLOYMENT.md` first!
- [ ] Run `npm run prepare:cpanel` to generate Prisma Client locally
- [ ] Commit generated Prisma Client files to your repository
- [ ] Deploy to cPanel (generated files will be included)
- [ ] Skip `prisma generate` on cPanel server (use pre-generated files)

### 3. SMS Configuration

- [ ] Verify AfroMessage account has sufficient credits
- [ ] Test SMS sending in production environment
- [ ] Set up SMS usage alerts in AfroMessage dashboard
- [ ] Verify phone number format handling (E.164 format: +251...)

### 4. Security Checklist

- [ ] Change all default passwords
- [ ] Ensure `.env` files are in `.gitignore`
- [ ] Review and update user roles/permissions
- [ ] Enable HTTPS/SSL certificate
- [ ] Set secure session timeout
- [ ] Review CORS settings if needed
- [ ] Remove or secure any test/development endpoints

### 5. File Assets

- [ ] Upload `stamp.png` to `public/stamp.png` (company stamp image)
- [ ] Verify favicon is displaying correctly
- [ ] Check all images are optimized

### 6. Build & Test

```bash
# Build the application
npm run build

# Test the build locally
npm start

# Verify all routes work:
# - Login page
# - Ticket generation
# - SMS sending
# - Ticket viewing via link
# - Reports
```

### 7. Production Optimizations

- [ ] Enable Next.js production optimizations
- [ ] Set up error tracking (e.g., Sentry)
- [ ] Configure logging
- [ ] Set up monitoring/analytics
- [ ] Configure CDN for static assets (if applicable)

### 8. Testing Checklist

Before going live, test:

- [ ] User login/logout
- [ ] Customer registration
- [ ] Ticket generation
- [ ] SMS sending (with real phone number)
- [ ] Ticket PDF link access (`/tickets/{id}.pdf`)
- [ ] Ticket viewing and printing
- [ ] Sales reports
- [ ] Auditor approval workflow
- [ ] User management
- [ ] Branch filtering (if multi-branch)

### 9. Deployment Platform Specific

#### Vercel:
- [ ] Set environment variables in Vercel dashboard
- [ ] Configure build command: `npm run build`
- [ ] Set output directory: `.next`
- [ ] Configure database (if using external DB)

#### Other Platforms:
- [ ] Set Node.js version (18+ recommended)
- [ ] Configure build and start commands
- [ ] Set up process manager (PM2, etc.)
- [ ] Configure reverse proxy if needed

### 10. Post-Deployment

- [ ] Test all critical functions
- [ ] Monitor error logs
- [ ] Check SMS delivery rates
- [ ] Verify database backups are working
- [ ] Set up regular database backups
- [ ] Document admin credentials securely
- [ ] Create user guide/documentation

## 🔧 Common Issues & Solutions

### Issue: SMS not sending
**Solution:** 
- Check environment variables are set correctly
- Verify AfroMessage account has credits
- Check server logs for SMS errors
- Ensure `AFRO_DISABLE_SMS` is not set to 'true'

### Issue: Database connection errors
**Solution:**
- Verify `DATABASE_URL` is correct
- Check database server is accessible
- Ensure database user has proper permissions
- For remote hosts: whitelist the server IP / enable SSL if required

### Issue: Ticket PDF links not working
**Solution:**
- Verify `NEXT_PUBLIC_APP_URL` is set correctly
- Check route handler is deployed: `/tickets/[id]/route.ts`
- Test direct URL access
- Check server logs for route errors

### Issue: Build fails
**Solution:**
- Run `npm install` to ensure all dependencies
- Check for TypeScript errors: `npm run typecheck`
- Verify Node.js version (18+)
- Clear `.next` folder and rebuild

## 📋 Quick Deployment Commands

```bash
# 1. Install dependencies
npm install

# 2. Generate Prisma client
npx prisma generate

# 3. Run database migrations
npx prisma migrate deploy

# 4. Build for production
npm run build

# 5. Start production server
npm start
```

## 🔐 Security Reminders

1. **Never commit secrets** - Use environment variables
2. **Use strong passwords** - For all admin accounts
3. **Enable HTTPS** - Always use SSL/TLS in production
4. **Regular updates** - Keep dependencies updated
5. **Monitor access** - Review logs regularly
6. **Backup regularly** - Database and important files

## 📞 Support

If you encounter issues:
1. Check server logs for error messages
2. Review browser console for client-side errors
3. Verify all environment variables are set
4. Test in development mode first
5. Check SMS provider dashboard for delivery status

## ✅ Final Sign-Off

Before going live, ensure:
- [ ] All tests pass
- [ ] SMS is working
- [ ] Database is backed up
- [ ] Environment variables are secure
- [ ] Monitoring is set up
- [ ] Team is trained on system usage

---

**Good luck with your deployment! 🎉**

