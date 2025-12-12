#!/bin/bash
# Find where your Receipt Rocket project is located

echo "=== Checking public_html ==="
ls -la ~/public_html/ 2>/dev/null

echo ""
echo "=== Checking domains ==="
ls -la ~/domains/ 2>/dev/null

echo ""
echo "=== Checking home directory ==="
ls -la ~/ | grep -E "(receipt|rocket|app|project)" -i

echo ""
echo "=== Searching for package.json ==="
find ~ -maxdepth 4 -name "package.json" 2>/dev/null | head -10

echo ""
echo "=== Searching for prisma schema ==="
find ~ -maxdepth 4 -name "schema.prisma" 2>/dev/null | head -10

echo ""
echo "=== Searching for next.config ==="
find ~ -maxdepth 4 -name "next.config.*" 2>/dev/null | head -10






