#!/usr/bin/env python3
"""
Interactive Phase 1 Execution - Critical Security & Stability Fixes
This provides a guided, interactive experience for fixing critical bugs
"""

import os
import re
from datetime import datetime
from typing import List, Dict

def print_header(title):
    """Print formatted header"""
    print(f"\n🚀 {title}")
    print("=" * 60)

def print_section(title):
    """Print formatted section"""
    print(f"\n📋 {title}")
    print("-" * 40)

def scan_for_xss_vulnerabilities():
    """Scan codebase for XSS vulnerabilities"""
    print_section("SCANNING FOR XSS VULNERABILITIES")
    
    xss_issues = []
    
    # Scan for innerHTML usage
    print("🔍 Searching for innerHTML usage...")
    
    for root, dirs, files in os.walk('.'):
        dirs[:] = [d for d in dirs if d not in {'.git', 'node_modules', '__pycache__', '.next', 'dist', 'build'}]
        
        for file in files:
            if file.endswith(('.js', '.jsx', '.ts', '.tsx', '.html')):
                file_path = os.path.join(root, file)
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                        lines = content.split('\n')
                        
                    # Look for innerHTML patterns
                    for i, line in enumerate(lines, 1):
                        if 'innerHTML' in line and '=' in line:
                            xss_issues.append({
                                'file': file_path,
                                'line': i,
                                'code': line.strip(),
                                'type': 'innerHTML',
                                'severity': 'CRITICAL'
                            })
                            
                    # Look for eval() usage
                    for i, line in enumerate(lines, 1):
                        if 'eval(' in line:
                            xss_issues.append({
                                'file': file_path,
                                'line': i,
                                'code': line.strip(),
                                'type': 'eval',
                                'severity': 'CRITICAL'
                            })
                            
                except (UnicodeDecodeError, PermissionError):
                    continue
    
    return xss_issues

def scan_for_python_exceptions():
    """Scan for bare except clauses in Python"""
    print_section("SCANNING FOR PYTHON EXCEPTION ISSUES")
    
    exception_issues = []
    
    print("🔍 Searching for bare except clauses...")
    
    for root, dirs, files in os.walk('.'):
        dirs[:] = [d for d in dirs if d not in {'.git', '__pycache__', '.pytest_cache'}]
        
        for file in files:
            if file.endswith('.py'):
                file_path = os.path.join(root, file)
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                        lines = content.split('\n')
                        
                    for i, line in enumerate(lines, 1):
                        if re.search(r'except\s*:', line) and 'except Exception' not in line:
                            exception_issues.append({
                                'file': file_path,
                                'line': i,
                                'code': line.strip(),
                                'type': 'bare_except',
                                'severity': 'HIGH'
                            })
                            
                except (UnicodeDecodeError, PermissionError):
                    continue
    
    return exception_issues

def scan_for_accessibility_issues():
    """Scan for accessibility issues"""
    print_section("SCANNING FOR ACCESSIBILITY ISSUES")
    
    accessibility_issues = []
    
    print("🔍 Searching for missing alt attributes...")
    
    for root, dirs, files in os.walk('.'):
        dirs[:] = [d for d in dirs if d not in {'.git', 'node_modules', '__pycache__'}]
        
        for file in files:
            if file.endswith(('.jsx', '.tsx', '.html', '.vue')):
                file_path = os.path.join(root, file)
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                        lines = content.split('\n')
                        
                    for i, line in enumerate(lines, 1):
                        if '<img' in line and 'alt=' not in line:
                            accessibility_issues.append({
                                'file': file_path,
                                'line': i,
                                'code': line.strip(),
                                'type': 'missing_alt',
                                'severity': 'MEDIUM'
                            })
                            
                except (UnicodeDecodeError, PermissionError):
                    continue
    
    return accessibility_issues

def interactive_fix_guide(issues: List[Dict], issue_type: str):
    """Provide interactive fix guidance"""
    if not issues:
        print(f"✅ No {issue_type} issues found!")
        return
    
    print(f"📊 Found {len(issues)} {issue_type} issues:")
    
    for i, issue in enumerate(issues, 1):
        print(f"\n{i}. 📍 {issue['file']}:{issue['line']}")
        print(f"   💾 Code: {issue['code']}")
        print(f"   🔴 Severity: {issue['severity']}")
        
        if issue['type'] == 'innerHTML':
            print("   💡 Fix: Replace innerHTML with textContent or use DOMPurify")
            print("   🔧 Example: element.textContent = data;")
            print("   📄 Or: element.innerHTML = DOMPurify.sanitize(data);")
            
        elif issue['type'] == 'eval':
            print("   💡 Fix: Replace eval() with safer alternatives")
            print("   🔧 For JSON: JSON.parse(data)")
            print("   🔧 For functions: new Function(data)()")
            
        elif issue['type'] == 'bare_except':
            print("   💡 Fix: Use specific exception handling")
            print("   🔧 Replace: except:")
            print("   🗌 With: except Exception as e:")
            print("   🗌 Or: except (ValueError, TypeError) as e:")
            
        elif issue['type'] == 'missing_alt':
            print("   💡 Fix: Add alt attribute to images")
            print("   🔧 Example: <img src='logo.png' alt='Company logo' />")
            print("   📄 For decorative images: alt=''")
        
        # Mark as fixed
        while True:
            response = input("   ✅ Mark as fixed? (y/n/s=skip): ").lower()
            if response in ['y', 'n', 's']:
                issue['fixed'] = response == 'y'
                break
            print("   Please enter 'y', 'n', or 's'")

