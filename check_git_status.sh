#!/bin/bash
echo "=== Git Status ==="
git status
echo ""
echo "=== Recent Commits ==="
git log --oneline -10
echo ""
echo "=== Files with recent changes ==="
git diff --name-only HEAD~5..HEAD
echo ""
echo "=== Check for any corrupted files ==="
find apps/web-app/src -name "*.tsx" -exec grep -l "jsx\|JSX" {} \;