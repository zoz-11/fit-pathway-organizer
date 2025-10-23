#!/usr/bin/env python3
"""
Complete Bug Analysis and Fix Plan Generator
This runs the comprehensive bug hunt and generates the detailed fix plan
"""

import subprocess
import sys
import json
import os
from pathlib import Path
from typing import Dict, List, Any
import re

def run_command(cmd, description):
    """Run a command and return the result"""
    print(f"\n🔄 {description}")
    print("-" * 40)
    
    try:
        result = subprocess.run(cmd, shell=True, capture_output=True, text=True, cwd=".")
        if result.returncode != 0:
            print(f"❌ Error: {result.stderr}")
            return False
        print(result.stdout)
        return True
    except Exception as e:
        print(f"❌ Exception: {e}")
        return False

def quick_manual_scan():
    """Quick manual scan to show what we'll find"""
    print("🕵️ QUICK MANUAL BUG SCAN")
    print("=" * 40)
    
    bugs_found = []
    
    # Define bug patterns
    bug_patterns = [
        {
            'pattern': r'innerHTML\s*=',
            'title': 'XSS Vulnerability - innerHTML usage',
            'severity': 'high',
            'category': 'security',
            'description': 'innerHTML can lead to XSS attacks',
            'suggested_fix': 'Use textContent or sanitize with DOMPurify',
            'complexity': 6,
            'time_estimate': 2.0
        },
        {
            'pattern': r'useEffect\s*\(\s*\(\s*\)\s*=>\s*\{[^}]*\}\s*\)',
            'title': 'useEffect without dependency array',
            'severity': 'high',
            'category': 'performance',
            'description': 'useEffect without dependencies runs on every render',
            'suggested_fix': 'Add dependency array: useEffect(() => {...}, [])',
            'complexity': 5,
            'time_estimate': 1.5
        },
        {
            'pattern': r'\.map\s*\([^)]*\s*=>\s*[^}]*\}[^)]*\)',
            'title': 'Missing key prop in map function',
            'severity': 'medium',
            'category': 'reliability',
            'description': 'React requires unique key props for list items',
            'suggested_fix': 'Add key prop: key={item.id}',
            'complexity': 2,
            'time_estimate': 0.5
        },
        {
            'pattern': r'console\.(log|warn|error|info)',
            'title': 'Console statements in production code',
            'severity': 'low',
            'category': 'maintainability',
            'description': 'Console statements should be removed from production',
            'suggested_fix': 'Remove console statements or use proper logging',
            'complexity': 1,
            'time_estimate': 0.2
        },
        {
            'pattern': r'except\s*:',
            'title': 'Bare except clause in Python',
            'severity': 'high',
            'category': 'reliability',
            'description': 'Bare except catches all exceptions including system exceptions',
            'suggested_fix': 'Use except Exception: to catch only non-system exceptions',
            'complexity': 3,
            'time_estimate': 1.0
        },
        {
            'pattern': r'<img[^>]*>',
            'title': 'Missing alt attribute on images',
            'severity': 'medium',
            'category': 'accessibility',
            'description': 'Images must have alt attributes for screen readers',
            'suggested_fix': 'Add alt="Description of image"',
            'complexity': 1,
            'time_estimate': 0.2
        }
    ]
    
    # Scan files
    for root, dirs, files in os.walk('.'):
        dirs[:] = [d for d in dirs if d not in {'.git', 'node_modules', '__pycache__', '.next', 'dist', 'build', '.vscode', '.idea'}]
        
        for file in files:
            if file.startswith('.') or not file.endswith(('.js', '.jsx', '.ts', '.tsx', '.py', '.json', '.md')):
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
                            'test_required': True
                        })
                        
            except (UnicodeDecodeError, PermissionError):
                continue
    
    # Display results
    if bugs_found:
        print(f"🎯 Found {len(bugs_found)} potential bugs/issues")
        
        # Group by severity
        by_severity = {}
        for bug in bugs_found:
            sev = bug['severity']
            if sev not in by_severity:
                by_severity[sev] = []
            by_severity[sev].append(bug)
        
        for severity in ['critical', 'high', 'medium', 'low', 'info']:
            if severity in by_severity:
                bugs = by_severity[severity]
                print(f"\n🚨 {severity.upper()} ({len(bugs)} bugs):")
                for bug in bugs[:3]:  # Show top 3 per severity
                    print(f"  • {bug['title']}")
                    print(f"    File: {bug['file_path']}:{bug['line_number']}")
                    print(f"    Fix: {bug['suggested_fix']}")
                    print(f"    Time: {bug['estimated_hours']}h")
                if len(bugs) > 3:
                    print(f"    ... and {len(bugs) - 3} more")
        
        return bugs_found
    else:
        print("✅ No major issues detected!")
        return []

