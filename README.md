# Receipt Rocket - GIHON SACCOS Management System

A comprehensive ticket and receipt management system for GIHON SACCOS with SMS notification capabilities.

## Features

- 📱 **Mobile-Friendly Receipts**: Beautiful, mobile banking-style receipts
- 💬 **SMS Notifications**: Automatic SMS with receipt links sent to customers
- 🎫 **Ticket Management**: Generate and track payment tickets
- 👥 **Multi-Role Support**: Admin, Sales, Auditor, and Operations dashboards
- 🔐 **Authentication**: Secure user authentication and authorization
- 📊 **Reports & Analytics**: Comprehensive sales reports and analytics

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a MySQL database (local or on your host) and note the credentials.

4. Create a `.env` file with at least:
   ```env
   DATABASE_URL="mysql://USER:PASSWORD@HOST:3306/DATABASE_NAME"
   NEXT_PUBLIC_BASE_URL="http://localhost:3000"
   ```

5. Push the Prisma schema and seed data:
   ```bash
   npm run db:push
   npm run db:seed
   ```

6. Run the development server:
   ```bash
   npm run dev
   ```

7. Open [http://localhost:3000](http://localhost:3000) in your browser

> All database assets (schema, seeds, SQL snapshot, automation scripts) live under the `database/` directory.

## SMS & Receipt Links

When a ticket is generated:
1. A unique receipt is created with a mobile-banking style design
2. An SMS is sent to the customer with the message:
   > "Dear Customer, your daily deposit of [amount] ETB by [reason] has been received. Thank you for using GIHON SACCOS. View receipt: [link]"
3. Customers can click the link to view their receipt online
4. Receipts are accessible at: `/api/ticket/[ticket-id]`

### Example SMS Message

```
Dear Customer, your daily deposit of 2000.00 ETB by Mothers Loan has been received. 
Thank you for using GIHON SACCOS. 
View receipt: http://localhost:3000/api/ticket/abc123
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | MySQL connection string | `mysql://user:pass@localhost:3306/receiptrocket` |
| `NEXT_PUBLIC_BASE_URL` | Base URL for ticket links | `http://localhost:3000` |
| `SMS_API_KEY` | SMS provider API key (optional) | `mock-api-key` |
| `SMS_BASE_URL` | SMS provider base URL (optional) | Mock service |

## Database Commands

- `npm run db:push` - Push schema changes to database
- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Seed the database with sample data
- `npm run db:studio` - Open Prisma Studio
- `npm run db:reset` - Reset the database

## Default Login Credentials

After seeding the database, you can log in with:

**Super Admin:**
- Email: `superadmin@example.com`
- Password: `password123`

**Sales:**
- Email: `sales@example.com`
- Password: `password123`

## Project Structure

```
├── src/
│   ├── ai/              # AI/Genkit ticket generation
│   ├── app/             # Next.js app directory
│   │   ├── api/         # API routes (ticket viewing)
│   │   └── actions.ts   # Server actions
│   ├── components/      # React components
│   ├── lib/             # Utilities and services
│   │   ├── services/    # Business logic services
│   │   └── sms-service.ts # SMS notification service
│   └── hooks/           # Custom React hooks
├── database/           # Schema, seeds, setup scripts, SQL snapshot
└── public/              # Static assets
```

## Customization

### SMS Messages

To customize SMS messages, edit `src/lib/sms-service.ts`:

```typescript
public generateTicketMessage(data: {...}): string {
  return `Your custom message here with ${data.ticketLink}`;
}
```

### Receipt Design

To modify the receipt appearance, edit `src/ai/flows/generate-ticket.ts`:

```typescript
function createTicketHtml(data: ...): string {
  // Customize HTML and CSS here
}
```

## Production Deployment

1. Set `NEXT_PUBLIC_BASE_URL` to your production domain
2. Configure a real SMS provider (Twilio, AWS SNS, etc.)
3. Update `SMS_API_KEY` and `SMS_BASE_URL` in environment variables
4. Build the application:
   ```bash
   npm run build
   npm start
   ```

## Support

For issues or questions, please contact the development team.
