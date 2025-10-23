"""
Unit tests for the refactored chat_manager_refactored.py
"""
import json
import os
import tempfile
import unittest
from unittest.mock import patch, mock_open, MagicMock
from datetime import datetime
from pathlib import Path

# Import the refactored chat manager
from chat_manager_refactored import ChatManager, ChatMessage, save_chat, load_chat


class TestChatMessage(unittest.TestCase):
    """Test cases for the ChatMessage dataclass."""
    
    def test_chat_message_creation(self):
        """Test basic ChatMessage creation."""
        # Act
        message = ChatMessage(role="user", content="Hello!")
        
        # Assert
        self.assertEqual(message.role, "user")
        self.assertEqual(message.content, "Hello!")
        self.assertIsNotNone(message.timestamp)
        self.assertIsInstance(message.timestamp, datetime)
    
    def test_chat_message_with_timestamp(self):
        """Test ChatMessage with explicit timestamp."""
        # Arrange
        test_timestamp = datetime(2023, 1, 1, 12, 0, 0)
        
        # Act
        message = ChatMessage(role="model", content="Hi!", timestamp=test_timestamp)
        
        # Assert
        self.assertEqual(message.timestamp, test_timestamp)
    
    def test_to_dict_conversion(self):
        """Test conversion of ChatMessage to dictionary."""
        # Arrange
        message = ChatMessage(role="user", content="Test message")
        
        # Act
        result = message.to_dict()
        
        # Assert
        self.assertEqual(result["role"], "user")
        self.assertEqual(result["content"], "Test message")
        self.assertIn("timestamp", result)
        self.assertIsNotNone(result["timestamp"])
    
    def test_from_dict_valid(self):
        """Test creating ChatMessage from valid dictionary."""
        # Arrange
        data = {
            "role": "model",
            "content": "Response",
            "timestamp": "2023-01-01T12:00:00"
        }
        
        # Act
        message = ChatMessage.from_dict(data)
        
        # Assert
        self.assertEqual(message.role, "model")
        self.assertEqual(message.content, "Response")
        self.assertIsInstance(message.timestamp, datetime)
    
    def test_from_dict_invalid_timestamp(self):
        """Test creating ChatMessage from dictionary with invalid timestamp."""
        # Arrange
        data = {
            "role": "user",
            "content": "Message",
            "timestamp": "invalid-timestamp"
        }
        
        # Act
        message = ChatMessage.from_dict(data)
        
        # Assert
        self.assertEqual(message.role, "user")
        self.assertEqual(message.content, "Message")
        self.assertIsNone(message.timestamp)
    
    def test_from_dict_missing_fields(self):
        """Test creating ChatMessage from dictionary with missing fields."""
        # Arrange
        data = {"role": "user"}  # Missing content and timestamp
        
        # Act
        message = ChatMessage.from_dict(data)
        
        # Assert
        self.assertEqual(message.role, "user")
        self.assertEqual(message.content, "")  # Default empty string
        self.assertIsNone(message.timestamp)


