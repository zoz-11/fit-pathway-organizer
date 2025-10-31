// Stub encryption module - encryption functionality disabled
export class MessageEncryption {
  static async encryptMessage(message: string, _userId: string): Promise<string> {
    return message;
  }
  
  static async decryptMessage(encryptedMessage: string, _userId: string): Promise<string> {
    return encryptedMessage;
  }
}

export const encryptMessage = async (message: string, _userId: string): Promise<string> => {
  return message;
};

export const decryptMessage = async (encryptedMessage: string, _userId: string): Promise<string> => {
  return encryptedMessage;
};
