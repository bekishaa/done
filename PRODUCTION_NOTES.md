# 🎯 Production Deployment Notes

## Quick Start Commands

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
cp .env.example .env.production
# Edit .env.production with your production values

# 3. Generate Prisma client
npx prisma generate

# 4. Run database migrations
npx prisma migrate deploy

# 5. Build for production
npm run build

# 6. Start production server
npm start
```

## Critical Configuration

### 1. Database
- **MySQL**: Default for Receipt Rocket (supported by cPanel/managed hosts)
- **PostgreSQL**: Alternative if your hosting prefers it

### 2. SMS Service
- Ensure AfroMessage account has sufficient credits
- Monitor SMS delivery rates
- Set up usage alerts

### 3. App URL
- Set `NEXT_PUBLIC_APP_URL` to your production domain
- Must include protocol (https://)
- No trailing slash

## Performance Tips

1. **Enable Next.js caching** - Already configured
2. **Use CDN** - For static assets (images, fonts)
3. **Database indexing** - Prisma handles this automatically
4. **Monitor performance** - Use tools like Vercel Analytics

## Security Best Practices

1. ✅ Environment variables are in `.gitignore`
2. ✅ Passwords are hashed (bcrypt)
3. ✅ Session management implemented
4. ⚠️ Enable HTTPS/SSL
5. ⚠️ Set up rate limiting (if needed)
6. ⚠️ Regular security updates

## Monitoring

Monitor these metrics:
- SMS delivery success rate
- Ticket generation errors
- Database connection issues
- API response times
- User login failures

## Backup Strategy

1. **Database backups**: Daily automated backups
2. **File backups**: Stamp image, configuration files
3. **Test restores**: Verify backups work

## Troubleshooting

### Build Errors
- Clear `.next` folder: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Check Node.js version: `node --version` (should be 18+)

### Runtime Errors
- Check server logs
- Verify environment variables
- Test database connection
- Check SMS provider status

## Support Contacts

- SMS Provider: https://afromessage.com/
- Next.js Docs: https://nextjs.org/docs
- Prisma Docs: https://www.prisma.io/docs

---

**Remember**: Test thoroughly in a staging environment before production deployment!