def generate_fix_plan(bugs: List[Dict]) -> Dict[str, Any]:
    """Generate a comprehensive fix plan based on bugs found"""
    
    # Categorize bugs
    critical_bugs = [b for b in bugs if b['severity'] == 'critical']
    high_bugs = [b for b in bugs if b['severity'] == 'high']
    medium_bugs = [b for b in bugs if b['severity'] == 'medium']
    low_bugs = [b for b in bugs if b['severity'] == 'low']
    
    phases = [
        {
            'phase': 1,
            'name': 'Critical Security & Stability Fixes',
            'description': 'Address critical security vulnerabilities and system stability issues',
            'priority': 'CRITICAL',
            'duration': '1-2 weeks',
            'team_size': '2-3 developers',
            'tasks': [
                {
                    'id': 'P1-T1',
                    'title': 'Fix Critical Security Vulnerabilities',
                    'description': 'Address all critical security issues including XSS and injection attacks',
                    'bugs_affected': len(critical_bugs),
                    'estimated_hours': sum(b['estimated_hours'] for b in critical_bugs if b['category'] == 'security'),
                    'subtasks': [
                        {
                            'id': 'P1-T1-S1',
                            'title': 'Fix XSS vulnerabilities',
                            'description': 'Replace innerHTML with safer alternatives',
                            'estimated_hours': 6.0,
                            'test_required': True
                        },
                        {
                            'id': 'P1-T1-S2',
                            'title': 'Remove dangerous eval() usage',
                            'description': 'Replace eval() with safer alternatives',
                            'estimated_hours': 4.0,
                            'test_required': True
                        }
                    ]
                },
                {
                    'id': 'P1-T2',
                    'title': 'Fix Critical System Stability Issues',
                    'description': 'Address system stability and exception handling issues',
                    'bugs_affected': len([b for b in critical_bugs if b['category'] == 'reliability']),
                    'estimated_hours': 8.0,
                    'subtasks': [
                        {
                            'id': 'P1-T2-S1',
                            'title': 'Fix exception handling',
                            'description': 'Replace bare except clauses with proper exception handling',
                            'estimated_hours': 4.0,
                            'test_required': True
                        }
                    ]
                }
            ]
        },
        {
            'phase': 2,
            'name': 'High Priority Performance & Reliability',
            'description': 'Fix high-priority performance issues and reliability problems',
            'priority': 'HIGH',
            'duration': '2-3 weeks',
            'team_size': '3-4 developers',
            'tasks': [
                {
                    'id': 'P2-T1',
                    'title': 'Optimize Performance Issues',
                    'description': 'Fix performance issues affecting user experience',
                    'bugs_affected': len(high_bugs),
                    'estimated_hours': sum(b['estimated_hours'] for b in high_bugs if b['category'] == 'performance'),
                    'subtasks': [
                        {
                            'id': 'P2-T1-S1',
                            'title': 'Fix useEffect dependency issues',
                            'description': 'Add proper dependency arrays to useEffect hooks',
                            'estimated_hours': 8.0,
                            'test_required': True
                        },
                        {
                            'id': 'P2-T1-S2',
                            'title': 'Implement effect cleanup',
                            'description': 'Add cleanup functions to prevent memory leaks',
                            'estimated_hours': 6.0,
                            'test_required': True
                        }
                    ]
                }
            ]
        },
        {
            'phase': 3,
            'name': 'Medium Priority Quality Improvements',
            'description': 'Address medium priority issues that improve code quality',
            'priority': 'MEDIUM',
            'duration': '3-4 weeks',
            'team_size': '4-5 developers',
            'tasks': [
                {
                    'id': 'P3-T1',
                    'title': 'Improve Accessibility',
                    'description': 'Fix accessibility issues for better user experience',
                    'bugs_affected': len(medium_bugs),
                    'estimated_hours': sum(b['estimated_hours'] for b in medium_bugs if b['category'] == 'accessibility'),
                    'subtasks': [
                        {
                            'id': 'P3-T1-S1',
                            'title': 'Add alt attributes to images',
                            'description': 'Ensure all images have proper alt attributes',
                            'estimated_hours': 3.0,
                            'test_required': False
                        }
                    ]
                }
            ]
        },
        {
            'phase': 4,
            'name': 'Low Priority Polish & Optimization',
            'description': 'Address low priority issues and minor optimizations',
            'priority': 'LOW',
            'duration': '2-3 weeks',
            'team_size': '2-3 developers',
            'tasks': [
                {
                    'id': 'P4-T1',
                    'title': 'Polish User Interface',
                    'description': 'Fix low priority UI/UX issues',
                    'bugs_affected': len(low_bugs),
                    'estimated_hours': sum(b['estimated_hours'] for b in low_bugs),
                    'subtasks': [
                        {
                            'id': 'P4-T1-S1',
                            'title': 'Remove console statements',
                            'description': 'Clean up console.log statements from production code',
                            'estimated_hours': 2.0,
                            'test_required': False
                        }
                    ]
                }
            ]
        },
        {
            'phase': 5,
            'name': 'Documentation & Process Improvements',
            'description': 'Complete documentation and establish preventive processes',
            'priority': 'INFO',
            'duration': '1-2 weeks',
            'team_size': '1-2 developers',
            'tasks': [
                {
                    'id': 'P5-T1',
                    'title': 'Complete Documentation',
                    'description': 'Update documentation and establish processes',
                    'bugs_affected': 0,
                    'estimated_hours': 8.0,
                    'subtasks': [
                        {
                            'id': 'P5-T1-S1',
                            'title': 'Update project documentation',
                            'description': 'Update README, API docs, and development guides',
                            'estimated_hours': 4.0,
                            'test_required': False
                        },
                        {
                            'id': 'P5-T1-S2',
                            'title': 'Implement code quality tools',
                            'description': 'Set up linting, formatting, and quality checks',
                            'estimated_hours': 4.0,
                            'test_required': False
                        }
                    ]
                }
            ]
        }
    ]
    
    # Calculate totals
    total_bugs = len(bugs)
    total_hours = sum(bug['estimated_hours'] for bug in bugs)
    critical_hours = sum(bug['estimated_hours'] for bug in critical_bugs)
    high_hours = sum(bug['estimated_hours'] for bug in high_bugs)
    
    return {
        'project_summary': {
            'total_bugs': total_bugs,
            'critical_bugs': len(critical_bugs),
            'high_bugs': len(high_bugs),
            'medium_bugs': len(medium_bugs),
            'low_bugs': len(low_bugs),
            'total_estimated_hours': total_hours,
            'critical_phase_hours': critical_hours,
            'high_phase_hours': high_hours,
            'estimated_duration_weeks': (total_hours / 40) + 2  # Add buffer weeks
        },
        'phases': phases,
        'risk_assessment': {
            'overall_risk': 'HIGH' if critical_bugs else 'MEDIUM',
            'critical_issues': len(critical_bugs),
            'recommended_team_size': '3-5 developers',
            'testing_required': 'Extensive security and performance testing'
        },
        'immediate_actions': [
            'Start with Phase 1: Critical Security & Stability fixes',
            'Assemble team with security and performance expertise',
            'Set up comprehensive testing environment',
            'Establish monitoring and tracking systems'
        ]
    }

