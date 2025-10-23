#!/usr/bin/env python3
"""
Execute Complete Bug Analysis and Generate Master Checklist
This runs the comprehensive analysis and creates detailed checklists
"""

import subprocess
import json
import os
import re
from pathlib import Path
from typing import List, Dict, Any

def run_comprehensive_scan() -> List[Dict]:
    """Run comprehensive bug scan across the codebase"""
    print("🕵️ COMPREHENSIVE BUG SCAN")
    print("=" * 30)
    
    bugs_found = []
    
    # Define comprehensive bug patterns
    bug_patterns = [
        # SECURITY ISSUES
        {
            'pattern': r'innerHTML\s*=',
            'title': 'XSS Vulnerability - innerHTML usage',
            'severity': 'critical',
            'category': 'security',
            'description': 'innerHTML can lead to XSS attacks',
            'suggested_fix': 'Use textContent or sanitize with DOMPurify',
            'complexity': 6,
            'time_estimate': 2.0,
            'test_required': True
        },
        {
            'pattern': r'eval\s*\(',
            'title': 'Dangerous eval() usage',
            'severity': 'critical',
            'category': 'security',
            'description': 'eval() can execute arbitrary code',
            'suggested_fix': 'Use safer alternatives like JSON.parse or Function constructor',
            'complexity': 8,
            'time_estimate': 3.0,
            'test_required': True
        },
        {
            'pattern': r'password\s*=\s*[\'"][^\'"]*[\'"]',
            'title': 'Hardcoded credentials',
            'severity': 'critical',
            'category': 'security',
            'description': 'Hardcoded passwords in code',
            'suggested_fix': 'Use environment variables or secure configuration',
            'complexity': 5,
            'time_estimate': 2.0,
            'test_required': True
        },
        {
            'pattern': r'localStorage\.(getItem|setItem)\s*\([^)]*password[^)]*\)',
            'title': 'Sensitive data in localStorage',
            'severity': 'high',
            'category': 'security',
            'description': 'Storing sensitive data in localStorage',
            'suggested_fix': 'Use secure storage or sessionStorage',
            'complexity': 4,
            'time_estimate': 1.5,
            'test_required': True
        },
        
        # PERFORMANCE ISSUES
        {
            'pattern': r'useEffect\s*\(\s*\(\s*\)\s*=>\s*\{[^}]*\}\s*\)',
            'title': 'useEffect without dependency array',
            'severity': 'high',
            'category': 'performance',
            'description': 'useEffect without dependencies runs on every render',
            'suggested_fix': 'Add dependency array: useEffect(() => {...}, [])',
            'complexity': 5,
            'time_estimate': 1.5,
            'test_required': True
        },
        {
            'pattern': r'\.map\s*\([^)]*\s*=>\s*[^}]*\}[^)]*\)',
            'title': 'Missing key prop in map function',
            'severity': 'medium',
            'category': 'performance',
            'description': 'React requires unique key props for list items',
            'suggested_fix': 'Add key prop: key={item.id}',
            'complexity': 2,
            'time_estimate': 0.5,
            'test_required': False
        },
        {
            'pattern': r'onClick\s*=\s*\{[^}]*\}',
            'title': 'Inline function in render',
            'severity': 'medium',
            'category': 'performance',
            'description': 'Inline functions create new instances on each render',
            'suggested_fix': 'Use useCallback or define function outside render',
            'complexity': 3,
            'time_estimate': 1.0,
            'test_required': False
        },
        
        # RELIABILITY ISSUES
        {
            'pattern': r'except\s*:',
            'title': 'Bare except clause in Python',
            'severity': 'high',
            'category': 'reliability',
            'description': 'Bare except catches all exceptions including system exceptions',
            'suggested_fix': 'Use except Exception: to catch only non-system exceptions',
            'complexity': 3,
            'time_estimate': 1.0,
            'test_required': True
        },
        {
            'pattern': r'try\s*:\s*[^e]*except\s*:',
            'title': 'Missing specific exception handling',
            'severity': 'medium',
            'category': 'reliability',
            'description': 'Generic exception handling without specific error types',
            'suggested_fix': 'Catch specific exceptions and handle appropriately',
            'complexity': 4,
            'time_estimate': 1.5,
            'test_required': True
        },
        {
            'pattern': r'console\.(log|warn|error|info)',
            'title': 'Console statements in production code',
            'severity': 'low',
            'category': 'maintainability',
            'description': 'Console statements should be removed from production',
            'suggested_fix': 'Remove console statements or use proper logging',
            'complexity': 1,
            'time_estimate': 0.2,
            'test_required': False
        },
        
        # ACCESSIBILITY ISSUES
        {
            'pattern': r'<img[^>]*>',
            'title': 'Missing alt attribute on images',
            'severity': 'medium',
            'category': 'accessibility',
            'description': 'Images must have alt attributes for screen readers',
            'suggested_fix': 'Add alt="Description of image"',
            'complexity': 1,
            'time_estimate': 0.2,
            'test_required': False
        },
        {
            'pattern': r'<button[^>]*>',
            'title': 'Button without accessible name',
            'severity': 'medium',
            'category': 'accessibility',
            'description': 'Buttons need accessible names for screen readers',
            'suggested_fix': 'Add aria-label or inner text content',
            'complexity': 2,
            'time_estimate': 0.5,
            'test_required': False
        },
        {
            'pattern': r'<input[^>]*>',
            'title': 'Input without label',
            'severity': 'medium',
            'category': 'accessibility',
            'description': 'Form inputs need associated labels',
            'suggested_fix': 'Add label element or aria-label attribute',
            'complexity': 2,
            'time_estimate': 0.5,
            'test_required': False
        },
        
        # CODE QUALITY ISSUES
        {
            'pattern': r'TODO|FIXME|HACK|XXX',
            'title': 'TODO/FIXME comments in code',
            'severity': 'low',
            'category': 'maintainability',
            'description': 'Unresolved TODO items indicate incomplete features',
            'suggested_fix': 'Complete the TODO items or remove if unnecessary',
            'complexity': 2,
            'time_estimate': 0.5,
            'test_required': False
        },
        {
            'pattern': r'var\s+\w+\s*=',
            'title': 'Use of var instead of let/const',
            'severity': 'low',
            'category': 'maintainability',
            'description': 'var has function scope and can lead to bugs',
            'suggested_fix': 'Use let for mutable variables, const for immutable',
            'complexity': 2,
            'time_estimate': 0.5,
            'test_required': False
        },
        {
            'pattern': r'==\s*[^=]',
            'title': 'Use of == instead of ===',
            'severity': 'low',
            'category': 'maintainability',
            'description': '== performs type coercion which can lead to unexpected results',
            'suggested_fix': 'Use === for strict equality comparison',
            'complexity': 1,
            'time_estimate': 0.2,
            'test_required': False
        }
    ]
    
    # Scan files
    for root, dirs, files in os.walk('.'):
        dirs[:] = [d for d in dirs if d not in {'.git', 'node_modules', '__pycache__', '.next', 'dist', 'build', '.vscode', '.idea', '__pycache__', '.pytest_cache', '.mypy_cache'}]
        
        for file in files:
            if file.startswith('.') or not file.endswith(('.js', '.jsx', '.ts', '.tsx', '.py', '.json', '.md', '.html', '.css', '.scss', '.vue')):
                continue
                
            file_path = Path(root) / file
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                    lines = content.split('\n')
                    
                for bug_pattern in bug_patterns:
                    matches = re.finditer(bug_pattern['pattern'], content, re.IGNORECASE)
                    for match in matches:
                        # Find line number
                        line_num = 0
                        char_count = 0
                        for i, line in enumerate(lines, 1):
                            if char_count + len(line) >= match.start():
                                line_num = i
                                break
                            char_count += len(line) + 1
                            
                        bugs_found.append({
                            'file_path': str(file_path),
                            'line_number': line_num,
                            'severity': bug_pattern['severity'],
                            'category': bug_pattern['category'],
                            'title': bug_pattern['title'],
                            'description': bug_pattern['description'],
                            'code_snippet': lines[line_num-1].strip() if line_num <= len(lines) else '',
                            'suggested_fix': bug_pattern['suggested_fix'],
                            'complexity': bug_pattern['complexity'],
                            'estimated_hours': bug_pattern['time_estimate'],
                            'test_required': bug_pattern['test_required'],
                            'status': 'pending'
                        })
                        
            except (UnicodeDecodeError, PermissionError):
                continue
    
    return bugs_found

