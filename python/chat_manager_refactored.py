"""
Refactored chat manager with modern Python practices and improved error handling.
"""
import json
import os
import logging
from pathlib import Path
from typing import List, Dict, Any, Optional
from contextlib import contextmanager
from dataclasses import dataclass
from datetime import datetime

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@dataclass
class ChatMessage:
    """Represents a single chat message with validation."""
    role: str
    content: str
    timestamp: Optional[datetime] = None
    
    def __post_init__(self):
        if self.timestamp is None:
            self.timestamp = datetime.now()
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert message to dictionary for JSON serialization."""
        return {
            "role": self.role,
            "content": self.content,
            "timestamp": self.timestamp.isoformat() if self.timestamp else None
        }
    
    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'ChatMessage':
        """Create message from dictionary data."""
        timestamp = None
        if data.get("timestamp"):
            try:
                timestamp = datetime.fromisoformat(data["timestamp"])
            except (ValueError, TypeError):
                logger.warning(f"Invalid timestamp format: {data.get('timestamp')}")
        
        return cls(
            role=data.get("role", ""),
            content=data.get("content", ""),
            timestamp=timestamp
        )


class ChatManager:
    """Manages chat history with improved error handling and validation."""
    
    def __init__(self, base_path: Optional[Path] = None):
        """
        Initialize chat manager.
        
        Args:
            base_path: Base directory for chat files. Defaults to current directory.
        """
        self.base_path = base_path or Path.cwd()
        self.base_path.mkdir(parents=True, exist_ok=True)
    
    @contextmanager
    def _file_operation(self, filename: Path, operation: str):
        """Context manager for file operations with error handling."""
        try:
            yield
        except (IOError, OSError) as e:
            logger.error(f"Error {operation} file {filename}: {e}")
            raise
        except Exception as e:
            logger.error(f"Unexpected error {operation} file {filename}: {e}")
            raise
    
    def save_chat_history(
        self, 
        chat_history: List[ChatMessage], 
        filename: str = "chat_history.json",
        backup: bool = True
    ) -> bool:
        """
        Saves the chat history to a JSON file with validation and optional backup.
        
        Args:
            chat_history: List of ChatMessage objects.
            filename: Name of the file to save the chat history to.
            backup: Whether to create a backup of existing file.
            
        Returns:
            True if successful, False otherwise.
        """
        if not chat_history:
            logger.warning("Empty chat history provided")
            return False
        
        # Validate chat history
        if not all(isinstance(msg, ChatMessage) for msg in chat_history):
            logger.error("Invalid chat history format: expected list of ChatMessage objects")
            return False
        
        file_path = self.base_path / filename
        
        # Create backup if requested and file exists
        if backup and file_path.exists():
            backup_path = file_path.with_suffix(f'.backup_{datetime.now().strftime("%Y%m%d_%H%M%S")}.json')
            try:
                file_path.rename(backup_path)
                logger.info(f"Created backup: {backup_path}")
            except OSError as e:
                logger.error(f"Failed to create backup: {e}")
        
        # Convert to serializable format
        chat_data = [msg.to_dict() for msg in chat_history]
        
        with self._file_operation(file_path, "saving"):
            with open(file_path, 'w', encoding='utf-8') as f:
                json.dump(chat_data, f, indent=2, ensure_ascii=False)
            logger.info(f"Chat history saved to {file_path}")
            return True
        
        return False
    
    def load_chat_history(
        self, 
        filename: str = "chat_history.json",
        validate: bool = True
    ) -> List[ChatMessage]:
        """
        Loads chat history from a JSON file with validation and error recovery.
        
        Args:
            filename: Name of the file to load the chat history from.
            validate: Whether to validate the loaded data.
            
        Returns:
            List of ChatMessage objects, empty list if file doesn't exist or is invalid.
        """
        file_path = self.base_path / filename
        
        if not file_path.exists():
            logger.info(f"No chat history found at {file_path}. Starting new chat.")
            return []
        
        with self._file_operation(file_path, "loading"):
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    chat_data = json.load(f)
                
                # Validate structure
                if not isinstance(chat_data, list):
                    logger.error(f"Invalid chat history format in {file_path}: expected list")
                    return []
                
                # Convert to ChatMessage objects
                messages = []
                for msg_data in chat_data:
                    try:
                        if validate:
                            msg = ChatMessage.from_dict(msg_data)
                        else:
                            # Fallback for legacy format
                            msg = ChatMessage(
                                role=msg_data.get("role", ""),
                                content=msg_data.get("content", "")
                            )
                        messages.append(msg)
                    except (KeyError, TypeError) as e:
                        logger.warning(f"Skipping invalid message: {e}")
                        continue
                
                logger.info(f"Loaded {len(messages)} messages from {file_path}")
                return messages
                
            except json.JSONDecodeError as e:
                logger.error(f"JSON decode error in {file_path}: {e}")
                return []
    
    def append_message(
        self, 
        message: ChatMessage, 
        filename: str = "chat_history.json"
    ) -> bool:
        """
        Append a single message to existing chat history.
        
        Args:
            message: ChatMessage to append.
            filename: Target file name.
            
        Returns:
            True if successful, False otherwise.
        """
        chat_history = self.load_chat_history(filename)
        chat_history.append(message)
        return self.save_chat_history(chat_history, filename, backup=False)
    
    def get_chat_stats(self, filename: str = "chat_history.json") -> Dict[str, Any]:
        """
        Get statistics about a chat history file.
        
        Args:
            filename: Target file name.
            
        Returns:
            Dictionary with chat statistics.
        """
        chat_history = self.load_chat_history(filename)
        
        if not chat_history:
            return {"message_count": 0, "file_exists": False}
        
        role_counts = {}
        for msg in chat_history:
            role = msg.role
            role_counts[role] = role_counts.get(role, 0) + 1
        
        return {
            "message_count": len(chat_history),
            "file_exists": True,
            "role_distribution": role_counts,
            "oldest_message": min(msg.timestamp for msg in chat_history if msg.timestamp),
            "newest_message": max(msg.timestamp for msg in chat_history if msg.timestamp)
        }


# Legacy compatibility functions
def save_chat(chat_history: List[Dict[str, str]], filename: str = "chat_history.json") -> bool:
    """
    Legacy function for backward compatibility.
    Saves chat history in the old format.
    """
    manager = ChatManager()
    
    # Convert legacy format to new format
    messages = []
    for msg_data in chat_history:
        try:
            msg = ChatMessage(role=msg_data["role"], content=msg_data["content"])
            messages.append(msg)
        except KeyError:
            logger.error("Invalid message format in legacy data")
            continue
    
    return manager.save_chat_history(messages, filename)


def load_chat(filename: str = "chat_history.json") -> List[Dict[str, str]]:
    """
    Legacy function for backward compatibility.
    Loads chat history in the old format.
    """
    manager = ChatManager()
    messages = manager.load_chat_history(filename, validate=False)
    
    # Convert back to legacy format
    return [{"role": msg.role, "content": msg.content} for msg in messages]


if __name__ == "__main__":
    # Example usage with new API
    manager = ChatManager()
    
    # Create sample chat
    sample_chat = [
        ChatMessage(role="user", content="Hello!"),
        ChatMessage(role="model", content="Hi there! How can I help you today?")
    ]
    
    # Save chat
    success = manager.save_chat_history(sample_chat, "sample_chat.json")
    print(f"Save successful: {success}")
    
    # Load chat
    loaded_chat = manager.load_chat_history("sample_chat.json")
    print(f"Loaded {len(loaded_chat)} messages")
    
    # Get stats
    stats = manager.get_chat_stats("sample_chat.json")
    print(f"Chat stats: {stats}")
    
    # Legacy compatibility example
    legacy_chat = [
        {"role": "user", "content": "Legacy message 1"},
        {"role": "model", "content": "Legacy response 1"}
    ]
    save_chat(legacy_chat, "legacy_chat.json")
    loaded_legacy = load_chat("legacy_chat.json")
    print(f"Legacy format loaded: {loaded_legacy}")