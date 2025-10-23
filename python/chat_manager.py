import json
import os

def save_chat(chat_history, filename="chat_history.json"):
    """
    Saves the chat history to a JSON file.
    :param chat_history: A list of dictionaries, where each dictionary represents a message.
    :param filename: The name of the file to save the chat history to.
    """
    try:
        # Ensure the directory exists
        os.makedirs(os.path.dirname(filename) or '.', exist_ok=True)
        
        with open(filename, 'w') as f:
            json.dump(chat_history, f, indent=4)
        print(f"Chat history saved to {filename}")
    except IOError as e:
        print(f"Error saving chat history to {filename}: {e}")

def load_chat(filename="chat_history.json"):
    """
    Loads chat history from a JSON file.
    :param filename: The name of the file to load the chat history from.
    :return: A list of dictionaries representing the chat history, or an empty list if the file doesn't exist or is empty.
    """
    if not os.path.exists(filename):
        print(f"No chat history found at {filename}. Starting a new chat.")
        return []
    
    try:
        with open(filename, 'r') as f:
            chat_history = json.load(f)
        
        # Validate that chat_history is a list
        if not isinstance(chat_history, list):
            print(f"Error: Invalid chat history format in {filename}. Expected a list.")
            return []
            
        print(f"Chat history loaded from {filename}.")
        return chat_history
    except json.JSONDecodeError:
        print(f"Error decoding JSON from {filename}. File might be corrupted or empty. Starting a new chat.")
        return []
    except IOError as e:
        print(f"Error loading chat history from {filename}: {e}")
        return []

if __name__ == "__main__":
    # Example Usage:
    # To save the current chat (you would replace this with the actual chat content)
    current_chat = [
        {"role": "user", "content": "Hello!"},
        {"role": "model", "content": "Hi there!"}
    ]
    save_chat(current_chat, "my_project_chat.json")

    # To load a chat
    loaded_chat = load_chat("my_project_chat.json")
    print("\nLoaded Chat:")
    for message in loaded_chat:
        print(f"{message['role']}: {message['content']}")