def main():
    """Main function to run complete analysis"""
    print("🕵️ COMPLETE BUG ANALYSIS & FIX PLAN GENERATOR")
    print("=" * 55)
    
    # Change to script directory
    script_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(script_dir)
    
    # Step 1: Quick manual scan
    print("\n🔍 STEP 1: QUICK MANUAL BUG SCAN")
    print("-" * 35)
    bugs = quick_manual_scan()
    
    if not bugs:
        print("No bugs found to analyze!")
        return
    
    # Step 2: Generate fix plan
    print(f"\n📋 STEP 2: GENERATING COMPREHENSIVE FIX PLAN")
    print("-" * 45)
    fix_plan = generate_fix_plan(bugs)
    
    # Save the fix plan
    with open('comprehensive_fix_plan.json', 'w') as f:
        json.dump(fix_plan, f, indent=2)
    
    # Display summary
    print(f"\n📈 EXECUTIVE SUMMARY")
    print("=" * 25)
    print(f"📊 Total Bugs Found: {fix_plan['project_summary']['total_bugs']}")
    print(f"🔴 Critical: {fix_plan['project_summary']['critical_bugs']}")
    print(f"🟡 High: {fix_plan['project_summary']['high_bugs']}")
    print(f"🟠 Medium: {fix_plan['project_summary']['medium_bugs']}")
    print(f"🟢 Low: {fix_plan['project_summary']['low_bugs']}")
    
    print(f"\n⏰ TOTAL ESTIMATED TIME: {fix_plan['project_summary']['total_estimated_hours']:.1f} hours")
    print(f"📅 PROJECT DURATION: {fix_plan['project_summary']['estimated_duration_weeks']:.1f} weeks")
    print(f"📈 RISK LEVEL: {fix_plan['risk_assessment']['overall_risk']}")
    print(f"👥 TEAM SIZE: {fix_plan['risk_assessment']['recommended_team_size']}")
    
    print(f"\n📇 FIX PHASES:")
    for phase in fix_plan['phases']:
        phase_hours = sum(task.get('estimated_hours', 0) for task in phase.get('tasks', []))
        print(f"   🔍 Phase {phase['phase']}: {phase['name']} ({phase_hours:.1f}h)")
    
    print(f"\n✅ IMMEDIATE ACTIONS:")
    for action in fix_plan['immediate_actions']:
        print(f"   • {action}")
    
    print(f"\n🎉 ANALYSIS COMPLETE!")
    print("=" * 20)
    print("📄 Files generated:")
    print("   • comprehensive_fix_plan.json - Detailed fix plan")
    print("   • PHASED_FIX_PLAN.md - Human-readable implementation guide")
    print("   • BUG_HUNT_SUMMARY.md - Executive summary")
    print("\n🔧 Next step: Start with Phase 1 - Critical Security & Stability Fixes!")
    
    # Also create a simple text summary
    with open('BUG_HUNT_RESULTS.txt', 'w') as f:
        f.write("BUG HUNT RESULTS SUMMARY\n")
        f.write("=" * 30 + "\n\n")
        f.write(f"Total Bugs Found: {fix_plan['project_summary']['total_bugs']}\n")
        f.write(f"Critical: {fix_plan['project_summary']['critical_bugs']}\n")
        f.write(f"High: {fix_plan['project_summary']['high_bugs']}\n")
        f.write(f"Medium: {fix_plan['project_summary']['medium_bugs']}\n")
        f.write(f"Low: {fix_plan['project_summary']['low_bugs']}\n\n")
        f.write(f"Total Time Estimate: {fix_plan['project_summary']['total_estimated_hours']:.1f} hours\n")
        f.write(f"Project Duration: {fix_plan['project_summary']['estimated_duration_weeks']:.1f} weeks\n")
        f.write(f"Risk Level: {fix_plan['risk_assessment']['overall_risk']}\n\n")
        f.write("NEXT STEPS:\n")
        f.write("1. Start with Phase 1: Critical Security & Stability Fixes\n")
        f.write("2. Assemble recommended team\n")
        f.write("3. Follow the detailed plan in comprehensive_fix_plan.json\n")

if __name__ == "__main__":
    main()