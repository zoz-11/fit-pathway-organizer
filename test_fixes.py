#!/usr/bin/env python3
"""
Test script to verify the bug fixes work correctly
"""

import sys
import os
import tempfile
import json
from pathlib import Path

# Add the python directory to the path
sys.path.append('python')

def test_python_fixes():
    """Test the Python chat manager fixes"""
    print("=== Testing Python Chat Manager Fixes ===")
    
    try:
        from chat_manager_refactored import ChatManager, ChatMessage
        
        # Test 1: Context manager exception handling
        print("Test 1: Testing exception handling in context manager...")
        manager = ChatManager()
        
        # This should raise an exception (invalid path)
        try:
            manager.save_chat_history([], "/invalid/path/that/does/not/exist/test.json")
            print("❌ Expected exception was not raised")
            return False
        except Exception as e:
            print(f"✅ Exception properly raised: {type(e).__name__}")
        
        # Test 2: Proper file handling with encoding
        print("\nTest 2: Testing file operations with proper encoding...")
        with tempfile.TemporaryDirectory() as temp_dir:
            test_manager = ChatManager(base_path=Path(temp_dir))
            messages = [
                ChatMessage(role="user", content="Hello!"),
                ChatMessage(role="model", content="Hi there! 🎉")  # Include emoji to test encoding
            ]
            
            # Save messages
            result = test_manager.save_chat_history(messages, "test.json")
            if not result:
                print("❌ Failed to save chat history")
                return False
            print("✅ Chat history saved successfully")
            
            # Load messages
            loaded_messages = test_manager.load_chat_history("test.json")
            if len(loaded_messages) != 2:
                print("❌ Failed to load correct number of messages")
                return False
            print("✅ Chat history loaded successfully")
            
            # Verify content
            if loaded_messages[1].content != "Hi there! 🎉":
                print("❌ Unicode content not preserved correctly")
                return False
            print("✅ Unicode content preserved correctly")
        
        print("✅ All Python tests passed!")
        return True
        
    except ImportError as e:
        print(f"❌ Could not import chat_manager_refactored: {e}")
        return False
    except Exception as e:
        print(f"❌ Unexpected error in Python tests: {e}")
        return False

def test_react_fixes():
    """Test the React fixes by checking file content"""
    print("\n=== Testing React App.tsx Fixes ===")
    
    try:
        # Test 1: Check for ErrorBoundary import
        print("Test 1: Checking for ErrorBoundary import...")
        with open('apps/web-app/src/App.tsx', 'r') as f:
            app_content = f.read()
            
        if 'import ErrorBoundary from "@/components/ErrorBoundary"' not in app_content:
            print("❌ ErrorBoundary import not found")
            return False
        print("✅ ErrorBoundary import found")
        
        # Test 2: Check for ErrorBoundary usage
        print("\nTest 2: Checking for ErrorBoundary usage...")
        if '<ErrorBoundary>' not in app_content or '</ErrorBoundary>' not in app_content:
            print("❌ ErrorBoundary usage not found")
            return False
        print("✅ ErrorBoundary usage found")
        
        # Test 3: Check for fixed TypeScript interface
        print("\nTest 3: Checking for fixed RouteConfig interface...")
        if 'element: React.ComponentType<any>' not in app_content:
            print("❌ Fixed RouteConfig interface not found")
            return False
        print("✅ Fixed RouteConfig interface found")
        
        # Test 4: Check for improved useClickabilityFixes
        print("\nTest 4: Checking for improved useClickabilityFixes hook...")
        with open('apps/web-app/src/hooks/useClickabilityFixes.ts', 'r') as f:
            hook_content = f.read()
            
        if 'mutationTimeout' not in hook_content:
            print("❌ Debouncing improvement not found")
            return False
        print("✅ Debouncing improvement found")
        
        # Test 5: Check for proper cleanup
        if 'clearTimeout(mutationTimeout)' not in hook_content:
            print("❌ Proper cleanup not found")
            return False
        print("✅ Proper cleanup found")
        
        print("✅ All React tests passed!")
        return True
        
    except FileNotFoundError as e:
        print(f"❌ File not found: {e}")
        return False
    except Exception as e:
        print(f"❌ Unexpected error in React tests: {e}")
        return False

def main():
    """Run all tests"""
    print("🧪 Running Bug Fix Verification Tests")
    print("=" * 50)
    
    python_passed = test_python_fixes()
    react_passed = test_react_fixes()
    
    print("\n" + "=" * 50)
    print("📊 TEST RESULTS SUMMARY")
    print("=" * 50)
    
    if python_passed:
        print("✅ Python fixes: PASSED")
    else:
        print("❌ Python fixes: FAILED")
        
    if react_passed:
        print("✅ React fixes: PASSED")
    else:
        print("❌ React fixes: FAILED")
        
    if python_passed and react_passed:
        print("\n🎉 ALL TESTS PASSED! The bugs have been fixed successfully.")
        return 0
    else:
        print("\n⚠️  Some tests failed. Please review the fixes.")
        return 1

if __name__ == "__main__":
    sys.exit(main())