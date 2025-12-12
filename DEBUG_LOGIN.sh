#!/bin/bash
# Debug script for login issues

echo "=== Step 1: Check Environment Variables ==="
export PATH="/opt/cpanel/ea-nodejs22/bin:$PATH"
export DATABASE_URL="mysql://appsgiho_user:%23Gihon_60908@localhost:3306/appsgiho_re"

echo "DATABASE_URL is set: $(echo $DATABASE_URL | sed 's/:[^@]*@/:***@/')"
echo "Node version: $(node --version)"

echo ""
echo "=== Step 2: Test Database Connection ==="
mysql -h localhost -u appsgiho_user -p'#Gihon_60908' appsgiho_re -e "SHOW TABLES;" 2>&1

echo ""
echo "=== Step 3: Check Prisma Client ==="
ls -la src/generated/prisma/ 2>/dev/null | head -10 || echo "Prisma client not found"

echo ""
echo "=== Step 4: Check if tables exist ==="
mysql -h localhost -u appsgiho_user -p'#Gihon_60908' appsgiho_re -e "SHOW TABLES;" 2>&1

echo ""
echo "=== Step 5: Check users ==="
mysql -h localhost -u appsgiho_user -p'#Gihon_60908' appsgiho_re -e "SELECT email, role, isActive FROM User LIMIT 5;" 2>&1

echo ""
echo "=== Step 6: Try Prisma Generate ==="
npx prisma generate 2>&1 | tail -20

echo ""
echo "=== Step 7: Try Quick Fix Script ==="
node scripts/quick-fix-login.js 2>&1 | tail -30






