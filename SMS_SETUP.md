# SMS Setup Guide for Gihon Saccos

## Overview
The system now supports real SMS messaging when generating Daily Cash Receipt Vouchers. This guide shows how to set up SMS using AfroMessage.

## Prerequisites
1. An AfroMessage account (`https://afromessage.com/`)
2. Your Identifier Id, API key (Bearer token), and an approved Sender Name

## Setup Steps

### 1. Get AfroMessage Credentials
1. Log in: `https://afromessage.com/`
2. Find your Identifier Id
3. Generate or copy your API Key (JWT/Bearer token)
4. Ensure your Sender Name is approved

### 2. Set Environment Variables
Create a `.env.local` file in your project root with:

```env
# Database
DATABASE_URL="mysql://username:password@localhost:3306/receiptrocket"

# AfroMessage SMS Configuration
AFRO_IDENTIFIER_ID=e80ad9d8-adf3-463f-80f4-7c4b39f7f164
AFRO_API_KEY=REPLACE_WITH_YOUR_API_KEY
AFRO_SENDER_NAME=REPLACE_WITH_APPROVED_SENDER
# Optional override (defaults to https://api.afromessage.com)
# AFRO_BASE_URL=https://api.afromessage.com

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Phone Number Format
- Ensure phone numbers are in international format (e.g., +251912345678 for Ethiopia)
- The system will automatically add '+' if not present

## SMS Message Format
When a ticket is generated, customers will receive an SMS like:
```
Dear [Customer Name], your daily deposit of ETB [Amount] has been received by Gihon Saccos. Ticket No: [Ticket Number]. Thank you for your payment!
```

## Testing
1. Start the development server: `npm run dev`
2. Generate a test ticket
3. Check the console for SMS status
4. If SMS is not configured, you'll see a message in the console guiding you to set AFRO_* envs

## Troubleshooting
- If SMS fails, check your AfroMessage credentials
- Ensure your AfroMessage account has sufficient balance/credits
- Verify the phone number format is correct
- Check the console logs for error messages

## Cost Considerations
- AfroMessage charges per SMS sent
- See pricing on `https://afromessage.com/`
- Consider setting up usage/credit alerts in your AfroMessage account
