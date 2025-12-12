#!/bin/bash
# Quick Fix Script for Login Issues - Run this in cPanel Terminal

echo "=== Step 1: Finding your project directory ==="
echo "Checking common locations..."
ls -la ~/public_html/ 2>/dev/null | head -10
echo ""
echo "Checking domains..."
ls -la ~/domains/ 2>/dev/null | head -10

echo ""
echo "=== Step 2: Finding Node.js ==="
echo "Checking for node in PATH..."
which node || echo "Node not in PATH"

echo ""
echo "Checking common Node.js locations..."
find /opt/cpanel -name "node" -type f 2>/dev/null | head -5
find /usr/local -name "node" -type f 2>/dev/null | head -5
find /usr/bin -name "node" -type f 2>/dev/null | head -5

echo ""
echo "Checking for npm (which uses node)..."
which npm || echo "npm not found"

echo ""
echo "=== Step 3: Finding your project ==="
echo "Looking for package.json..."
find ~/public_html -name "package.json" 2>/dev/null
find ~/domains -name "package.json" 2>/dev/null

echo ""
echo "=== Instructions ==="
echo "1. Find your project directory from above"
echo "2. Find Node.js path from above"
echo "3. Navigate: cd ~/public_html/fa.apps-gihonsaccos.com (or correct path)"
echo "4. Use full path: /path/to/node scripts/quick-fix-login.js"
echo ""
echo "OR use cPanel Application Manager Terminal instead!"