def categorize_bugs(bugs: List[Dict]) -> Dict[str, List[Dict]]:
    """Categorize bugs by severity and type"""
    categories = {
        'critical': [],
        'high': [],
        'medium': [],
        'low': [],
        'info': []
    }
    
    for bug in bugs:
        severity = bug['severity']
        if severity in categories:
            categories[severity].append(bug)
    
    return categories

def create_master_checklist(bugs: List[Dict]) -> Dict[str, Any]:
    """Create a comprehensive master checklist for all phases"""
    
    categorized_bugs = categorize_bugs(bugs)
    
    # Group bugs by category for each phase
    critical_security = [b for b in categorized_bugs['critical'] if b['category'] == 'security']
    critical_reliability = [b for b in categorized_bugs['critical'] if b['category'] == 'reliability']
    high_performance = [b for b in categorized_bugs['high'] if b['category'] == 'performance']
    high_reliability = [b for b in categorized_bugs['high'] if b['category'] == 'reliability']
    medium_accessibility = [b for b in categorized_bugs['medium'] if b['category'] == 'accessibility']
    medium_maintainability = [b for b in categorized_bugs['medium'] if b['category'] == 'maintainability']
    low_issues = categorized_bugs['low']
    
    master_checklist = {
        'project_overview': {
            'total_bugs': len(bugs),
            'critical_bugs': len(categorized_bugs['critical']),
            'high_bugs': len(categorized_bugs['high']),
            'medium_bugs': len(categorized_bugs['medium']),
            'low_bugs': len(categorized_bugs['low']),
            'total_estimated_hours': sum(b['estimated_hours'] for b in bugs),
            'overall_risk': 'HIGH' if categorized_bugs['critical'] else 'MEDIUM'
        },
        'phases': {
            'phase_1': {
                'name': 'Critical Security & Stability Fixes',
                'duration': '1-2 weeks',
                'priority': 'CRITICAL',
                'team_size': '2-3 developers',
                'testing_focus': 'Security testing',
                'tasks': [
                    {
                        'id': 'P1-T1',
                        'title': 'Fix Critical Security Vulnerabilities',
                        'description': 'Address all critical security issues',
                        'bugs_affected': len(critical_security),
                        'estimated_hours': sum(b['estimated_hours'] for b in critical_security),
                        'checklist': [
                            {'item': 'Identify all innerHTML usage', 'status': 'pending', 'bugs': [b for b in critical_security if 'innerHTML' in b['title']]},
                            {'item': 'Replace innerHTML with textContent/DOMPurify', 'status': 'pending', 'bugs': [b for b in critical_security if 'innerHTML' in b['title']]},
                            {'item': 'Remove eval() usage', 'status': 'pending', 'bugs': [b for b in critical_security if 'eval' in b['title']]},
                            {'item': 'Secure hardcoded credentials', 'status': 'pending', 'bugs': [b for b in critical_security if 'credentials' in b['title']]},
                            {'item': 'Fix localStorage security issues', 'status': 'pending', 'bugs': [b for b in critical_security if 'localStorage' in b['title']]},
                            {'item': 'Security testing and validation', 'status': 'pending', 'bugs': []}
                        ]
                    },
                    {
                        'id': 'P1-T2',
                        'title': 'Fix System Stability Issues',
                        'description': 'Address system stability and exception handling',
                        'bugs_affected': len(critical_reliability),
                        'estimated_hours': sum(b['estimated_hours'] for b in critical_reliability),
                        'checklist': [
                            {'item': 'Fix bare except clauses', 'status': 'pending', 'bugs': [b for b in critical_reliability if 'except' in b['title']]},
                            {'item': 'Implement proper exception handling', 'status': 'pending', 'bugs': [b for b in critical_reliability if 'exception' in b['title']]},
                            {'item': 'Add data validation', 'status': 'pending', 'bugs': [b for b in critical_reliability if 'validation' in b['title']]},
                            {'item': 'Stability testing', 'status': 'pending', 'bugs': []}
                        ]
                    }
                ]
            },
            'phase_2': {
                'name': 'High Priority Performance & Reliability',
                'duration': '2-3 weeks',
                'priority': 'HIGH',
                'team_size': '3-4 developers',
                'testing_focus': 'Performance testing',
                'tasks': [
                    {
                        'id': 'P2-T1',
                        'title': 'Optimize React Performance',
                        'description': 'Fix performance issues affecting user experience',
                        'bugs_affected': len(high_performance),
                        'estimated_hours': sum(b['estimated_hours'] for b in high_performance),
                        'checklist': [
                            {'item': 'Fix useEffect dependency issues', 'status': 'pending', 'bugs': [b for b in high_performance if 'useEffect' in b['title']]},
                            {'item': 'Add missing key props', 'status': 'pending', 'bugs': [b for b in high_performance if 'key prop' in b['title']]},
                            {'item': 'Remove inline functions', 'status': 'pending', 'bugs': [b for b in high_performance if 'inline function' in b['title']]},
                            {'item': 'Performance testing', 'status': 'pending', 'bugs': []}
                        ]
                    },
                    {
                        'id': 'P2-T2',
                        'title': 'Improve Error Handling',
                        'description': 'Implement comprehensive error handling',
                        'bugs_affected': len(high_reliability),
                        'estimated_hours': sum(b['estimated_hours'] for b in high_reliability),
                        'checklist': [
                            {'item': 'Implement error boundaries', 'status': 'pending', 'bugs': [b for b in high_reliability if 'error' in b['title']]},
                            {'item': 'Add error logging', 'status': 'pending', 'bugs': [b for b in high_reliability if 'error' in b['title']]},
                            {'item': 'Error handling testing', 'status': 'pending', 'bugs': []}
                        ]
                    }
                ]
            },
            'phase_3': {
                'name': 'Medium Priority Quality Improvements',
                'duration': '3-4 weeks',
                'priority': 'MEDIUM',
                'team_size': '4-5 developers',
                'testing_focus': 'Quality testing',
                'tasks': [
                    {
                        'id': 'P3-T1',
                        'title': 'Improve Accessibility',
                        'description': 'Fix accessibility issues for better user experience',
                        'bugs_affected': len(medium_accessibility),
                        'estimated_hours': sum(b['estimated_hours'] for b in medium_accessibility),
                        'checklist': [
                            {'item': 'Add alt attributes to images', 'status': 'pending', 'bugs': [b for b in medium_accessibility if 'alt' in b['title']]},
                            {'item': 'Fix button accessibility', 'status': 'pending', 'bugs': [b for b in medium_accessibility if 'button' in b['title']]},
                            {'item': 'Fix input label associations', 'status': 'pending', 'bugs': [b for b in medium_accessibility if 'input' in b['title']]},
                            {'item': 'Accessibility testing', 'status': 'pending', 'bugs': []}
                        ]
                    },
                    {
                        'id': 'P3-T2',
                        'title': 'Improve Code Maintainability',
                        'description': 'Fix maintainability issues',
                        'bugs_affected': len(medium_maintainability),
                        'estimated_hours': sum(b['estimated_hours'] for b in medium_maintainability),
                        'checklist': [
                            {'item': 'Remove console statements', 'status': 'pending', 'bugs': [b for b in medium_maintainability if 'console' in b['title']]},
                            {'item': 'Fix code style issues', 'status': 'pending', 'bugs': [b for b in medium_maintainability if 'var' in b['title'] or '==' in b['title']]},
                            {'item': 'Code quality review', 'status': 'pending', 'bugs': []}
                        ]
                    }
                ]
            },
            'phase_4': {
                'name': 'Low Priority Polish & Optimization',
                'duration': '2-3 weeks',
                'priority': 'LOW',
                'team_size': '2-3 developers',
                'testing_focus': 'UI/UX testing',
                'tasks': [
                    {
                        'id': 'P4-T1',
                        'title': 'Polish User Interface',
                        'description': 'Fix low priority UI/UX issues',
                        'bugs_affected': len(low_issues),
                        'estimated_hours': sum(b['estimated_hours'] for b in low_issues),
                        'checklist': [
                            {'item': 'Complete TODO items', 'status': 'pending', 'bugs': [b for b in low_issues if 'TODO' in b['title']]},
                            {'item': 'Fix minor UI issues', 'status': 'pending', 'bugs': [b for b in low_issues if 'UI' in b['title']]},
                            {'item': 'UI polish testing', 'status': 'pending', 'bugs': []}
                        ]
                    }
                ]
            },
            'phase_5': {
                'name': 'Documentation & Process Improvements',
                'duration': '1-2 weeks',
                'priority': 'INFO',
                'team_size': '1-2 developers',
                'testing_focus': 'Documentation review',
                'tasks': [
                    {
                        'id': 'P5-T1',
                        'title': 'Complete Documentation',
                        'description': 'Update documentation and establish processes',
                        'bugs_affected': 0,
                        'estimated_hours': 8.0,
                        'checklist': [
                            {'item': 'Update project documentation', 'status': 'pending', 'bugs': []},
                            {'item': 'Implement code quality tools', 'status': 'pending', 'bugs': []},
                            {'item': 'Establish development processes', 'status': 'pending', 'bugs': []},
                            {'item': 'Final review and sign-off', 'status': 'pending', 'bugs': []}
                        ]
                    }
                ]
            }
        },
        'immediate_actions': [
            'Start Phase 1: Critical Security & Stability fixes',
            'Assemble team with security and performance expertise',
            'Set up comprehensive testing environment',
            'Establish monitoring and tracking systems'
        ]
    }
    
    return master_checklist