class TestChatManager(unittest.TestCase):
    """Test cases for the ChatManager class."""
    
    def setUp(self):
        """Set up test fixtures before each test method."""
        self.temp_dir = tempfile.mkdtemp()
        self.manager = ChatManager(base_path=Path(self.temp_dir))
        self.test_messages = [
            ChatMessage(role="user", content="Hello!"),
            ChatMessage(role="model", content="Hi there!")
        ]
        self.test_filename = "test_chat.json"
    
    def tearDown(self):
        """Clean up after each test method."""
        import shutil
        shutil.rmtree(self.temp_dir)
    
    @patch('chat_manager_refactored.logger')
    def test_save_chat_history_success(self, mock_logger):
        """Test successful chat history saving."""
        # Act
        result = self.manager.save_chat_history(self.test_messages, self.test_filename)
        
        # Assert
        self.assertTrue(result)
        self.assertTrue((Path(self.temp_dir) / self.test_filename).exists())
        mock_logger.info.assert_called_with(f"Chat history saved to {Path(self.temp_dir) / self.test_filename}")
    
    @patch('chat_manager_refactored.logger')
    def test_save_chat_history_empty_list(self, mock_logger):
        """Test saving empty chat history."""
        # Act
        result = self.manager.save_chat_history([], self.test_filename)
        
        # Assert
        self.assertFalse(result)
        mock_logger.warning.assert_called_with("Empty chat history provided")
    
    @patch('chat_manager_refactored.logger')
    def test_save_chat_history_invalid_format(self, mock_logger):
        """Test saving invalid chat history format."""
        # Arrange
        invalid_messages = ["not", "a", "chat", "message"]  # Not ChatMessage objects
        
        # Act
        result = self.manager.save_chat_history(invalid_messages, self.test_filename)
        
        # Assert
        self.assertFalse(result)
        mock_logger.error.assert_called_with("Invalid chat history format: expected list of ChatMessage objects")
    
    @patch('chat_manager_refactored.logger')
    def test_save_chat_history_with_backup(self, mock_logger):
        """Test saving chat history with backup creation."""
        # Arrange - save initial file
        self.manager.save_chat_history(self.test_messages, self.test_filename)
        
        # Act - save again with backup
        new_messages = [ChatMessage(role="user", content="New message")]
        result = self.manager.save_chat_history(new_messages, self.test_filename)
        
        # Assert
        self.assertTrue(result)
        # Check that backup file was created
        backup_files = list(Path(self.temp_dir).glob(f"{self.test_filename}.backup_*.json"))
        self.assertEqual(len(backup_files), 1)
    
    @patch('chat_manager_refactored.logger')
    def test_load_chat_history_success(self, mock_logger):
        """Test successful chat history loading."""
        # Arrange - save some data first
        self.manager.save_chat_history(self.test_messages, self.test_filename)
        
        # Act
        loaded_messages = self.manager.load_chat_history(self.test_filename)
        
        # Assert
        self.assertEqual(len(loaded_messages), 2)
        self.assertEqual(loaded_messages[0].role, "user")
        self.assertEqual(loaded_messages[0].content, "Hello!")
        self.assertEqual(loaded_messages[1].role, "model")
        self.assertEqual(loaded_messages[1].content, "Hi there!")
        mock_logger.info.assert_called_with(f"Loaded {len(loaded_messages)} messages from {Path(self.temp_dir) / self.test_filename}")
    
    @patch('chat_manager_refactored.logger')
    def test_load_chat_history_file_not_exists(self, mock_logger):
        """Test loading chat history when file doesn't exist."""
        # Act
        result = self.manager.load_chat_history("non_existent.json")
        
        # Assert
        self.assertEqual(result, [])
        mock_logger.info.assert_called_with("No chat history found at non_existent.json. Starting new chat.")
    
    @patch('chat_manager_refactored.logger')
    def test_load_chat_history_invalid_format(self, mock_logger):
        """Test loading chat history with invalid format."""
        # Arrange - create invalid JSON file
        invalid_data = {"not": "a_list"}
        file_path = Path(self.temp_dir) / self.test_filename
        with open(file_path, 'w') as f:
            json.dump(invalid_data, f)
        
        # Act
        result = self.manager.load_chat_history(self.test_filename)
        
        # Assert
        self.assertEqual(result, [])
        mock_logger.error.assert_called_with(f"Invalid chat history format in {file_path}: expected list")
    
    @patch('chat_manager_refactored.logger')
    def test_load_chat_history_corrupted_json(self, mock_logger):
        """Test loading chat history with corrupted JSON."""
        # Arrange - create corrupted JSON file
        file_path = Path(self.temp_dir) / self.test_filename
        with open(file_path, 'w') as f:
            f.write("invalid json content")
        
        # Act
        result = self.manager.load_chat_history(self.test_filename)
        
        # Assert
        self.assertEqual(result, [])
        mock_logger.error.assert_called()
    
    @patch('chat_manager_refactored.logger')
    def test_append_message_success(self, mock_logger):
        """Test appending a single message to existing chat history."""
        # Arrange - save initial chat
        self.manager.save_chat_history(self.test_messages, self.test_filename)
        new_message = ChatMessage(role="user", content="New message")
        
        # Act
        result = self.manager.append_message(new_message, self.test_filename)
        
        # Assert
        self.assertTrue(result)
        loaded_messages = self.manager.load_chat_history(self.test_filename)
        self.assertEqual(len(loaded_messages), 3)
        self.assertEqual(loaded_messages[-1].content, "New message")
    
    @patch('chat_manager_refactored.logger')
    def test_get_chat_stats_empty(self, mock_logger):
        """Test getting stats for empty chat."""
        # Act
        stats = self.manager.get_chat_stats("non_existent.json")
        
        # Assert
        self.assertEqual(stats["message_count"], 0)
        self.assertEqual(stats["file_exists"], False)
    
    @patch('chat_manager_refactored.logger')
    def test_get_chat_stats_with_data(self, mock_logger):
        """Test getting stats for chat with data."""
        # Arrange - save chat with mixed roles
        messages = [
            ChatMessage(role="user", content="Message 1"),
            ChatMessage(role="model", content="Response 1"),
            ChatMessage(role="user", content="Message 2"),
            ChatMessage(role="system", content="System message"),
        ]
        self.manager.save_chat_history(messages, self.test_filename)
        
        # Act
        stats = self.manager.get_chat_stats(self.test_filename)
        
        # Assert
        self.assertEqual(stats["message_count"], 4)
        self.assertEqual(stats["file_exists"], True)
        self.assertEqual(stats["role_distribution"]["user"], 2)
        self.assertEqual(stats["role_distribution"]["model"], 1)
        self.assertEqual(stats["role_distribution"]["system"], 1)
        self.assertIn("oldest_message", stats)
        self.assertIn("newest_message", stats)


