# Database Toolkit

Everything you need to provision the Receipt Rocket MySQL database now lives in this folder:

| File / Folder | Purpose |
| --- | --- |
| `schema.prisma` | Prisma schema (source of truth). |
| `seed.ts` | Seeds default branches, users, customers, tickets, SMS logs. Run with `npm run db:seed`. |
| `mysql_schema.sql` | SQL snapshot exported from Prisma (helpful for manual DB creation). |
| `scripts/setup-database.ts` | One-click setup script (`npm run db:setup`) that generates Prisma client, pushes schema, and seeds data. |

## Common Commands

```bash
# Generate Prisma client
npm run db:generate

# Push schema changes to MySQL
npm run db:push

# Apply history-aware migrations (development)
npm run db:migrate

# Seed default data
npm run db:seed

# Full setup (generate + push + seed)
npm run db:setup
```

All commands automatically use `database/schema.prisma`. Just make sure `DATABASE_URL` points to your MySQL instance before running them.