def main():
    """Main function to execute complete analysis"""
    print("🕵️ COMPLETE BUG ANALYSIS & MASTER CHECKLIST GENERATOR")
    print("=" * 60)
    
    # Change to script directory
    script_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(script_dir)
    
    # Step 1: Run comprehensive scan
    print("\n🔍 STEP 1: COMPREHENSIVE BUG SCAN")
    print("-" * 35)
    bugs = run_comprehensive_scan()
    
    # Also scan for specific files in the workspace
    print("\n🔍 SCANNING WORKSPACE FILES...")
    workspace_files = []
    for root, dirs, files in os.walk('.'):
        dirs[:] = [d for d in dirs if d not in {'.git', 'node_modules', '__pycache__', '.next', 'dist', 'build', '.vscode', '.idea'}]
        for file in files:
            if file.endswith(('.js', '.jsx', '.ts', '.tsx', '.py', '.html', '.css')):
                workspace_files.append(os.path.join(root, file))
    
    print(f"Found {len(workspace_files)} code files to analyze")
    
    # Show sample of what we're scanning
    if workspace_files:
        print("Sample files being scanned:")
        for f in workspace_files[:5]:
            print(f"  • {f}")
        if len(workspace_files) > 5:
            print(f"  ... and {len(workspace_files) - 5} more files")
    
    if not bugs:
        print("✅ No bugs found!")
        return
    
    # Step 2: Create master checklist
    print(f"\n📋 STEP 2: CREATING MASTER CHECKLIST")
    print("-" * 40)
    master_checklist = create_master_checklist(bugs)
    
    # Save the master checklist
    with open('master_checklist.json', 'w') as f:
        json.dump(master_checklist, f, indent=2)
    
    # Display summary
    print(f"\n📈 EXECUTIVE SUMMARY")
    print("=" * 25)
    print(f"📊 Total Bugs Found: {master_checklist['project_overview']['total_bugs']}")
    print(f"🔴 Critical: {master_checklist['project_overview']['critical_bugs']}")
    print(f"🟡 High: {master_checklist['project_overview']['high_bugs']}")
    print(f"🟠 Medium: {master_checklist['project_overview']['medium_bugs']}")
    print(f"🟢 Low: {master_checklist['project_overview']['low_bugs']}")
    
    print(f"\n⏰ TOTAL ESTIMATED TIME: {master_checklist['project_overview']['total_estimated_hours']:.1f} hours")
    print(f"📈 RISK LEVEL: {master_checklist['project_overview']['overall_risk']}")
    
    # Show phase breakdown
    print(f"\n📇 PHASE BREAKDOWN:")
    for phase_name, phase_data in master_checklist['phases'].items():
        total_hours = sum(task.get('estimated_hours', 0) for task in phase_data.get('tasks', []))
        print(f"   🔍 {phase_data['name']} ({total_hours:.1f}h)")
    
    print(f"\n🎉 ANALYSIS COMPLETE!")
    print("=" * 20)
    print("📄 Files generated:")
    print("   • master_checklist.json - Complete checklist with all phases")
    print("   • master_checklist.md - Human-readable checklist")
    print("\n🔧 Ready to start Phase 1 - Critical Security & Stability Fixes!")
    
    # Create human-readable checklist
    create_human_readable_checklist(master_checklist)

