// Simple stub for encryption functionality
export class MessageEncryption {
  static async encryptMessage(content: string): Promise<{
    encryptedContent: string;
    metadata: { iv: string; algorithm: string };
  }> {
    // Return plain text with empty metadata for now
    return {
      encryptedContent: content,
      metadata: { iv: '', algorithm: 'none' }
    };
  }

  static async decryptMessage(
    encryptedContent: string,
    metadata?: { iv: string; algorithm: string }
  ): Promise<string> {
    // Return as-is for now
    return encryptedContent;
  }
}