class TestLegacyCompatibility(unittest.TestCase):
    """Test cases for legacy compatibility functions."""
    
    def setUp(self):
        """Set up test fixtures before each test method."""
        self.temp_dir = tempfile.mkdtemp()
        self.legacy_chat = [
            {"role": "user", "content": "Legacy message 1"},
            {"role": "model", "content": "Legacy response 1"}
        ]
        self.filename = "legacy_test.json"
    
    def tearDown(self):
        """Clean up after each test method."""
        import shutil
        shutil.rmtree(self.temp_dir)
        # Clean up any files created in current directory
        if os.path.exists(self.filename):
            os.remove(self.filename)
    
    @patch('chat_manager_refactored.Path.cwd')
    def test_save_chat_legacy_compatibility(self, mock_cwd):
        """Test legacy save_chat function."""
        # Arrange
        mock_cwd.return_value = Path(self.temp_dir)
        
        # Act
        result = save_chat(self.legacy_chat, self.filename)
        
        # Assert
        self.assertTrue(result)
        self.assertTrue((Path(self.temp_dir) / self.filename).exists())
    
    @patch('chat_manager_refactored.Path.cwd')
    def test_load_chat_legacy_compatibility(self, mock_cwd):
        """Test legacy load_chat function."""
        # Arrange
        mock_cwd.return_value = Path(self.temp_dir)
        save_chat(self.legacy_chat, self.filename)
        
        # Act
        result = load_chat(self.filename)
        
        # Assert
        self.assertEqual(len(result), 2)
        self.assertEqual(result[0]["role"], "user")
        self.assertEqual(result[0]["content"], "Legacy message 1")
        self.assertEqual(result[1]["role"], "model")
        self.assertEqual(result[1]["content"], "Legacy response 1")
    
    def test_legacy_roundtrip(self):
        """Test legacy save and load roundtrip."""
        # Act
        save_chat(self.legacy_chat, self.filename)
        loaded_data = load_chat(self.filename)
        
        # Assert
        self.assertEqual(loaded_data, self.legacy_chat)


if __name__ == '__main__':
    unittest.main()