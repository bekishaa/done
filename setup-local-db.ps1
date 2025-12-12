# Setup Local MySQL Database for Receipt Rocket
Write-Host "🚀 Setting up local MySQL database..." -ForegroundColor Cyan

# Check if XAMPP MySQL is installed
$xamppPath = "C:\xampp\mysql\bin\mysqld.exe"
if (-not (Test-Path $xamppPath)) {
    Write-Host "❌ XAMPP MySQL not found at $xamppPath" -ForegroundColor Red
    Write-Host "Please install XAMPP or start MySQL manually" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ XAMPP MySQL found" -ForegroundColor Green

# Start XAMPP MySQL (if not running)
Write-Host "`n📡 Starting MySQL service..." -ForegroundColor Cyan
$mysqlProcess = Get-Process -Name "mysqld" -ErrorAction SilentlyContinue
if (-not $mysqlProcess) {
    Write-Host "Starting MySQL from XAMPP..." -ForegroundColor Yellow
    Start-Process -FilePath "C:\xampp\xampp-control.exe" -WindowStyle Minimized
    Start-Sleep -Seconds 2
    Write-Host "⚠️  Please start MySQL from XAMPP Control Panel:" -ForegroundColor Yellow
    Write-Host "   1. Open XAMPP Control Panel" -ForegroundColor White
    Write-Host "   2. Click 'Start' next to MySQL" -ForegroundColor White
    Write-Host "   3. Wait for it to turn green" -ForegroundColor White
    Write-Host "   4. Press Enter to continue..." -ForegroundColor Yellow
    Read-Host
} else {
    Write-Host "✅ MySQL is already running" -ForegroundColor Green
}

# Test connection
Write-Host "`n🔌 Testing database connection..." -ForegroundColor Cyan
$env:DATABASE_URL = "mysql://root:@localhost:3306/receiptrocket"

try {
    # Try to connect and create database
    $mysqlExe = "C:\xampp\mysql\bin\mysql.exe"
    if (Test-Path $mysqlExe) {
        # Create database
        Write-Host "Creating database 'receiptrocket'..." -ForegroundColor Yellow
        & $mysqlExe -u root -e "CREATE DATABASE IF NOT EXISTS receiptrocket;" 2>&1 | Out-Null
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Database 'receiptrocket' created/verified" -ForegroundColor Green
        } else {
            Write-Host "⚠️  Could not create database automatically" -ForegroundColor Yellow
            Write-Host "   You may need to create it manually in phpMyAdmin" -ForegroundColor Yellow
        }
    }
} catch {
    Write-Host "⚠️  Could not test connection automatically" -ForegroundColor Yellow
}

# Update .env file
Write-Host "`nUpdating .env file..." -ForegroundColor Cyan
$envContent = "DATABASE_URL=`"mysql://root:@localhost:3306/receiptrocket`"`nNEXT_PUBLIC_APP_URL=`"http://localhost:3000`"`nNEXT_PUBLIC_BASE_URL=`"http://localhost:3000`"`nNEXTAUTH_URL=`"http://localhost:3000`"`nNEXTAUTH_SECRET=`"changeme-in-production`""

Set-Content -Path ".env" -Value $envContent -Encoding UTF8
Write-Host "SUCCESS: .env file updated" -ForegroundColor Green

Write-Host "`nSUCCESS: Setup complete!" -ForegroundColor Green
Write-Host "`nNext steps:" -ForegroundColor Cyan
Write-Host "1. Make sure MySQL is running in XAMPP" -ForegroundColor White
Write-Host "2. Run: npm run db:push" -ForegroundColor White
Write-Host "3. Run: npm run db:seed" -ForegroundColor White
Write-Host "4. Run: npm run dev" -ForegroundColor White

