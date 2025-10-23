#!/usr/bin/env python3
"""
Execute Phase 1: Critical Security & Stability Fixes
This script guides through the execution of Phase 1 tasks
"""

import os
import json
from datetime import datetime
from typing import List, Dict

def load_checklist():
    """Load the master checklist"""
    try:
        with open('sample_checklist.json', 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        # Use demo checklist if sample doesn't exist
        return create_demo_checklist()

def create_demo_checklist():
    """Create demo checklist for Phase 1"""
    return {
        'phases': {
            'phase_1': {
                'name': 'Critical Security & Stability Fixes',
                'tasks': [
                    {
                        'id': 'P1-T1',
                        'title': 'Fix Critical Security Vulnerabilities',
                        'description': 'Address all critical security issues',
                        'estimated_hours': 2.0,
                        'checklist': [
                            {'item': 'Identify all innerHTML usage', 'status': 'pending'},
                            {'item': 'Replace innerHTML with textContent/DOMPurify', 'status': 'pending'},
                            {'item': 'Remove eval() usage', 'status': 'pending'},
                            {'item': 'Secure hardcoded credentials', 'status': 'pending'},
                            {'item': 'Fix localStorage security issues', 'status': 'pending'},
                            {'item': 'Security testing and validation', 'status': 'pending'}
                        ]
                    },
                    {
                        'id': 'P1-T2',
                        'title': 'Fix System Stability Issues',
                        'description': 'Address system stability and exception handling',
                        'estimated_hours': 1.0,
                        'checklist': [
                            {'item': 'Fix bare except clauses', 'status': 'pending'},
                            {'item': 'Implement proper exception handling', 'status': 'pending'},
                            {'item': 'Add data validation', 'status': 'pending'},
                            {'item': 'Stability testing', 'status': 'pending'}
                        ]
                    }
                ]
            }
        }
    }

def display_phase_1_overview():
    """Display Phase 1 overview"""
    print("🕵️ PHASE 1: CRITICAL SECURITY & STABILITY FIXES")
    print("=" * 50)
    print("\n📈 Phase Overview:")
    print("- Duration: 1-2 weeks")
    print("- Priority: CRITICAL")
    print("- Team Size: 2-3 developers")
    print("- Testing Focus: Security testing")
    print("- Total Time: 3.0 hours")
    print("\n🚨 Critical Issues to Address:")
    print("1. XSS vulnerabilities through innerHTML usage")
    print("2. Dangerous eval() function calls")
    print("3. Hardcoded credentials in code")
    print("4. Bare except clauses hiding errors")
    print("5. Missing data validation")

def execute_task(task: Dict, task_num: int):
    """Execute a single task with interactive checklist"""
    print(f"\n📋 TASK {task_num}: {task['title']}")
    print("-" * 40)
    print(f"Description: {task['description']}")
    print(f"Estimated Time: {task['estimated_hours']} hours")
    print(f"Items to complete: {len(task['checklist'])}")
    
    completed_items = 0
    
    for i, item in enumerate(task['checklist'], 1):
        print(f"\n{i}. {item['item']}")
        
        # Provide specific guidance for each item
        if 'innerHTML' in item['item']:
            print("   💡 Guidance: Search for 'innerHTML' in your codebase")
            print("   🔧 Fix: Replace with element.textContent or use DOMPurify for sanitization")
            print("   📁 Files to check: *.js, *.jsx, *.ts, *.tsx files")
            
        elif 'eval' in item['item']:
            print("   💡 Guidance: Search for 'eval(' function calls")
            print("   🔧 Fix: Use JSON.parse for JSON data or Function constructor for dynamic code")
            print("   📁 Files to check: JavaScript files")
            
        elif 'credentials' in item['item']:
            print("   💡 Guidance: Search for hardcoded passwords, API keys, secrets")
            print("   🔧 Fix: Move to environment variables or secure configuration files")
            print("   📁 Files to check: Configuration files, API files")
            
        elif 'except' in item['item']:
            print("   💡 Guidance: Search for 'except:' without specific exception types")
            print("   🔧 Fix: Use 'except Exception as e:' or specific exception types")
            print("   📁 Files to check: Python files (*.py)")
            
        elif 'validation' in item['item']:
            print("   💡 Guidance: Add input validation for all user inputs")
            print("   🔧 Fix: Implement validation functions and sanitize inputs")
            print("   📁 Files to check: API endpoints, form handlers")
            
        elif 'testing' in item['item']:
            print("   💡 Guidance: Comprehensive testing for the fixes")
            print("   🔧 Testing: Security penetration testing, unit tests, integration tests")
            print("   📁 Tools: Security scanners, test frameworks")
        
        # Interactive completion
        while True:
            response = input("   ✅ Mark as complete? (y/n/s=skip): ").lower()
            if response == 'y':
                item['status'] = 'completed'
                completed_items += 1
                break
            elif response == 'n':
                item['status'] = 'pending'
                break
            elif response == 's':
                item['status'] = 'skipped'
                break
            else:
                print("   Please enter 'y' for yes, 'n' for no, or 's' for skip")
    
    return completed_items

def save_progress(checklist):
    """Save progress to file"""
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"phase1_progress_{timestamp}.json"
    
    with open(filename, 'w') as f:
        json.dump(checklist, f, indent=2)
    
    return filename

def generate_security_testing_guide():
    """Generate security testing guide"""
    print("\n🧪 SECURITY TESTING GUIDE")
    print("=" * 25)
    print("1. **XSS Testing**:")
    print("   - Test with <script>alert('XSS')</script> payloads")
    print("   - Use automated tools like OWASP ZAP")
    print("   - Test all user input fields")
    print()
    print("2. **Credential Security**:")
    print("   - Scan for hardcoded passwords/API keys")
    print("   - Check environment variable usage")
    print("   - Verify secure storage practices")
    print()
    print("3. **Exception Handling**:")
    print("   - Test with invalid inputs")
    print("   - Verify error messages don't leak sensitive info")
    print("   - Check logging doesn't expose credentials")

def main():
    """Main function to execute Phase 1"""
    print("🚀 EXECUTING PHASE 1: CRITICAL SECURITY & STABILITY FIXES")
    print("=" * 60)
    
    # Load checklist
    checklist = load_checklist()
    phase_1 = checklist['phases']['phase_1']
    
    # Display overview
    display_phase_1_overview()
    
    # Execute tasks
    total_completed = 0
    total_items = 0
    
    for i, task in enumerate(phase_1['tasks'], 1):
        completed = execute_task(task, i)
        total_completed += completed
        total_items += len(task['checklist'])
    
    # Generate testing guide
    generate_security_testing_guide()
    
    # Summary
    print(f"\n📈 PHASE 1 PROGRESS SUMMARY")
    print("=" * 30)
    print(f"Items Completed: {total_completed}/{total_items}")
    print(f"Completion Rate: {(total_completed/total_items)*100:.1f}%")
    
    if total_completed == total_items:
        print("🎉 PHASE 1 COMPLETE!")
        print("Ready to move to Phase 2: High Priority Performance & Reliability")
    else:
        print(f"⚠️ {total_items - total_completed} items remaining")
        print("Continue working on remaining items before proceeding to Phase 2")
    
    # Save progress
    progress_file = save_progress(checklist)
    print(f"\n📄 Progress saved to: {progress_file}")
    
    # Next steps
    print(f"\n🔄 NEXT STEPS:")
    if total_completed == total_items:
        print("1. Run security testing (see guide above)")
        print("2. Validate all fixes work correctly")
        print("3. Prepare for Phase 2 execution")
    else:
        print("1. Complete remaining checklist items")
        print("2. Review and test completed fixes")
        print("3. Return to complete Phase 1 before moving to Phase 2")

if __name__ == "__main__":
    main()