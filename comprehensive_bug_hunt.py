#!/usr/bin/env python3
"""
Comprehensive Bug Hunt System
Analyzes the entire codebase for potential bugs, security issues, and improvements
"""

import os
import re
import json
import sys
from pathlib import Path
from typing import List, Dict, Any, Tuple
from dataclasses import dataclass
from enum import Enum

class BugSeverity(Enum):
    CRITICAL = "critical"
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"
    INFO = "info"

class BugCategory(Enum):
    SECURITY = "security"
    PERFORMANCE = "performance"
    RELIABILITY = "reliability"
    MAINTAINABILITY = "maintainability"
    ACCESSIBILITY = "accessibility"
    TESTING = "testing"
    COMPATIBILITY = "compatibility"

@dataclass
class BugReport:
    file_path: str
    line_number: int
    severity: BugSeverity
    category: BugCategory
    title: str
    description: str
    code_snippet: str
    suggested_fix: str
    complexity: int  # 1-10, higher is more complex
    estimated_hours: float
    dependencies: List[str]
    test_required: bool

class BugHunter:
    def __init__(self, root_path: str = "."):
        self.root_path = Path(root_path)
        self.bugs: List[BugReport] = []
        self.file_patterns = {
            'javascript': ['*.js', '*.jsx', '*.ts', '*.tsx'],
            'python': ['*.py'],
            'config': ['*.json', '*.yaml', '*.yml', '*.toml'],
            'shell': ['*.sh', '*.bash'],
            'css': ['*.css', '*.scss', '*.sass'],
            'markdown': ['*.md'],
            'docker': ['Dockerfile', 'docker-compose*.yml'],
            'git': ['.gitignore', '.gitattributes']
        }
        
    def analyze_file(self, file_path: Path) -> List[BugReport]:
        """Analyze a single file for bugs"""
        bugs = []
        
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
                lines = content.split('\n')
        except (UnicodeDecodeError, PermissionError):
            return bugs
            
        file_ext = file_path.suffix.lower()
        
        # JavaScript/TypeScript analysis
        if file_ext in ['.js', '.jsx', '.ts', '.tsx']:
            bugs.extend(self.analyze_javascript(file_path, content, lines))
            
        # Python analysis
        elif file_ext == '.py':
            bugs.extend(self.analyze_python(file_path, content, lines))
            
        # Configuration files
        elif file_ext in ['.json', '.yaml', '.yml']:
            bugs.extend(self.analyze_config(file_path, content, lines))
            
        # Shell scripts
        elif file_ext in ['.sh']:
            bugs.extend(self.analyze_shell(file_path, content, lines))
            
        # General analysis for all files
        bugs.extend(self.analyze_general(file_path, content, lines))
        
        return bugs
    
    def analyze_javascript(self, file_path: Path, content: str, lines: List[str]) -> List[BugReport]:
        """Analyze JavaScript/TypeScript files"""
        bugs = []
        
        # Check for common React bugs
        react_bugs = self.find_react_bugs(file_path, content, lines)
        bugs.extend(react_bugs)
        
        # Check for performance issues
        performance_bugs = self.find_js_performance_bugs(file_path, content, lines)
        bugs.extend(performance_bugs)
        
        # Check for security issues
        security_bugs = self.find_js_security_bugs(file_path, content, lines)
        bugs.extend(security_bugs)
        
        # Check for accessibility issues
        a11y_bugs = self.find_a11y_bugs(file_path, content, lines)
        bugs.extend(a11y_bugs)
        
        return bugs
    
    def find_react_bugs(self, file_path: Path, content: str, lines: List[str]) -> List[BugReport]:
        """Find React-specific bugs"""
        bugs = []
        
        # Check for missing key props
        map_regex = r'\.map\s*\([^)]*\s*=>\s*[^}]*\}[^)]*\)'
        for i, line in enumerate(lines, 1):
            if re.search(map_regex, line) and 'key' not in line:
                bugs.append(BugReport(
                    file_path=str(file_path),
                    line_number=i,
                    severity=BugSeverity.MEDIUM,
                    category=BugCategory.RELIABILITY,
                    title="Missing key prop in map function",
                    description="React requires a unique 'key' prop for list items to optimize rendering and prevent bugs",
                    code_snippet=line.strip(),
                    suggested_fix="Add a unique 'key' prop to the mapped element, e.g., key={item.id}",
                    complexity=2,
                    estimated_hours=0.5,
                    dependencies=[],
                    test_required=True
                ))
        
        # Check for useEffect without dependencies
        useeffect_regex = r'useEffect\s*\(\s*\(\s*\)\s*=>\s*\{[^}]*\}\s*\)'
        for i, line in enumerate(lines, 1):
            if re.search(useeffect_regex, line) and '[]' not in content:
                bugs.append(BugReport(
                    file_path=str(file_path),
                    line_number=i,
                    severity=BugSeverity.HIGH,
                    category=BugCategory.PERFORMANCE,
                    title="useEffect without dependency array",
                    description="useEffect without dependency array will run on every render, causing performance issues",
                    code_snippet=line.strip(),
                    suggested_fix="Add dependency array: useEffect(() => { ... }, []) for mount-only effects",
                    complexity=3,
                    estimated_hours=1.0,
                    dependencies=[],
                    test_required=True
                ))
        
        # Check for missing cleanup in useEffect
        for i, line in enumerate(lines, 1):
            if 'useEffect' in line and 'addEventListener' in content:
                # Look for cleanup function
                content_after = '\n'.join(lines[i:])
                if 'return () =>' not in content_after and 'removeEventListener' not in content_after:
                    bugs.append(BugReport(
                        file_path=str(file_path),
                        line_number=i,
                        severity=BugSeverity.HIGH,
                        category=BugCategory.PERFORMANCE,
                        title="Missing cleanup in useEffect",
                        description="Event listeners and timers added in useEffect should be cleaned up to prevent memory leaks",
                        code_snippet=line.strip(),
                        suggested_fix="Return a cleanup function: return () => { removeEventListener(...) }",
                        complexity=4,
                        estimated_hours=1.5,
                        dependencies=[],
                        test_required=True
                    ))
        
        # Check for direct DOM manipulation
        dom_regex = r'document\.(querySelector|getElementById|createElement)'
        for i, line in enumerate(lines, 1):
            if re.search(dom_regex, line) and 'useEffect' not in content and 'useLayoutEffect' not in content:
                bugs.append(BugReport(
                    file_path=str(file_path),
                    line_number=i,
                    severity=BugSeverity.MEDIUM,
                    category=BugCategory.MAINTAINABILITY,
                    title="Direct DOM manipulation outside useEffect",
                    description="Direct DOM manipulation should be done in useEffect to avoid hydration mismatches",
                    code_snippet=line.strip(),
                    suggested_fix="Move DOM manipulation inside useEffect or use React refs",
                    complexity=5,
                    estimated_hours=2.0,
                    dependencies=[],
                    test_required=True
                ))
        
        return bugs
    
    def find_js_performance_bugs(self, file_path: Path, content: str, lines: List[str]) -> List[BugReport]:
        """Find JavaScript performance issues"""
        bugs = []
        
        # Check for inline functions in render
        inline_func_regex = r'on\w+\s*=\s*\{[^}]*=>[^}]*\}'
        for i, line in enumerate(lines, 1):
            if re.search(inline_func_regex, line):
                bugs.append(BugReport(
                    file_path=str(file_path),
                    line_number=i,
                    severity=BugSeverity.MEDIUM,
                    category=BugCategory.PERFORMANCE,
                    title="Inline function in render",
                    description="Inline functions create new instances on every render, causing unnecessary re-renders",
                    code_snippet=line.strip(),
                    suggested_fix="Move function outside render or use useCallback hook",
                    complexity=3,
                    estimated_hours=1.0,
                    dependencies=[],
                    test_required=False
                ))
        
        # Check for expensive operations in render
        expensive_ops = ['JSON.parse', 'JSON.stringify', 'Array.from', 'Object.keys', 'Object.values']
        for i, line in enumerate(lines, 1):
            for op in expensive_ops:
                if op in line and 'return' in line and 'useMemo' not in content:
                    bugs.append(BugReport(
                        file_path=str(file_path),
                        line_number=i,
                        severity=BugSeverity.MEDIUM,
                        category=BugCategory.PERFORMANCE,
                        title="Expensive operation in render",
                        description="Expensive operations should be memoized to avoid running on every render",
                        code_snippet=line.strip(),
                        suggested_fix="Use useMemo to memoize expensive calculations",
                        complexity=4,
                        estimated_hours=1.5,
                        dependencies=[],
                        test_required=False
                    ))
        
        return bugs
    
    def find_js_security_bugs(self, file_path: Path, content: str, lines: List[str]) -> List[BugReport]:
        """Find JavaScript security issues"""
        bugs = []
        
        # Check for innerHTML usage
        innerhtml_regex = r'innerHTML\s*='
        for i, line in enumerate(lines, 1):
            if re.search(innerhtml_regex, line):
                bugs.append(BugReport(
                    file_path=str(file_path),
                    line_number=i,
                    severity=BugSeverity.HIGH,
                    category=BugCategory.SECURITY,
                    title="Dangerous innerHTML usage",
                    description="innerHTML can lead to XSS attacks if user input is not properly sanitized",
                    code_snippet=line.strip(),
                    suggested_fix="Use textContent instead or sanitize HTML with DOMPurify",
                    complexity=6,
                    estimated_hours=3.0,
                    dependencies=['dompurify'],
                    test_required=True
                ))
        
        # Check for eval usage
        eval_regex = r'\beval\s*\('
        for i, line in enumerate(lines, 1):
            if re.search(eval_regex, line):
                bugs.append(BugReport(
                    file_path=str(file_path),
                    line_number=i,
                    severity=BugSeverity.CRITICAL,
                    category=BugCategory.SECURITY,
                    title="Dangerous eval() usage",
                    description="eval() can execute arbitrary code and is a major security risk",
                    code_snippet=line.strip(),
                    suggested_fix="Use JSON.parse for JSON data or find safer alternatives",
                    complexity=8,
                    estimated_hours=4.0,
                    dependencies=[],
                    test_required=True
                ))
        
        return bugs
    
    def find_a11y_bugs(self, file_path: Path, content: str, lines: List[str]) -> List[BugReport]:
        """Find accessibility issues"""
        bugs = []
        
        # Check for missing alt attributes
        img_regex = r'<img[^>]*>'
        for i, line in enumerate(lines, 1):
            if re.search(img_regex, line) and 'alt=' not in line:
                bugs.append(BugReport(
                    file_path=str(file_path),
                    line_number=i,
                    severity=BugSeverity.MEDIUM,
                    category=BugCategory.ACCESSIBILITY,
                    title="Missing alt attribute on image",
                    description="Images must have alt attributes for screen readers",
                    code_snippet=line.strip(),
                    suggested_fix='Add alt attribute: <img src="..." alt="Description of image" />',
                    complexity=1,
                    estimated_hours=0.2,
                    dependencies=[],
                    test_required=False
                ))
        
        # Check for missing button types
        button_regex = r'<button[^>]*>'
        for i, line in enumerate(lines, 1):
            if re.search(button_regex, line) and 'type=' not in line:
                bugs.append(BugReport(
                    file_path=str(file_path),
                    line_number=i,
                    severity=BugSeverity.LOW,
                    category=BugCategory.ACCESSIBILITY,
                    title="Missing button type attribute",
                    description="Buttons should have explicit type attributes for accessibility",
                    code_snippet=line.strip(),
                    suggested_fix='Add type attribute: <button type="button"> or <button type="submit">',
                    complexity=1,
                    estimated_hours=0.1,
                    dependencies=[],
                    test_required=False
                ))
        
        return bugs
    
    def analyze_python(self, file_path: Path, content: str, lines: List[str]) -> List[BugReport]:
        """Analyze Python files"""
        bugs = []
        
        # Check for bare except clauses
        bare_except_regex = r'except\s*:'
        for i, line in enumerate(lines, 1):
            if re.search(bare_except_regex, line):
                bugs.append(BugReport(
                    file_path=str(file_path),
                    line_number=i,
                    severity=BugSeverity.HIGH,
                    category=BugCategory.RELIABILITY,
                    title="Bare except clause",
                    description="Bare except clauses catch all exceptions including KeyboardInterrupt and SystemExit",
                    code_snippet=line.strip(),
                    suggested_fix="Use 'except Exception:' to catch only non-system exceptions",
                    complexity=2,
                    estimated_hours=0.5,
                    dependencies=[],
                    test_required=True
                ))
        
        # Check for missing encoding in file operations
        open_regex = r'open\s*\([^)]*\)'
        for i, line in enumerate(lines, 1):
            if re.search(open_regex, line) and 'encoding=' not in line:
                bugs.append(BugReport(
                    file_path=str(file_path),
                    line_number=i,
                    severity=BugSeverity.MEDIUM,
                    category=BugCategory.COMPATIBILITY,
                    title="Missing encoding in file operations",
                    description="File operations should specify encoding for cross-platform compatibility",
                    code_snippet=line.strip(),
                    suggested_fix="Add encoding parameter: open(file, 'r', encoding='utf-8')",
                    complexity=1,
                    estimated_hours=0.2,
                    dependencies=[],
                    test_required=False
                ))
        
        # Check for hardcoded credentials
        credential_regex = r'(password|api_key|secret|token)\s*=\s*["\'][^"\']+["\']'
        for i, line in enumerate(lines, 1):
            if re.search(credential_regex, line, re.IGNORECASE):
                bugs.append(BugReport(
                    file_path=str(file_path),
                    line_number=i,
                    severity=BugSeverity.CRITICAL,
                    category=BugCategory.SECURITY,
                    title="Hardcoded credentials",
                    description="Hardcoded credentials are a major security risk",
                    code_snippet=line.strip(),
                    suggested_fix="Use environment variables or secure configuration management",
                    complexity=7,
                    estimated_hours=3.0,
                    dependencies=[],
                    test_required=True
                ))
        
        return bugs
    
    def analyze_config(self, file_path: Path, content: str, lines: List[str]) -> List[BugReport]:
        """Analyze configuration files"""
        bugs = []
        
        if file_path.name == 'package.json':
            bugs.extend(self.analyze_package_json(file_path, content, lines))
        
        return bugs
    
    def analyze_package_json(self, file_path: Path, content: str, lines: List[str]) -> List[BugReport]:
        """Analyze package.json for issues"""
        bugs = []
        
        try:
            package_data = json.loads(content)
            
            # Check for outdated dependencies
            if 'dependencies' in package_data:
                for dep, version in package_data['dependencies'].items():
                    if version.startswith('^') and any(char.isdigit() for char in version):
                        major_version = int(version.split('.')[0].replace('^', ''))
                        if major_version < 2:
                            bugs.append(BugReport(
                                file_path=str(file_path),
                                line_number=0,
                                severity=BugSeverity.MEDIUM,
                                category=BugCategory.SECURITY,
                                title=f"Potentially outdated dependency: {dep}",
                                description=f"Dependency {dep} version {version} might be outdated and contain security vulnerabilities",
                                code_snippet=f'"{dep}": "{version}"',
                                suggested_fix="Update to latest stable version and test thoroughly",
                                complexity=5,
                                estimated_hours=2.0,
                                dependencies=[dep],
                                test_required=True
                            ))
            
            # Check for missing scripts
            if 'scripts' in package_data:
                if 'test' not in package_data['scripts']:
                    bugs.append(BugReport(
                        file_path=str(file_path),
                        line_number=0,
                        severity=BugSeverity.MEDIUM,
                        category=BugCategory.TESTING,
                        title="Missing test script",
                        description="No test script defined in package.json",
                        code_snippet="",
                        suggested_fix="Add test script: \"test\": \"jest\" or your preferred testing framework",
                        complexity=2,
                        estimated_hours=0.5,
                        dependencies=[],
                        test_required=False
                    ))
                
                if 'lint' not in package_data['scripts']:
                    bugs.append(BugReport(
                        file_path=str(file_path),
                        line_number=0,
                        severity=BugSeverity.LOW,
                        category=BugCategory.MAINTAINABILITY,
                        title="Missing lint script",
                        description="No lint script defined for code quality checks",
                        code_snippet="",
                        suggested_fix="Add lint script: \"lint\": \"eslint .\"",
                        complexity=1,
                        estimated_hours=0.2,
                        dependencies=[],
                        test_required=False
                    ))
        
        except json.JSONDecodeError:
            bugs.append(BugReport(
                file_path=str(file_path),
                line_number=0,
                severity=BugSeverity.HIGH,
                category=BugCategory.RELIABILITY,
                title="Invalid JSON in package.json",
                description="package.json contains invalid JSON syntax",
                code_snippet="",
                suggested_fix="Fix JSON syntax errors",
                complexity=2,
                estimated_hours=0.5,
                dependencies=[],
                test_required=False
            ))
        
        return bugs
    
    def analyze_shell(self, file_path: Path, content: str, lines: List[str]) -> List[BugReport]:
        """Analyze shell scripts"""
        bugs = []
        
        # Check for missing shebang
        if not content.startswith('#!'):
            bugs.append(BugReport(
                file_path=str(file_path),
                line_number=1,
                severity=BugSeverity.MEDIUM,
                category=BugCategory.COMPATIBILITY,
                title="Missing shebang in shell script",
                description="Shell scripts should have a shebang line to specify the interpreter",
                code_snippet=lines[0] if lines else "",
                suggested_fix="Add shebang: #!/bin/bash or #!/bin/sh",
                complexity=1,
                estimated_hours=0.1,
                dependencies=[],
                test_required=False
            ))
        
        # Check for unquoted variables
        unquoted_var_regex = r'\$[A-Za-z_][A-Za-z0-9_]*[^"\']'
        for i, line in enumerate(lines, 1):
            if re.search(unquoted_var_regex, line) and not line.strip().startswith('#'):
                bugs.append(BugReport(
                    file_path=str(file_path),
                    line_number=i,
                    severity=BugSeverity.MEDIUM,
                    category=BugCategory.RELIABILITY,
                    title="Unquoted variable in shell script",
                    description="Variables should be quoted to handle spaces and special characters",
                    code_snippet=line.strip(),
                    suggested_fix='Quote variables: "$VAR" instead of $VAR',
                    complexity=2,
                    estimated_hours=0.3,
                    dependencies=[],
                    test_required=False
                ))
        
        return bugs
    
    def analyze_general(self, file_path: Path, content: str, lines: List[str]) -> List[BugReport]:
        """General analysis applicable to all files"""
        bugs = []
        
        # Check for TODO/FIXME comments that might indicate unfinished work
        todo_regex = r'(TODO|FIXME|HACK|XXX)\s*[:;]\s*(.+)'
        for i, line in enumerate(lines, 1):
            match = re.search(todo_regex, line, re.IGNORECASE)
            if match:
                bugs.append(BugReport(
                    file_path=str(file_path),
                    line_number=i,
                    severity=BugSeverity.INFO,
                    category=BugCategory.MAINTAINABILITY,
                    title=f"{match.group(1).upper()} comment found",
                    description=f"{match.group(1).upper()} comments indicate unfinished work or known issues",
                    code_snippet=line.strip(),
                    suggested_fix="Complete the TODO item or create a proper issue ticket",
                    complexity=1,
                    estimated_hours=0.5,
                    dependencies=[],
                    test_required=False
                ))
        
        # Check for console.log statements in production code
        console_regex = r'console\.(log|warn|error|info)'
        for i, line in enumerate(lines, 1):
            if re.search(console_regex, line):
                bugs.append(BugReport(
                    file_path=str(file_path),
                    line_number=i,
                    severity=BugSeverity.LOW,
                    category=BugCategory.MAINTAINABILITY,
                    title="Console statement in production code",
                    description="Console statements should be removed or properly handled in production",
                    code_snippet=line.strip(),
                    suggested_fix="Remove console statement or use proper logging framework",
                    complexity=1,
                    estimated_hours=0.1,
                    dependencies=[],
                    test_required=False
                ))
        
        return bugs
    
    def scan_directory(self, directory: Path = None) -> List[BugReport]:
        """Scan entire directory for bugs"""
        if directory is None:
            directory = self.root_path
            
        all_bugs = []
        
        # Skip common directories that shouldn't be analyzed
        skip_dirs = {'.git', 'node_modules', '__pycache__', '.next', 'dist', 'build', '.vscode', '.idea'}
        
        for root, dirs, files in os.walk(directory):
            # Remove skip directories from traversal
            dirs[:] = [d for d in dirs if d not in skip_dirs]
            
            for file in files:
                file_path = Path(root) / file
                
                # Skip hidden files and common non-code files
                if file.startswith('.') or file.endswith(('.log', '.tmp', '.cache')):
                    continue
                    
                try:
                    bugs = self.analyze_file(file_path)
                    all_bugs.extend(bugs)
                except Exception as e:
                    print(f"Error analyzing {file_path}: {e}")
                    continue
        
        return all_bugs
    
    def generate_report(self, bugs: List[BugReport]) -> Dict[str, Any]:
        """Generate comprehensive bug report"""
        
        # Group bugs by severity
        by_severity = {}
        for severity in BugSeverity:
            by_severity[severity.value] = [b for b in bugs if b.severity == severity]
        
        # Group bugs by category
        by_category = {}
        for category in BugCategory:
            by_category[category.value] = [b for b in bugs if b.category == category]
        
        # Calculate statistics
        total_bugs = len(bugs)
        total_hours = sum(bug.estimated_hours for bug in bugs)
        critical_bugs = len(by_severity[BugSeverity.CRITICAL.value])
        high_bugs = len(by_severity[BugSeverity.HIGH.value])
        
        # Calculate complexity score
        avg_complexity = sum(bug.complexity for bug in bugs) / total_bugs if total_bugs > 0 else 0
        
        return {
            'summary': {
                'total_bugs': total_bugs,
                'total_estimated_hours': total_hours,
                'critical_bugs': critical_bugs,
                'high_bugs': high_bugs,
                'medium_bugs': len(by_severity[BugSeverity.MEDIUM.value]),
                'low_bugs': len(by_severity[BugSeverity.LOW.value]),
                'info_bugs': len(by_severity[BugSeverity.INFO.value]),
                'average_complexity': avg_complexity
            },
            'by_severity': by_severity,
            'by_category': by_category,
            'all_bugs': bugs,
            'priority_order': sorted(bugs, key=lambda b: (b.severity.value, -b.complexity))
        }

