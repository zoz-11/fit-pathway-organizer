"""
Unit tests for the original chat_manager.py
"""
import json
import os
import tempfile
import unittest
from unittest.mock import patch, mock_open
from chat_manager import save_chat, load_chat


class TestChatManager(unittest.TestCase):
    """Test cases for the original chat_manager functions."""
    
    def setUp(self):
        """Set up test fixtures before each test method."""
        self.test_chat_history = [
            {"role": "user", "content": "Hello!"},
            {"role": "model", "content": "Hi there!"}
        ]
        self.test_filename = "test_chat_history.json"
        
    def tearDown(self):
        """Clean up after each test method."""
        # Remove test file if it exists
        if os.path.exists(self.test_filename):
            os.remove(self.test_filename)
    
    @patch('builtins.print')
    def test_save_chat_success(self, mock_print):
        """Test successful chat history saving."""
        # Act
        save_chat(self.test_chat_history, self.test_filename)
        
        # Assert
        self.assertTrue(os.path.exists(self.test_filename))
        with open(self.test_filename, 'r') as f:
            saved_data = json.load(f)
        self.assertEqual(saved_data, self.test_chat_history)
        mock_print.assert_called_with(f"Chat history saved to {self.test_filename}")
    
    @patch('builtins.print')
    def test_save_chat_creates_directory(self, mock_print):
        """Test that save_chat creates necessary directories."""
        # Arrange
        test_dir = "test_directory"
        test_file = f"{test_dir}/chat.json"
        
        # Act
        save_chat(self.test_chat_history, test_file)
        
        # Assert
        self.assertTrue(os.path.exists(test_file))
        
        # Cleanup
        import shutil
        shutil.rmtree(test_dir)
    
    @patch('builtins.print')
    def test_save_chat_io_error(self, mock_print):
        """Test save_chat handles IO errors gracefully."""
        # Arrange
        invalid_filename = "/invalid/path/that/does/not/exist/file.json"
        
        # Act
        save_chat(self.test_chat_history, invalid_filename)
        
        # Assert
        mock_print.assert_called_with(f"Error saving chat history to {invalid_filename}: [Errno 2] No such file or directory: '/invalid/path/that/does/not/exist'")
    
    @patch('builtins.print')
    def test_load_chat_file_not_exists(self, mock_print):
        """Test loading chat when file doesn't exist."""
        # Act
        result = load_chat("non_existent_file.json")
        
        # Assert
        self.assertEqual(result, [])
        mock_print.assert_called_with("No chat history found at non_existent_file.json. Starting a new chat.")
    
    @patch('builtins.print')
    def test_load_chat_success(self, mock_print):
        """Test successful chat history loading."""
        # Arrange
        save_chat(self.test_chat_history, self.test_filename)
        
        # Act
        result = load_chat(self.test_filename)
        
        # Assert
        self.assertEqual(result, self.test_chat_history)
        mock_print.assert_called_with(f"Chat history loaded from {self.test_filename}.")
    
    @patch('builtins.print')
    def test_load_chat_invalid_format(self, mock_print):
        """Test loading chat with invalid format (not a list)."""
        # Arrange
        invalid_data = {"not": "a_list"}
        with open(self.test_filename, 'w') as f:
            json.dump(invalid_data, f)
        
        # Act
        result = load_chat(self.test_filename)
        
        # Assert
        self.assertEqual(result, [])
        mock_print.assert_called_with(f"Error: Invalid chat history format in {self.test_filename}. Expected a list.")
    
    @patch('builtins.print')
    def test_load_chat_corrupted_json(self, mock_print):
        """Test loading chat with corrupted JSON."""
        # Arrange
        corrupted_json = "invalid json content"
        with open(self.test_filename, 'w') as f:
            f.write(corrupted_json)
        
        # Act
        result = load_chat(self.test_filename)
        
        # Assert
        self.assertEqual(result, [])
        mock_print.assert_called_with(f"Error decoding JSON from {self.test_filename}. File might be corrupted or empty. Starting a new chat.")
    
    @patch('builtins.print')
    def test_load_chat_io_error(self, mock_print):
        """Test load_chat handles IO errors gracefully."""
        # Arrange
        invalid_filename = "/invalid/path/that/does/not/exist/file.json"
        
        # Act
        result = load_chat(invalid_filename)
        
        # Assert
        self.assertEqual(result, [])
        mock_print.assert_called_with(f"Error loading chat history from {invalid_filename}: [Errno 2] No such file or directory: '/invalid/path/that/does/not/exist'")
    
    def test_save_and_load_roundtrip(self):
        """Test that saving and loading preserves data integrity."""
        # Act
        save_chat(self.test_chat_history, self.test_filename)
        loaded_data = load_chat(self.test_filename)
        
        # Assert
        self.assertEqual(loaded_data, self.test_chat_history)
    
    def test_empty_chat_history(self):
        """Test handling of empty chat history."""
        # Arrange
        empty_chat = []
        
        # Act
        save_chat(empty_chat, self.test_filename)
        loaded_data = load_chat(self.test_filename)
        
        # Assert
        self.assertEqual(loaded_data, empty_chat)


if __name__ == '__main__':
    unittest.main()