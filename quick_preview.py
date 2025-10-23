#!/usr/bin/env python3
"""
Quick preview of what the comprehensive analysis will find
"""

import os
import re
from pathlib import Path

def quick_scan():
    """Quick scan to show what we'll find"""
    print("🕵️ QUICK PREVIEW OF POTENTIAL BUGS")
    print("=" * 40)
    
    potential_issues = []
    
    # Common patterns that indicate bugs
    patterns = {
        'Security Issues': [
            (r'innerHTML\s*=', 'innerHTML usage (XSS risk)'),
            (r'eval\s*\(', 'eval() usage (security risk)'),
            (r'(password|api_key|secret)\s*=\s*["\']', 'Hardcoded credentials'),
        ],
        'Performance Issues': [
            (r'useEffect\s*\(\s*\(\s*\)\s*=>\s*\{[^}]*\}\s*\)', 'useEffect without dependencies'),
            (r'on\w+\s*=\s*\{[^}]*=>[^}]*\}', 'Inline functions in render'),
            (r'\.map\s*\([^)]*\s*=>\s*[^}]*\}[^)]*\)', 'Missing key prop in map'),
        ],
        'Code Quality Issues': [
            (r'console\.(log|warn|error|info)', 'Console statements in production'),
            (r'TODO|FIXME|HACK|XXX', 'TODO/FIXME comments'),
            (r'except\s*:', 'Bare except clauses'),
        ],
        'Accessibility Issues': [
            (r'<img[^>]*>', 'Missing alt attributes'),
            (r'<button[^>]*>', 'Missing button types'),
        ]
    }
    
    # Scan for files
    for root, dirs, files in os.walk('.'):
        # Skip common directories
        dirs[:] = [d for d in dirs if d not in {'.git', 'node_modules', '__pycache__', '.next', 'dist', 'build'}]
        
        for file in files:
            if file.startswith('.') or not file.endswith(('.js', '.jsx', '.ts', '.tsx', '.py', '.json', '.md')):
                continue
                
            file_path = Path(root) / file
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                    
                for category, patterns_list in patterns.items():
                    for pattern, description in patterns_list:
                        matches = re.findall(pattern, content, re.IGNORECASE | re.MULTILINE)
                        if matches:
                            potential_issues.append({
                                'file': str(file_path),
                                'category': category,
                                'description': description,
                                'count': len(matches)
                            })
                            
            except (UnicodeDecodeError, PermissionError):
                continue
    
    # Display findings
    categories = {}
    for issue in potential_issues:
        cat = issue['category']
        if cat not in categories:
            categories[cat] = []
        categories[cat].append(issue)
    
    for category, issues in categories.items():
        print(f"\n📈 {category.upper()}:")
        for issue in issues[:3]:  # Show top 3 per category
            print(f"  • {issue['description']}: {issue['count']} occurrences")
            print(f"    File: {issue['file']}")
        if len(issues) > 3:
            print(f"  ... and {len(issues) - 3} more similar issues")
    
    total_issues = len(potential_issues)
    print(f"\n📊 ESTIMATED TOTAL ISSUES: {total_issues}")
    
    if total_issues > 0:
        print(f"\n🔧 Ready to run full comprehensive analysis!")
        print("The full analysis will provide:")
        print("  • Detailed bug reports with line numbers")
        print("  • Severity classifications (Critical, High, Medium, Low)")
        print("  • Complexity scores and time estimates")
        print("  • Comprehensive fix plan with phases")
        print("  • Risk assessment and team recommendations")
        print("\nRun: python3 run_full_analysis.py")
    else:
        print("✅ No major issues detected!")

if __name__ == "__main__":
    quick_scan()