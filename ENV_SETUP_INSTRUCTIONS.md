# Environment Variables Setup Instructions

## Quick Setup for SMS

Open your `.env.local` file and add these lines (add them to your existing `DATABASE_URL` line):

```env
DATABASE_URL="mysql://username:password@localhost:3306/receiptrocket"

# AfroMessage SMS Configuration
AFRO_API_KEY=eyJhbGciOiJIUzI1NiJ9.eyJpZGVudGlmaWVyIjoiQlM0eGN3OXJ5cXhienpiT0dMWEJzY2lUdnBUd29aZU4iLCJleHAiOjE5MTc2ODE1NjQsImlhdCI6MTc1OTkxNTE2NCwianRpIjoiYjFkZGE5NjUtMGIxZS00ZGJjLWJiYWItNTgyZjU0MmViOTI0In0.cA9NBaaD_xBcz9FgSg648VPCnJmo_BcUnB8hRRv-KnU
AFRO_IDENTIFIER_ID=e80ad9d8-adf3-463f-80f4-7c4b39f7f164
AFRO_SENDER_NAME=GihonSaccos
```

## Important Steps

1. **Save the `.env.local` file** after adding the credentials
2. **Restart your development server** (stop and start `npm run dev`)
   - Environment variables are only loaded when the server starts
   - Changes to `.env.local` require a restart to take effect

## Verify Setup

After restarting, generate a test ticket and check the console for:
- `[SMS] Configuration check:` - Shows if credentials are loaded
- `[SMS] Using identifier-based API call` - Confirms identifier is being used
- `[SMS] SMS sent successfully` - Success message

## Troubleshooting

If SMS still doesn't work after adding credentials:
1. Make sure there are **no spaces** around the `=` sign in `.env.local`
2. Make sure there are **no quotes** around the values (unless needed)
3. **Restart the server** - this is critical!
4. Check console logs for detailed error messages starting with `[SMS]`

## Stamp Image Setup

Don't forget to place your stamp image at: `public/stamp.png`

See `STAMP_SETUP.md` for detailed stamp setup instructions.