def main():
    """Main function to run the bug hunt"""
    print("🕵️ COMPREHENSIVE BUG HUNT SYSTEM")
    print("=" * 50)
    
    hunter = BugHunter()
    
    print("📁 Scanning directory for bugs...")
    bugs = hunter.scan_directory()
    
    if not bugs:
        print("✅ No bugs found!")
        return
    
    print(f"🎯 Found {len(bugs)} potential bugs/issues")
    
    report = hunter.generate_report(bugs)
    
    print(f"\n📈 SUMMARY:")
    print(f"   Critical: {report['summary']['critical_bugs']}")
    print(f"   High: {report['summary']['high_bugs']}")
    print(f"   Medium: {report['summary']['medium_bugs']}")
    print(f"   Low: {report['summary']['low_bugs']}")
    print(f"   Info: {report['summary']['info_bugs']}")
    print(f"   Total estimated hours: {report['summary']['total_estimated_hours']:.1f}")
    print(f"   Average complexity: {report['summary']['average_complexity']:.1f}/10")
    
    # Save detailed report
    with open('detailed_bug_report.json', 'w') as f:
        json.dump(report, f, indent=2, default=lambda x: x.value if hasattr(x, 'value') else str(x))
    
    print(f"\n📄 Detailed report saved to: detailed_bug_report.json")
    
    # Show top 5 most critical bugs
    print(f"\n🚨 TOP 5 MOST CRITICAL BUGS:")
    print("-" * 40)
    
    for i, bug in enumerate(report['priority_order'][:5], 1):
        print(f"{i}. {bug.title}")
        print(f"   File: {bug.file_path}:{bug.line_number}")
        print(f"   Severity: {bug.severity.value.upper()}")
        print(f"   Category: {bug.category.value}")
        print(f"   Complexity: {bug.complexity}/10")
        print(f"   Est. Hours: {bug.estimated_hours}")
        print(f"   Description: {bug.description[:100]}...")
        print()

if __name__ == "__main__":
    main()