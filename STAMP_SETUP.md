# Stamp Image Setup Guide

## Overview
The ticket generation system supports displaying a company stamp/watermark on receipts. This guide shows how to add your stamp image.

## Step 1: Prepare Your Stamp Image
1. Your stamp should be a PNG image file
2. Recommended size: 200x200px to 400x400px
3. The image should have a transparent background or white background
4. Name it `stamp.png`

## Step 2: Place the Stamp Image
Place your `stamp.png` file in one of these locations (the system will check in this order):

1. **Recommended:** `public/stamp.png` (best location)
2. Alternative: `public/images/company-stamp.png`
3. Alternative: `src/app/stamp.png`

### Quick Setup (Windows PowerShell)
```powershell
# If you have the stamp image file, copy it to the public folder:
# Copy-Item "path\to\your\stamp.png" -Destination "public\stamp.png"
```

## Step 3: Verify
1. Restart your development server if it's running
2. Generate a test ticket
3. Check the server console for `[Stamp]` log messages:
   - If found: `[Stamp] Found stamp image at: ...`
   - If not found: `[Stamp] No stamp image found in any of the expected locations...`

## Troubleshooting
- **Stamp not showing?** Check the server console logs for `[Stamp]` messages
- **File not found?** Make sure the file is named exactly `stamp.png` (case-sensitive on some systems)
- **Image too large/small?** Adjust the CSS in `src/ai/flows/generate-ticket.ts` (look for `.watermark img` styles)
- **Wrong location?** The system checks `public/stamp.png` first - this is the recommended location

## Image Display Settings
The stamp is displayed as a watermark with:
- 42% opacity
- Centered on the receipt
- Behind the text content
- Max width of 80% of the receipt container

These settings can be adjusted in the HTML template if needed.

