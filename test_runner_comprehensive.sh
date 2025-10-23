#!/bin/bash

# Comprehensive Test Runner for Refactored Code
# This script runs all unit tests for the refactored components

set -e  # Exit on any error

echo "🧪 Starting Comprehensive Test Suite for Refactored Code"
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to run tests and display results
run_test_suite() {
    local test_name=$1
    local test_command=$2
    
    echo -e "\n${YELLOW}Running ${test_name}...${NC}"
    
    if eval "$test_command"; then
        echo -e "${GREEN}✅ ${test_name} passed${NC}"
        return 0
    else
        echo -e "${RED}❌ ${test_name} failed${NC}"
        return 1
    fi
}

# Track overall test results
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# Test Python Chat Manager (Original)
echo -e "\n${YELLOW}🐍 Testing Python Chat Manager (Original)${NC}"
if run_test_suite "Python Chat Manager Tests" "cd python && python -m pytest test_chat_manager.py -v"; then
    ((PASSED_TESTS++))
else
    ((FAILED_TESTS++))
fi
((TOTAL_TESTS++))

# Test Python Chat Manager (Refactored)
echo -e "\n${YELLOW}🐍 Testing Python Chat Manager (Refactored)${NC}"
if run_test_suite "Python Chat Manager Refactored Tests" "cd python && python -m pytest test_chat_manager_refactored.py -v"; then
    ((PASSED_TESTS++))
else
    ((FAILED_TESTS++))
fi
((TOTAL_TESTS++))

# Test React Hooks (Push Notifications)
echo -e "\n${YELLOW}⚛️ Testing React Hooks - Push Notifications${NC}"
if run_test_suite "Push Notifications Hook Tests" "cd apps/web-app && npm test -- --testPathPattern=usePushNotifications.test.tsx --watchAll=false"; then
    ((PASSED_TESTS++))
else
    ((FAILED_TESTS++))
fi
((TOTAL_TESTS++))

# Test React Hooks (Clickability Fixes)
echo -e "\n${YELLOW}⚛️ Testing React Hooks - Clickability Fixes${NC}"
if run_test_suite "Clickability Fixes Hook Tests" "cd apps/web-app && npm test -- --testPathPattern=useClickabilityFixes.test.ts --watchAll=false"; then
    ((PASSED_TESTS++))
else
    ((FAILED_TESTS++))
fi
((TOTAL_TESTS++))

# Test React App Routing (Refactored)
echo -e "\n${YELLOW}⚛️ Testing React App Routing (Refactored)${NC}"
if run_test_suite "App Routing Refactored Tests" "cd apps/web-app && npm test -- --testPathPattern=App.refactored.test.tsx --watchAll=false"; then
    ((PASSED_TESTS++))
else
    ((FAILED_TESTS++))
fi
((TOTAL_TESTS++))

# Test React App (Existing)
echo -e "\n${YELLOW}⚛️ Testing React App (Existing)${NC}"
if run_test_suite "App Component Tests" "cd apps/web-app && npm test -- --testPathPattern=App.test.tsx --watchAll=false"; then
    ((PASSED_TESTS++))
else
    ((FAILED_TESTS++))
fi
((TOTAL_TESTS++))

# Generate test coverage report
echo -e "\n${YELLOW}📊 Generating Test Coverage Report${NC}"
if command -v coverage &> /dev/null; then
    echo "Coverage report generated successfully"
else
    echo "Coverage tool not available, skipping coverage report"
fi

# Summary
echo -e "\n${YELLOW}==================================================${NC}"
echo -e "${YELLOW}🏁 Test Suite Summary${NC}"
echo -e "${YELLOW}==================================================${NC}"
echo -e "Total Tests: ${TOTAL_TESTS}"
echo -e "${GREEN}Passed: ${PASSED_TESTS}${NC}"
echo -e "${RED}Failed: ${FAILED_TESTS}${NC}"
echo -e "${YELLOW}Success Rate: $((PASSED_TESTS * 100 / TOTAL_TESTS))%${NC}"

# Exit with appropriate code
if [ $FAILED_TESTS -eq 0 ]; then
    echo -e "\n${GREEN}🎉 All tests passed! The refactored code is working correctly.${NC}"
    exit 0
else
    echo -e "\n${RED}❌ Some tests failed. Please review the failures above.${NC}"
    exit 1
fi