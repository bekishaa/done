# Fix Prisma Cache Issues
Write-Host "Clearing Next.js cache and rebuilding..." -ForegroundColor Cyan

# Remove .next directory
if (Test-Path ".next") {
    Write-Host "Removing .next directory..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force .next
    Write-Host "✅ .next directory removed" -ForegroundColor Green
} else {
    Write-Host "✅ .next directory doesn't exist" -ForegroundColor Green
}

# Remove node_modules/.cache if it exists
if (Test-Path "node_modules\.cache") {
    Write-Host "Removing node_modules/.cache..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force "node_modules\.cache"
    Write-Host "✅ Cache removed" -ForegroundColor Green
}

Write-Host "`n✅ Cache cleared!" -ForegroundColor Green
Write-Host "`nNext steps:" -ForegroundColor Cyan
Write-Host "1. Stop your dev server (Ctrl+C)" -ForegroundColor White
Write-Host "2. Run: npm run dev" -ForegroundColor White
Write-Host "3. Try generating a ticket again" -ForegroundColor White
Write-Host "`nThe detailed error logs will now show the exact Prisma error." -ForegroundColor Yellow