def create_fix_summary(all_issues: Dict):
    """Create a summary of all fixes"""
    print_header("FIX SUMMARY")
    
    total_issues = sum(len(issues) for issues in all_issues.values())
    total_fixed = sum(len([i for i in issues if i.get('fixed')]) for issues in all_issues.values())
    
    print(f"📊 Total Issues Found: {total_issues}")
    print(f"✅ Issues Fixed: {total_fixed}")
    print(f"📈 Completion Rate: {(total_fixed/total_issues)*100:.1f}%")
    
    # Create detailed fix report
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"phase1_fixes_{timestamp}.md"
    
    with open(filename, 'w') as f:
        f.write("# 🕵️ PHASE 1 FIXES REPORT\n\n")
        f.write(f"**Generated**: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n")
        f.write(f"📊 **Total Issues**: {total_issues}\n")
        f.write(f"✅ **Issues Fixed**: {total_fixed}\n")
        f.write(f"📈 **Completion**: {(total_fixed/total_issues)*100:.1f}%\n\n")
        
        for category, issues in all_issues.items():
            if issues:
                f.write(f"## {category.replace('_', ' ').title()}\n\n")
                for issue in issues:
                    f.write(f"### {issue['file']}:{issue['line']}\n")
                    f.write(f"**Code**: `{issue['code']}`\n")
                    f.write(f"**Status**: {'✅ Fixed' if issue.get('fixed') else '❌ Not Fixed'}\n\n")
    
    print(f"\n📄 Detailed fix report saved to: {filename}")
    return filename

def security_testing_checklist():
    """Provide security testing checklist"""
    print_header("SECURITY TESTING CHECKLIST")
    
    checklist = [
        "Test XSS payloads in all input fields",
        "Verify innerHTML replacements work correctly",
        "Test eval() replacements with various inputs",
        "Check that credentials are not exposed in code",
        "Test exception handling with invalid inputs",
        "Verify data validation on all forms",
        "Run automated security scanner (OWASP ZAP)",
        "Test with SQL injection payloads",
        "Verify secure headers are in place",
        "Check for sensitive data in logs"
    ]
    
    print("🧪 Complete these security tests:")
    for i, item in enumerate(checklist, 1):
        print(f"{i}. {item}")
    
    return checklist

def main():
    """Main execution function"""
    print_header("PHASE 1: CRITICAL SECURITY & STABILITY FIXES")
    
    print("📈 Phase Overview:")
    print("- Duration: 1-2 weeks")
    print("- Priority: CRITICAL")
    print("- Team Size: 2-3 developers")
    print("- Testing: Security-focused")
    print("- Goal: Eliminate critical security vulnerabilities and system stability issues")
    
    input("\n🔄 Press Enter to start scanning for bugs...")
    
    # Scan for different types of issues
    all_issues = {}
    
    # 1. Scan for XSS vulnerabilities
    xss_issues = scan_for_xss_vulnerabilities()
    all_issues['xss_vulnerabilities'] = xss_issues
    
    # 2. Scan for Python exception issues
    exception_issues = scan_for_python_exceptions()
    all_issues['exception_issues'] = exception_issues
    
    # 3. Scan for accessibility issues
    accessibility_issues = scan_for_accessibility_issues()
    all_issues['accessibility_issues'] = accessibility_issues
    
    # Interactive fix guidance
    print_header("INTERACTIVE FIX GUIDANCE")
    
    for category, issues in all_issues.items():
        if issues:
            interactive_fix_guide(issues, category.replace('_', ' '))
    
    # Create fix summary
    fix_report = create_fix_summary(all_issues)
    
    # Security testing checklist
    security_tests = security_testing_checklist()
    
    # Final summary
    print_header("PHASE 1 COMPLETION SUMMARY")
    
    total_issues = sum(len(issues) for issues in all_issues.values())
    total_fixed = sum(len([i for i in issues if i.get('fixed')]) for issues in all_issues.values())
    
    print(f"📊 Total Issues Found: {total_issues}")
    print(f"✅ Issues Fixed: {total_fixed}")
    print(f"📈 Completion Rate: {(total_fixed/total_issues)*100:.1f}%")
    
    if total_fixed == total_issues:
        print("🎉 PHASE 1 COMPLETE!")
        print("✅ All critical security and stability issues have been addressed!")
        print("🚀 Ready to proceed to Phase 2: Performance & Reliability")
    else:
        print(f"⚠️ {total_issues - total_fixed} issues still need attention")
        print("🔄 Review the fix report and complete remaining items")
    
    print(f"\n📄 Files generated:")
    print(f"   • {fix_report} - Detailed fix report")
    print(f"   • Security testing checklist provided above")
    
    # Next steps
    print(f"\n🔄 NEXT STEPS:")
    if total_fixed == total_issues:
        print("1. Run security testing (see checklist above)")
        print("2. Validate all fixes work correctly")
        print("3. Prepare for Phase 2: Performance & Reliability")
        print("4. Update team on Phase 1 completion")
    else:
        print("1. Complete remaining fixes")
        print("2. Test completed fixes")
        print("3. Return to complete Phase 1 before Phase 2")

# Execute Phase 1 immediately
main()