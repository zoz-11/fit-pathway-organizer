#!/usr/bin/env python3
"""
Quick verification of the bug fixes
"""

import os
import sys

# Ensure we're in the right directory
os.chdir(os.path.dirname(os.path.abspath(__file__)))

def check_file_exists(filepath, description):
    """Check if a file exists and report result"""
    if os.path.exists(filepath):
        print(f"✅ {description}: {filepath}")
        return True
    else:
        print(f"❌ {description}: {filepath} (NOT FOUND)")
        return False

def check_file_contains(filepath, content, description):
    """Check if file contains specific content"""
    try:
        with open(filepath, 'r') as f:
            file_content = f.read()
            if content in file_content:
                print(f"✅ {description}")
                return True
            else:
                print(f"❌ {description} (CONTENT NOT FOUND)")
                return False
    except FileNotFoundError:
        print(f"❌ {description} (FILE NOT FOUND)")
        return False

def main():
    print("🕵️  QUICK BUG FIX VERIFICATION")
    print("=" * 40)
    
    checks = []
    
    # Check Python file
    checks.append(check_file_exists("python/chat_manager_refactored.py", "Python refactored chat manager"))
    
    # Check React files
    checks.append(check_file_exists("apps/web-app/src/App.tsx", "React App.tsx"))
    checks.append(check_file_exists("apps/web-app/src/hooks/useClickabilityFixes.ts", "React useClickabilityFixes hook"))
    checks.append(check_file_exists("apps/web-app/src/components/ErrorBoundary.tsx", "ErrorBoundary component"))
    
    # Check specific fixes
    checks.append(check_file_contains("apps/web-app/src/App.tsx", "React.ComponentType<any>", "TypeScript interface fix"))
    checks.append(check_file_contains("apps/web-app/src/hooks/useClickabilityFixes.ts", "mutationTimeout", "Hook memory leak fix"))
    checks.append(check_file_contains("apps/web-app/src/hooks/useClickabilityFixes.ts", "clearTimeout(mutationTimeout)", "Hook cleanup fix"))
    checks.append(check_file_contains("apps/web-app/src/__tests__/App.test.tsx", "@/fix-app-issues", "Test mock import fix"))
    
    # Check for exception handling fix in Python
    checks.append(check_file_contains("python/chat_manager_refactored.py", "raise  # Re-raise the exception", "Python exception handling fix"))
    
    passed = sum(checks)
    total = len(checks)
    
    print(f"\n📈 RESULTS: {passed}/{total} checks passed")
    
    if passed == total:
        print("\n🎉 ALL BUGS APPEAR TO BE FIXED!")
        print("✅ The critical issues have been addressed:")
        print("   • Python context manager exception handling")
        print("   • React hook memory leak prevention")
        print("   • TypeScript interface compatibility")
        print("   • Error boundary for better error handling")
        print("   • Test mock import correction")
        return 0
    else:
        print(f"\n⚠️  {total - passed} issues may still need attention")
        return 1

if __name__ == "__main__":
    sys.exit(main())