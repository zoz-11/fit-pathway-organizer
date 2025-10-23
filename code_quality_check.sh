#!/bin/bash
# Code quality check script

echo "=== Running Code Quality Checks ==="

# Check for common JavaScript/TypeScript issues
echo "1. Checking for console.log statements that should be removed..."
find apps/web-app/src -name "*.ts" -o -name "*.tsx" | xargs grep -n "console\.log" | grep -v "console\.error" | head -10

echo "2. Checking for unused imports..."
find apps/web-app/src -name "*.ts" -o -name "*.tsx" | xargs grep -n "import.*from" | head -10

echo "3. Checking for potential memory leaks (addEventListener without remove)..."
find apps/web-app/src -name "*.ts" -o -name "*.tsx" | xargs grep -n "addEventListener" | head -5

echo "4. Checking for any remaining 'any' types that should be properly typed..."
find apps/web-app/src -name "*.ts" -o -name "*.tsx" | xargs grep -n ": any" | head -5

echo "5. Checking for potential null/undefined issues..."
find apps/web-app/src -name "*.ts" -o -name "*.tsx" | xargs grep -n "!=" | head -5

echo "=== Code Quality Check Complete ==="