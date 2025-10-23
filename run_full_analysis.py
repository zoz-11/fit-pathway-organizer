#!/usr/bin/env python3
"""
Complete Bug Analysis and Fix Plan Generator
Runs both comprehensive bug hunt and generates fix plan
"""

import subprocess
import sys
import json
import os
from pathlib import Path

def run_comprehensive_bug_hunt():
    """Run the comprehensive bug hunt"""
    print("🕵️ STEP 1: COMPREHENSIVE BUG HUNT")
    print("=" * 40)
    
    try:
        # Run the comprehensive bug hunt
        result = subprocess.run([sys.executable, 'comprehensive_bug_hunt.py'], 
                                capture_output=True, text=True, cwd='.')
        
        if result.returncode != 0:
            print(f"❌ Error running bug hunt: {result.stderr}")
            return False
            
        print(result.stdout)
        return True
        
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def generate_fix_plan():
    """Generate the comprehensive fix plan"""
    print("\n📋 STEP 2: GENERATING FIX PLAN")
    print("=" * 40)
    
    try:
        result = subprocess.run([sys.executable, 'bug_fix_plan_generator.py'], 
                                capture_output=True, text=True, cwd='.')
        
        if result.returncode != 0:
            print(f"❌ Error generating fix plan: {result.stderr}")
            return False
            
        print(result.stdout)
        return True
        
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def display_executive_summary():
    """Display executive summary of findings"""
    print("\n💼 EXECUTIVE SUMMARY")
    print("=" * 30)
    
    try:
        # Load bug report
        with open('detailed_bug_report.json', 'r') as f:
            bug_report = json.load(f)
        
        # Load fix plan
        with open('comprehensive_fix_plan.json', 'r') as f:
            fix_plan = json.load(f)
        
        print(f"📊 TOTAL BUGS FOUND: {bug_report['summary']['total_bugs']}")
        print(f"📈 CRITICAL: {bug_report['summary']['critical_bugs']}")
        print(f"📈 HIGH: {bug_report['summary']['high_bugs']}")
        print(f"📈 MEDIUM: {bug_report['summary']['medium_bugs']}")
        print(f"📈 LOW: {bug_report['summary']['low_bugs']}")
        print(f"📈 INFO: {bug_report['summary']['info_bugs']}")
        
        print(f"\n⏰ TOTAL ESTIMATED TIME: {fix_plan['project_info']['total_estimated_hours']:.1f} hours")
        print(f"📅 PROJECT DURATION: {fix_plan['project_info']['estimated_duration']}")
        print(f"📈 RISK LEVEL: {fix_plan['risk_assessment']['overall_risk_level']}")
        
        print(f"\n📋 TOP CATEGORIES:")
        for category, bugs in list(bug_report['by_category'].items())[:3]:
            print(f"   • {category.upper()}: {len(bugs)} bugs")
        
        print(f"\n📇 FIX PHASES:")
        for phase in fix_plan['phases']:
            phase_hours = sum(task.get('estimated_hours', 0) for task in phase.get('tasks', []))
            print(f"   🔍 Phase {phase['phase']}: {phase['name']} ({phase_hours:.1f}h)")
        
        print(f"\n👥 TEAM SIZE: {fix_plan['recommended_team']['recommended_team_size']}")
        print(f"🔧 IMMEDIATE ACTION: Focus on Phase 1 - Critical Security & Stability")
        
    except FileNotFoundError as e:
        print(f"❌ Could not load reports: {e}")

def main():
    """Main function to run complete analysis"""
    print("🕵️ COMPLETE BUG ANALYSIS & FIX PLAN SYSTEM")
    print("=" * 50)
    
    # Change to script directory
    script_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(script_dir)
    
    # Step 1: Run comprehensive bug hunt
    if not run_comprehensive_bug_hunt():
        print("❌ Bug hunt failed. Exiting.")
        return
    
    # Step 2: Generate fix plan
    if not generate_fix_plan():
        print("❌ Fix plan generation failed. Exiting.")
        return
    
    # Step 3: Display executive summary
    display_executive_summary()
    
    print(f"\n🎉 ANALYSIS COMPLETE!")
    print("=" * 30)
    print("📄 Files generated:")
    print("   • detailed_bug_report.json - Complete bug analysis")
    print("   • comprehensive_fix_plan.json - Detailed fix plan")
    print("📈 Next step: Review the generated files and start with Phase 1")

if __name__ == "__main__":
    main()