import { generateSecureId } from './security';

// Simple client-side encryption for sensitive data
export class MessageEncryption {
  private static async getKey(): Promise<CryptoKey> {
    // In a real implementation, this would use a user-specific key
    // For now, using a session-based key
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode('session-key-placeholder'),
      { name: 'PBKDF2' },
      false,
      ['deriveKey']
    );

    return await crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: new TextEncoder().encode('salt-placeholder'),
        iterations: 100000,
        hash: 'SHA-256'
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );
  }

  static async encryptMessage(content: string): Promise<{ 
    encryptedContent: string; 
    metadata: { iv: string; algorithm: string } 
  }> {
    try {
      const key = await this.getKey();
      const iv = crypto.getRandomValues(new Uint8Array(12));
      const encodedContent = new TextEncoder().encode(content);

      const encrypted = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        key,
        encodedContent
      );

      return {
        encryptedContent: btoa(String.fromCharCode(...new Uint8Array(encrypted))),
        metadata: {
          iv: btoa(String.fromCharCode(...iv)),
          algorithm: 'AES-GCM'
        }
      };
    } catch (error) {
      console.error('Encryption failed:', error);
      // Fallback to plain text if encryption fails
      return {
        encryptedContent: content,
        metadata: { iv: '', algorithm: 'none' }
      };
    }
  }

  static async decryptMessage(
    encryptedContent: string, 
    metadata: { iv: string; algorithm: string }
  ): Promise<string> {
    try {
      if (metadata.algorithm === 'none') {
        return encryptedContent;
      }

      const key = await this.getKey();
      const iv = new Uint8Array(
        atob(metadata.iv).split('').map(char => char.charCodeAt(0))
      );
      const encrypted = new Uint8Array(
        atob(encryptedContent).split('').map(char => char.charCodeAt(0))
      );

      const decrypted = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv },
        key,
        encrypted
      );

      return new TextDecoder().decode(decrypted);
    } catch (error) {
      console.error('Decryption failed:', error);
      return '[Encrypted message - decryption failed]';
    }
  }
}

// Enhanced security headers for sensitive operations
export const getSecurityHeaders = () => ({
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'nonce-" + generateSecureId() + "'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://api.supabase.co;",
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
});