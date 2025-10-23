#!/bin/bash

echo "🕵️ STARTING COMPREHENSIVE BUG HUNT"
echo "======================================"
echo ""

# Make sure we have Python 3
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is required but not installed"
    exit 1
fi

# Make scripts executable
chmod +x comprehensive_bug_hunt.py

# Run the comprehensive bug hunt
echo "📁 Scanning entire codebase..."
python3 comprehensive_bug_hunt.py

# Check if report was generated
if [ -f "detailed_bug_report.json" ]; then
    echo ""
    echo "✅ Bug hunt completed successfully!"
    echo "📄 Detailed report saved to: detailed_bug_report.json"
    echo ""
    echo "Next steps:"
    echo "1. Review the detailed_bug_report.json file"
    echo "2. Use the bug_fix_plan_generator.py to create a fix plan"
    echo "3. Prioritize critical and high severity bugs first"
else
    echo "❌ Bug hunt failed - no report generated"
fi