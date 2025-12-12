# Database Setup Guide

This guide will help you set up the database for the Receipt Rocket application.

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn

## Quick Setup

All database assets (Prisma schema, seeds, SQL snapshot, automation scripts) live in the `database/` folder.

Run the automated setup script:

```bash
npm run db:setup
```

Before running the script, make sure you have a MySQL database ready (local MySQL server or a cloud/cPanel instance) and update your `.env` file with the correct credentials. Then run the script; it will:
1. Generate Prisma client
2. Push the schema to your MySQL database
3. Seed with initial data

## Manual Setup

If you prefer to set up manually:

### 1. Install Dependencies

```bash
npm install
```

### 2. Create Environment File

Create `.env.local` in the root directory and point it to your MySQL instance:

```env
# Database
DATABASE_URL="mysql://username:password@localhost:3306/receiptrocket"

# Next.js
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# SMS Service (Optional - for production)
SMS_API_KEY="your-sms-api-key"
SMS_BASE_URL="https://api.sms-provider.com"

# Google AI (for ticket generation)
GOOGLE_AI_API_KEY="your-google-ai-api-key"
```

### 3. Generate Prisma Client

```bash
npm run db:generate
```

### 4. Create Database Schema

```bash
npm run db:push
```

### 5. Seed Database

```bash
npm run db:seed
```

## Database Schema

The database includes the following models:

### Core Models
- **User** - System users (admin, sales, auditor, etc.)
- **Branch** - Organization branches
- **Customer** - Customer information
- **Ticket** - Payment tickets/receipts

### Supporting Models
- **AuditLog** - Audit trail for tickets
- **SmsLog** - SMS notification logs

## Default Login Credentials

After seeding, you can log in with:

| Role | Email | Password |
|------|-------|----------|
| Super Admin | superadmin@test.com | password123 |
| Admin | admin@test.com | password123 |
| Sales | sales@test.com | password123 |
| Auditor | auditor@test.com | password123 |
| Operation | operation@test.com | password123 |

## Database Commands

| Command | Description |
|---------|-------------|
| `npm run db:generate` | Generate Prisma client |
| `npm run db:push` | Push schema to database |
| `npm run db:migrate` | Create and run migrations |
| `npm run db:studio` | Open Prisma Studio |
| `npm run db:seed` | Seed database with sample data |
| `npm run db:reset` | Reset database (⚠️ destructive) |
| `npm run db:setup` | Complete setup (recommended) |

## Database Features

### User Management
- Role-based access control
- Branch assignment
- Ticket number ranges for sales users
- Password hashing with bcrypt

### Customer Management
- Complete customer profiles
- Address tracking
- Payment type preferences
- Transaction history

### Ticket System
- Automatic ticket numbering
- Payment reason categorization
- Audit trail
- SMS notifications

### Reporting
- Sales statistics
- Customer analytics
- Audit reports
- Performance metrics

## Production Considerations

For production deployment:

1. **Database**: Use a managed MySQL instance (default) or PostgreSQL
2. **Environment**: Use proper environment variables
3. **Security**: Change default passwords
4. **Backup**: Set up regular database backups
5. **Monitoring**: Implement database monitoring

### Production Database URL Examples

```env
# PostgreSQL
DATABASE_URL="postgresql://username:password@localhost:5432/receiptrocket"

# MySQL
DATABASE_URL="mysql://username:password@localhost:3306/receiptrocket"
```

## Troubleshooting

### Common Issues

1. **ER_ACCESS_DENIED_ERROR**: Verify database username/password
2. **ECONNREFUSED 127.0.0.1:3306**: Ensure MySQL server is running and reachable
3. **Migration errors**: Try `npm run db:reset` to start fresh
4. **Permission errors**: Check that the MySQL user has `ALL PRIVILEGES` on the database

### Reset Database

If you need to start over:

```bash
npm run db:reset
npm run db:seed
```

## Support

For issues or questions:
1. Check the Prisma documentation
2. Review the application logs
3. Ensure all dependencies are installed
4. Verify environment configuration
