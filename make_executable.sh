#!/bin/bash

# Make all our scripts executable
chmod +x run_verification.sh 2>/dev/null || true
chmod +x run_simple_verification.sh 2>/dev/null || true
chmod +x run_final_verification.sh 2>/dev/null || true
chmod +x find_bugs.sh 2>/dev/null || true
chmod +x test_runner_simple.sh 2>/dev/null || true

echo "✅ All scripts are now executable!"
echo ""
echo "You can now run:"
echo "  ./run_final_verification.sh  - Complete verification of all fixes"
echo "  ./find_bugs.sh                - Hunt for potential bugs in the codebase"
echo "  python3 test_fixes_simple.py  - Quick Python/React fix verification"