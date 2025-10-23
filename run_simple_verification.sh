#!/bin/bash

echo "🕵️  Running Bug Fix Verification"
echo "===================================="

# Run the simple verification
python3 test_fixes_simple.py

# Also check if the ErrorBoundary component was created
echo ""
echo "🛡️  Checking ErrorBoundary component..."
if [ -f "apps/web-app/src/components/ErrorBoundary.tsx" ]; then
    echo "✅ ErrorBoundary component created"
else
    echo "❌ ErrorBoundary component missing"
fi

# Check if the test mock import was fixed
echo ""
echo "🧪 Checking test mock import fix..."
if grep -q "@/fix-app-issues" apps/web-app/src/__tests__/App.test.tsx; then
    echo "✅ Test mock import fixed"
else
    echo "❌ Test mock import not fixed"
fi

echo ""
echo "🎯 Verification complete!"
echo "Check the results above to see which bugs have been fixed."