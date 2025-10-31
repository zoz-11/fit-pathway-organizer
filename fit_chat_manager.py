import json
import os
import argparse

DEFAULT_FILENAME = "fit_chat_history.json"

def save_chat(chat_content_str, filename=DEFAULT_FILENAME):
    """
    Saves the chat history (provided as a JSON string) to a file.
    :param chat_content_str: A JSON string representing the chat history.
    :param filename: The name of the file to save the chat history to.
    """
    try:
        chat_history = json.loads(chat_content_str)
    except json.JSONDecodeError:
        print("Error: Invalid JSON format for chat content. Please provide a valid JSON string.")
        return

    try:
        # Ensure the directory exists
        os.makedirs(os.path.dirname(filename) or '.', exist_ok=True)
        
        with open(filename, 'w') as f:
            json.dump(chat_history, f, indent=4)
        print(f"Chat history saved to {filename}")
    except IOError as e:
        print(f"Error saving chat history to {filename}: {e}")

def load_chat(filename=DEFAULT_FILENAME):
    """
    Loads chat history from a JSON file and prints it.
    :param filename: The name of the file to load the chat history from.
    """
    if not os.path.exists(filename):
        print(f"No chat history found at {filename}.")
        return
    
    try:
        with open(filename, 'r') as f:
            chat_history = json.load(f)
        print(f"Chat history loaded from {filename}:\n")
        for message in chat_history:
            print(f"{message.get('role', 'unknown')}: {message.get('content', '')}")
    except json.JSONDecodeError:
        print(f"Error decoding JSON from {filename}. File might be corrupted or empty.")
    except IOError as e:
        print(f"Error loading chat history from {filename}: {e}")

def main():
    parser = argparse.ArgumentParser(description="Manage FitPathway chat history.")
    parser.add_argument('--save', metavar='CHAT_CONTENT', help='Save chat history. Provide chat content as a JSON string.')
    parser.add_argument('--load', action='store_true', help='Load and display chat history.')
    parser.add_argument('--file', default=DEFAULT_FILENAME, help=f'Specify a filename (default: {DEFAULT_FILENAME}).')

    args = parser.parse_args()

    if args.save:
        save_chat(args.save, args.file)
    elif args.load:
        load_chat(args.file)
    else:
        parser.print_help()

if __name__ == "__main__":
    main()
