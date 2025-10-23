#!/bin/bash

echo "=== Bug Hunt Started ==="

echo "1. Checking for common JavaScript/React bugs..."

# Check for potential issues in App.tsx
echo "Checking App.tsx..."
cd apps/web-app/src

# Look for common React bugs
echo "- Checking for missing dependencies in useEffect..."
grep -A 5 -B 5 "useEffect" App.tsx | grep -v "^--$"

echo "- Checking for potential memory leaks..."
grep -n "observer\|addEventListener\|setInterval\|setTimeout" App.tsx

echo "- Checking for missing key props in lists..."
grep -n "map\|forEach" App.tsx

echo "- Checking for potential undefined access..."
grep -n "\.\|\\[" App.tsx | grep -v "test\|mock"

echo "2. Checking for import issues..."
grep -n "import" App.tsx | head -10

echo "3. Checking for TypeScript errors..."
grep -n "any\|unknown\|@ts-ignore" App.tsx

echo "4. Checking hook usage..."
grep -n "useAuth\|usePushNotifications\|useClickabilityFixes" App.tsx

echo "5. Checking for potential routing issues..."
grep -n "Route\|Routes\|BrowserRouter" App.tsx

echo "6. Checking Python files for bugs..."
cd ../../../python

echo "- Checking for file handling issues..."
grep -n "open\|close\|with" *.py

echo "- Checking for error handling..."
grep -n "try\|except\|finally" *.py

echo "- Checking for potential None access..."
grep -n "None\|null" *.py

echo "7. Summary of potential issues found:"
echo "- Look for useEffect without dependency arrays"
echo "- Check for event listeners that aren't cleaned up"
echo "- Verify all imports are valid"
echo "- Ensure proper error handling in file operations"
echo "- Check for potential null/undefined access"