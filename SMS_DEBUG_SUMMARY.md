# SMS Duplicate Send Investigation

## Issue
SMS messages were being sent **3 times** when generating a ticket.

## Root Cause
The SMS sending code was trying multiple API payload formats sequentially:
1. Identifier-based payload (recommended)
2. Canonical payload
3. PrimaryD payload
4. Primary payload
5. PrimaryB payload
6. PrimaryE payload

Even though the code should return after the first success, multiple formats might have been accepted by the API, causing duplicate sends.

## Fix Applied
✅ **Removed all fallback attempts** - Now only uses identifier-based payload
✅ **SMS disabled temporarily** - Added `DISABLE_SMS=true` to `.env.local`
✅ **Added detailed logging** - Track every call to `sendSMS()` with call stacks

## Current Status
- SMS sending is **DISABLED** via `DISABLE_SMS=true`
- Code will only try **ONE API call** (identifier-based) when re-enabled
- Detailed logging shows exactly where each SMS call originates

## To Re-enable SMS
1. Remove or comment out `DISABLE_SMS=true` from `.env.local`
2. Restart the development server
3. Generate a test ticket
4. Check console logs - should see only ONE `[SMS] sendSMS() function CALLED` message

## Verification
After re-enabling, check logs for:
- How many times `[SMS] sendSMS() function CALLED` appears (should be 1)
- Call stack showing where it's called from
- Only one `[SMS] ✅ SUCCESS` message

If you still see duplicates after re-enabling, the call stack will show where the duplicate calls are coming from.