def create_human_readable_checklist(master_checklist: Dict):
    """Create a human-readable markdown checklist"""
    with open('MASTER_CHECKLIST.md', 'w') as f:
        f.write("# 🕵️ MASTER BUG FIX CHECKLIST\n\n")
        f.write("## 📈 Project Overview\n\n")
        f.write(f"- **Total Bugs**: {master_checklist['project_overview']['total_bugs']}\n")
        f.write(f"- **Critical**: {master_checklist['project_overview']['critical_bugs']}\n")
        f.write(f"- **High**: {master_checklist['project_overview']['high_bugs']}\n")
        f.write(f"- **Medium**: {master_checklist['project_overview']['medium_bugs']}\n")
        f.write(f"- **Low**: {master_checklist['project_overview']['low_bugs']}\n")
        f.write(f"- **Total Time**: {master_checklist['project_overview']['total_estimated_hours']:.1f} hours\n")
        f.write(f"- **Risk Level**: {master_checklist['project_overview']['overall_risk']}\n\n")
        
        for phase_name, phase_data in master_checklist['phases'].items():
            f.write(f"## 🔍 {phase_data['name']}\n\n")
            f.write(f"**Duration**: {phase_data['duration']}\n")
            f.write(f"**Priority**: {phase_data['priority']}\n")
            f.write(f"**Team Size**: {phase_data['team_size']}\n")
            f.write(f"**Testing Focus**: {phase_data['testing_focus']}\n\n")
            
            for task in phase_data['tasks']:
                f.write(f"### 📋 {task['title']}\n\n")
                f.write(f"**Description**: {task['description']}\n")
                f.write(f"**Bugs Affected**: {task['bugs_affected']}\n")
                f.write(f"**Estimated Hours**: {task['estimated_hours']}\n\n")
                
                f.write("**Checklist**:\n")
                for item in task['checklist']:
                    f.write(f"- [ ] {item['item']}\n")
                f.write("\n")
            
            f.write("---\n\n")
        
        f.write("## ✅ IMMEDIATE ACTIONS\n\n")
        for action in master_checklist['immediate_actions']:
            f.write(f"- [ ] {action}\n")

if __name__ == "__main__":
    main()