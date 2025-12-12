#!/bin/bash
# Script to find project and run quick fix

echo "=== Finding your project directory ==="
echo "Checking public_html..."
ls -la ~/public_html/ 2>/dev/null

echo ""
echo "Checking domains..."
ls -la ~/domains/ 2>/dev/null

echo ""
echo "Looking for package.json files..."
find ~/public_html -name "package.json" 2>/dev/null
find ~/domains -name "package.json" 2>/dev/null
find ~ -maxdepth 3 -name "package.json" 2>/dev/null | head -5






