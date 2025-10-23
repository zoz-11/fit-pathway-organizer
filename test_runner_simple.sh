#!/bin/bash

echo "=== Running Python Tests ==="
cd python

# Run Python tests
echo "Running chat_manager tests..."
python3 -m pytest test_chat_manager.py -v 2>/dev/null || python3 test_chat_manager.py 2>/dev/null

echo "Running refactored chat_manager tests..."
python3 -m pytest test_chat_manager_refactored.py -v 2>/dev/null || python3 test_chat_manager_refactored.py 2>/dev/null

echo "=== Checking for React Test Issues ==="
cd ../apps/web-app

# Check if there are any obvious issues in the test files
echo "Checking React test files for issues..."
grep -n "mock\|jest\|describe\|it\|test" src/__tests__/*.tsx | head -20

echo "=== Checking App.tsx for potential bugs ==="
echo "Looking for common React bugs..."
grep -n "useEffect\|useState\|useCallback\|useMemo" src/App.tsx
echo "Checking for any console.log or debug statements..."
grep -n "console\|debug" src/App.tsx

echo "=== Checking package.json for script issues ==="
cd ../..
cat package.json | grep -A 5 -B 5 "test"