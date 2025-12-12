# cPanel Terminal Commands Guide

## Common Issues and Solutions

### Issue 1: "cd: too many arguments"
**Problem:** You have a space in your path
**Solution:** Use quotes or escape the space

```bash
# Wrong:
cd ~/public_html fa.apps-gihonsaccos.com

# Correct (option 1 - use quotes):
cd ~/public_html/"fa.apps-gihonsaccos.com"

# Correct (option 2 - no space):
cd ~/public_html/fa.apps-gihonsaccos.com

# Correct (option 3 - escape space):
cd ~/public_html/fa.apps-gihonsaccos.com
```

### Issue 2: "node: command not found"
**Problem:** Node.js is not in your PATH in the terminal

**Solutions:**

#### Option 1: Find Node.js Installation
```bash
# Find where Node.js is installed
which node
whereis node
find /usr -name node 2>/dev/null
find /opt -name node 2>/dev/null
```

#### Option 2: Use Full Path
If Node.js is installed via cPanel Application Manager, it might be at:
```bash
# Try these paths:
/opt/cpanel/ea-nodejs18/bin/node
/opt/cpanel/ea-nodejs20/bin/node
/usr/local/bin/node
/usr/bin/node
```

#### Option 3: Use nvm (if available)
```bash
# Load nvm
source ~/.nvm/nvm.sh
# Or
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Then use node
node --version
```

#### Option 4: Use Application Manager Terminal
Instead of regular SSH/Terminal, use:
1. cPanel → **Application Manager**
2. Click on your Node.js app
3. Use the **"Terminal"** or **"Run Command"** feature
4. This terminal will have Node.js in the PATH

#### Option 5: Use npm/npx directly
Sometimes npm is available even if node isn't:
```bash
npm --version
npx --version
```

## Correct Commands for Your Setup

### Step 1: Navigate to Your Project
```bash
# Find your project directory first
ls ~/public_html/
ls ~/domains/
ls ~/

# Then navigate (replace with actual directory name)
cd ~/public_html/fa.apps-gihonsaccos.com
# OR
cd ~/domains/fa.apps-gihonsaccos.com/public_html
```

### Step 2: Find Node.js
```bash
# Check if node is available
which node
node --version

# If not found, try to find it
find /usr -name "node" -type f 2>/dev/null | head -5
find /opt -name "node" -type f 2>/dev/null | head -5

# Or check if npm works (which uses node)
which npm
npm --version
```

### Step 3: Run Commands with Full Path
Once you find Node.js, use the full path:
```bash
# Example (replace with actual path):
/opt/cpanel/ea-nodejs18/bin/node scripts/quick-fix-login.js
/opt/cpanel/ea-nodejs18/bin/npx prisma generate
```

### Step 4: Alternative - Use Application Manager
1. Go to **cPanel → Application Manager**
2. Click on your **Receipt Rocket** app
3. Look for **"Terminal"**, **"Run Command"**, or **"Console"** button
4. Run commands there (Node.js will be in PATH)

## Quick Diagnostic Commands

Run these to find your setup:

```bash
# 1. List directories in public_html
ls -la ~/public_html/

# 2. Find your project
find ~/public_html -name "package.json" 2>/dev/null
find ~/domains -name "package.json" 2>/dev/null

# 3. Find Node.js
which node || find /usr /opt -name "node" -type f 2>/dev/null | head -3

# 4. Check environment
echo $PATH
env | grep -i node
```

## Using cPanel Application Manager (Recommended)

Instead of SSH/Terminal, use Application Manager:

1. **cPanel → Application Manager**
2. Click on your **Receipt Rocket** app
3. Click **"Terminal"** or **"Run Command"**
4. Run:
   ```bash
   node scripts/quick-fix-login.js
   npx prisma generate
   npx prisma db push
   npm run db:seed
   ```

This terminal will have Node.js properly configured!






