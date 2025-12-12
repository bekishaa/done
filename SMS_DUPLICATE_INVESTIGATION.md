# SMS Duplicate Send Investigation

## Problem
When generating a ticket, SMS messages were being sent 3 times instead of once.

## Investigation Results

### What the Logs Show
- ✅ `sendSMS()` function is only called **ONCE** per ticket generation
- ✅ Form submission happens only once
- ✅ `createAndSendTicket()` is called only once

### Root Cause (Before Fix)
The SMS sending code was trying **multiple API payload formats** in sequence:
1. Identifier-based payload (recommended)
2. Canonical payload
3. PrimaryD payload
4. Primary payload
5. PrimaryB payload
6. PrimaryE payload
7. GET request

**The Problem:** If multiple payload formats returned "success" responses from the API, each one would actually send an SMS, resulting in 3 messages being sent.

### Solution Applied
1. ✅ **Changed to try ONLY identifier-based payload first** (the recommended format by AfroMessage)
2. ✅ **Returns immediately on success** - doesn't try other formats
3. ✅ **Only falls back to other formats if identifier fails**

### Code Changes Made
- `src/lib/sms.ts`: Modified to prioritize identifier-based API call and return immediately on success
- Added `DISABLE_SMS=true` to temporarily stop SMS sending for testing
- Added detailed logging to track all SMS calls

## Testing Instructions

### To Re-enable SMS:
1. Remove or comment out `DISABLE_SMS=true` in `.env.local`
2. Restart the development server
3. Generate a test ticket
4. Check console logs - you should see:
   - `[SMS] Attempting identifier-based API call...` (only once)
   - `[SMS] Sent successfully via identifier API` (only once)
5. Verify only ONE SMS is received

### To Keep SMS Disabled:
- Keep `DISABLE_SMS=true` in `.env.local`
- SMS will log what would be sent but won't actually send

## Expected Behavior (After Fix)
- Only ONE API call is made (identifier-based)
- Only ONE SMS is sent per ticket
- Clear logging shows exactly what's happening

## If Duplicates Still Occur
Check the console logs for:
- How many times `[SMS] sendSMS() function CALLED` appears
- The call stack to see where multiple calls are coming from
- If `[SMS] Attempting identifier-based API call...` appears multiple times

