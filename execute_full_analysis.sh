#!/bin/bash

echo "🕵️ EXECUTING COMPLETE BUG ANALYSIS & FIX PLAN"
echo "==============================================="
echo ""

# Make scripts executable
chmod +x *.py
chmod +x *.sh

# Change to script directory
cd "$(dirname "$0")"

# Run the complete analysis
python3 run_full_analysis.py

echo ""
echo "🔄 Analysis complete! Check the generated files for detailed results."
echo ""
echo "To view the detailed results:"
echo "  • cat detailed_bug_report.json | python3 -m json.tool"
echo "  • cat comprehensive_fix_plan.json | python3 -m json.tool"
echo ""
echo "To continue with fixes:"
echo "  • Start with Phase 1: Critical Security & Stability Fixes"
echo "  • Follow the detailed plan in comprehensive_fix_plan.json"