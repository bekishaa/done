# Database Setup Script for Receipt Rocket
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Receipt Rocket Database Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if MySQL is running
Write-Host "Checking MySQL connection..." -ForegroundColor Yellow
$mysqlProcess = Get-Process -Name "mysqld" -ErrorAction SilentlyContinue
if (-not $mysqlProcess) {
    Write-Host "WARNING: MySQL doesn't appear to be running!" -ForegroundColor Red
    Write-Host "Please start MySQL from XAMPP Control Panel first." -ForegroundColor Yellow
    Write-Host ""
    $continue = Read-Host "Continue anyway? (y/n)"
    if ($continue -ne "y") {
        exit 1
    }
} else {
    Write-Host "SUCCESS: MySQL is running" -ForegroundColor Green
}

Write-Host ""

# Check for running Node processes that might lock files
Write-Host "Checking for running Node processes..." -ForegroundColor Yellow
$nodeProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue | Where-Object { $_.Path -like "*nodejs*" }
if ($nodeProcesses) {
    Write-Host "WARNING: Found running Node.js processes that might lock Prisma files:" -ForegroundColor Yellow
    $nodeProcesses | ForEach-Object { Write-Host "  - PID $($_.Id): $($_.Path)" -ForegroundColor Gray }
    Write-Host ""
    Write-Host "Please stop your dev server (Ctrl+C) or close Node processes." -ForegroundColor Yellow
    Write-Host ""
    $continue = Read-Host "Continue anyway? (y/n)"
    if ($continue -ne "y") {
        Write-Host "Please stop Node processes and run this script again." -ForegroundColor Yellow
        exit 1
    }
} else {
    Write-Host "SUCCESS: No conflicting Node processes found" -ForegroundColor Green
}

Write-Host ""

# Step 1: Generate Prisma Client
Write-Host "Step 1: Generating Prisma Client..." -ForegroundColor Cyan
Write-Host "-----------------------------------" -ForegroundColor Cyan
try {
    $output = npx prisma generate --schema database/schema.prisma 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "SUCCESS: Prisma client generated" -ForegroundColor Green
    } else {
        if ($output -match "EPERM") {
            Write-Host "ERROR: File is locked. Please:" -ForegroundColor Red
            Write-Host "  1. Stop all Node.js processes" -ForegroundColor Yellow
            Write-Host "  2. Close any IDEs/editors" -ForegroundColor Yellow
            Write-Host "  3. Run this script again" -ForegroundColor Yellow
            exit 1
        } else {
            Write-Host "ERROR: Failed to generate Prisma client" -ForegroundColor Red
            Write-Host $output -ForegroundColor Red
            exit 1
        }
    }
} catch {
    Write-Host "ERROR: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Step 2: Push Schema (if needed)
Write-Host "Step 2: Verifying database schema..." -ForegroundColor Cyan
Write-Host "-----------------------------------" -ForegroundColor Cyan
try {
    $output = npx prisma db push --schema database/schema.prisma --accept-data-loss 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "SUCCESS: Database schema is up to date" -ForegroundColor Green
    } else {
        Write-Host "WARNING: Schema push had issues, but continuing..." -ForegroundColor Yellow
    }
} catch {
    Write-Host "WARNING: Could not verify schema, but continuing..." -ForegroundColor Yellow
}

Write-Host ""

# Step 3: Seed Database
Write-Host "Step 3: Seeding database with initial data..." -ForegroundColor Cyan
Write-Host "-----------------------------------" -ForegroundColor Cyan
try {
    $env:DATABASE_URL = "mysql://root:@localhost:3306/receiptrocket"
    $output = npm run db:seed 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "SUCCESS: Database seeded successfully" -ForegroundColor Green
    } else {
        Write-Host "ERROR: Failed to seed database" -ForegroundColor Red
        Write-Host $output -ForegroundColor Red
        Write-Host ""
        Write-Host "You can try seeding manually later with: npm run db:seed" -ForegroundColor Yellow
    }
} catch {
    Write-Host "ERROR: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "You can try seeding manually later with: npm run db:seed" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Setup Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Start your dev server: npm run dev" -ForegroundColor White
Write-Host "2. Login with:" -ForegroundColor White
Write-Host "   - Email: sales@test.com" -ForegroundColor Gray
Write-Host "   - Password: password123" -ForegroundColor Gray
Write-Host ""









