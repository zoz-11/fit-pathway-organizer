#!/usr/bin/env python3
"""
Run the comprehensive bug hunt and display results
"""

import subprocess
import sys
import json
import os

def main():
    print("🕵️ COMPREHENSIVE BUG HUNT SYSTEM")
    print("=" * 50)
    
    try:
        # Change to script directory
        script_dir = os.path.dirname(os.path.abspath(__file__))
        os.chdir(script_dir)
        
        # Run the comprehensive bug hunt
        print("📁 Scanning directory for bugs...")
        result = subprocess.run([sys.executable, 'comprehensive_bug_hunt.py'], 
                                capture_output=True, text=True, cwd='.')
        
        if result.returncode != 0:
            print(f"❌ Error running bug hunt: {result.stderr}")
            return
            
        print(result.stdout)
        
        # Try to load and display the detailed report
        try:
            with open('detailed_bug_report.json', 'r') as f:
                report = json.load(f)
                
            print(f"\n📈 DETAILED FINDINGS:")
            print("=" * 30)
            
            # Show bugs by severity
            for severity in ['critical', 'high', 'medium', 'low', 'info']:
                bugs = report['by_severity'].get(severity, [])
                if bugs:
                    print(f"\n🚨 {severity.upper()} SEVERITY ({len(bugs)} bugs):")
                    for bug in bugs[:3]:  # Show top 3 for each severity
                        print(f"  • {bug['title']} - {bug['file_path']}")
                    if len(bugs) > 3:
                        print(f"  ... and {len(bugs) - 3} more")
            
            print(f"\n📋 Total bugs found: {report['summary']['total_bugs']}")
            print(f"⏰ Total estimated fix time: {report['summary']['total_estimated_hours']:.1f} hours")
            print(f"📈 Average complexity: {report['summary']['average_complexity']:.1f}/10")
            
        except FileNotFoundError:
            print("❌ Could not find detailed_bug_report.json")
            
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    main()