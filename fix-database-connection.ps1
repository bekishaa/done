# Fix Database Connection for Local Development
Write-Host "Fixing Database Connection..." -ForegroundColor Cyan

# Check which MySQL service to use
$mysqlServices = Get-Service -Name "*mysql*" -ErrorAction SilentlyContinue
if ($mysqlServices) {
    Write-Host "`nFound MySQL services:" -ForegroundColor Yellow
    $mysqlServices | ForEach-Object { Write-Host "  - $($_.Name): $($_.Status)" }
    
    # Try to start MySQL80 (most common)
    $serviceToStart = $mysqlServices | Where-Object { $_.Name -like "*80*" } | Select-Object -First 1
    if (-not $serviceToStart) {
        $serviceToStart = $mysqlServices | Select-Object -First 1
    }
    
    if ($serviceToStart.Status -eq 'Stopped') {
        Write-Host "`nMySQL service '$($serviceToStart.Name)' is stopped." -ForegroundColor Yellow
        Write-Host "Attempting to start it..." -ForegroundColor Cyan
        
        try {
            Start-Service -Name $serviceToStart.Name -ErrorAction Stop
            Write-Host "MySQL service started successfully!" -ForegroundColor Green
            Start-Sleep -Seconds 3
        } catch {
            Write-Host "Could not start MySQL service automatically." -ForegroundColor Red
            Write-Host "Please start MySQL manually:" -ForegroundColor Yellow
            Write-Host "  1. Open Services (services.msc)" -ForegroundColor White
            Write-Host "  2. Find '$($serviceToStart.Name)'" -ForegroundColor White
            Write-Host "  3. Right-click -> Start" -ForegroundColor White
            Write-Host "`nOr if using XAMPP/WAMP, start MySQL from the control panel." -ForegroundColor Yellow
            Read-Host "`nPress Enter after MySQL is started..."
        }
    } else {
        Write-Host "MySQL service is already running" -ForegroundColor Green
    }
} else {
    Write-Host "No MySQL services found. Checking for XAMPP..." -ForegroundColor Yellow
    $xamppPath = "C:\xampp\mysql\bin\mysqld.exe"
    if (Test-Path $xamppPath) {
        Write-Host "Found XAMPP MySQL" -ForegroundColor Green
        Write-Host "Please start MySQL from XAMPP Control Panel" -ForegroundColor Yellow
        Read-Host "Press Enter after MySQL is started..."
    } else {
        Write-Host "No MySQL installation found." -ForegroundColor Red
        Write-Host "Please install MySQL or XAMPP first." -ForegroundColor Yellow
        exit 1
    }
}

# Ask for MySQL root password
Write-Host "`nPlease enter your MySQL root password (press Enter for no password):" -ForegroundColor Cyan
$rootPassword = Read-Host "MySQL Root Password"

# Create database
Write-Host "`nCreating database 'receiptrocket'..." -ForegroundColor Cyan
$dbName = "receiptrocket"

try {
    $env:PATH = "C:\Program Files\MySQL\MySQL Server 8.0\bin;C:\Program Files\MySQL\MySQL Server 8.1\bin;C:\xampp\mysql\bin;$env:PATH"
    
    if ($rootPassword -eq "") {
        $result = & mysql -u root -e "CREATE DATABASE IF NOT EXISTS $dbName;" 2>&1
    } else {
        $result = & mysql -u root -p"$rootPassword" -e "CREATE DATABASE IF NOT EXISTS $dbName;" 2>&1
    }
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Database '$dbName' created/verified" -ForegroundColor Green
    } else {
        Write-Host "Could not create database automatically: $result" -ForegroundColor Yellow
        Write-Host "You may need to create it manually" -ForegroundColor Yellow
    }
} catch {
    Write-Host "Could not create database automatically" -ForegroundColor Yellow
    Write-Host "You may need to create it manually" -ForegroundColor Yellow
}

# Update .env.local with correct credentials
Write-Host "`nUpdating .env.local file..." -ForegroundColor Cyan

$passwordPart = if ($rootPassword -eq "") { "" } else { ":$rootPassword" }
$databaseUrl = "mysql://root$passwordPart@localhost:3306/$dbName"

# Read existing .env.local
$envContent = @()
if (Test-Path ".env.local") {
    $envContent = Get-Content ".env.local"
}

# Remove old DATABASE_URL lines
$envContent = $envContent | Where-Object { $_ -notmatch "^DATABASE_URL=" }

# Add new DATABASE_URL at the top
$envContent = @("DATABASE_URL=$databaseUrl") + $envContent

Set-Content -Path ".env.local" -Value $envContent
Write-Host "Updated .env.local with: DATABASE_URL=$databaseUrl" -ForegroundColor Green

Write-Host "`nSetup complete!" -ForegroundColor Green
Write-Host "`nNext steps:" -ForegroundColor Cyan
Write-Host "1. Restart your development server (npm run dev)" -ForegroundColor White
Write-Host "2. Run: npm run db:push  (to create tables)" -ForegroundColor White
Write-Host "3. Run: npm run db:seed  (to add sample users)" -ForegroundColor White
Write-Host "`nDefault login after seeding:" -ForegroundColor Yellow
Write-Host "  Email: superadmin@test.com" -ForegroundColor White
Write-Host "  Password: password123" -ForegroundColor White
