import { generateSecureId } from "./security";
import { supabase } from "@/integrations/supabase/client";

// Secure client-side encryption for sensitive data
export class MessageEncryption {
  // Version 1: Secure encryption with user-specific keys
  private static async getSecureKey(userId: string): Promise<CryptoKey> {
    try {
      // Get or create user-specific salt
      const { data: keyData, error } = await supabase
        .from("user_encryption_keys")
        .select("salt")
        .eq("user_id", userId)
        .eq("key_version", 1)
        .single();

      let salt: string;

      if (error || !keyData) {
        // Generate new secure salt for user
        const saltArray = crypto.getRandomValues(new Uint8Array(32));
        salt = btoa(String.fromCharCode(...saltArray));

        // Store in database
        await supabase.from("user_encryption_keys").insert({
          user_id: userId,
          salt: salt,
          key_version: 1,
        });
      } else {
        salt = keyData.salt;
      }

      // Derive key from user session + salt
      const sessionKey = await this.getSessionKey();
      const keyMaterial = await crypto.subtle.importKey(
        "raw",
        new TextEncoder().encode(sessionKey + userId),
        { name: "PBKDF2" },
        false,
        ["deriveKey"],
      );

      return await crypto.subtle.deriveKey(
        {
          name: "PBKDF2",
          salt: new TextEncoder().encode(salt),
          iterations: 100000,
          hash: "SHA-256",
        },
        keyMaterial,
        { name: "AES-GCM", length: 256 },
        false,
        ["encrypt", "decrypt"],
      );
    } catch (error) {
      console.error("Secure key derivation failed:", error);
      throw new Error("Failed to initialize encryption");
    }
  }

  // Get session-based key material
  private static async getSessionKey(): Promise<string> {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      throw new Error("User not authenticated");
    }
    // Use access token as key material (unique per session)
    return session.access_token;
  }

  // Legacy: Version 0 encryption (backward compatibility only)
  private static async getLegacyKey(): Promise<CryptoKey> {
    const keyMaterial = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode("session-key-placeholder"),
      { name: "PBKDF2" },
      false,
      ["deriveKey"],
    );

    return await crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt: new TextEncoder().encode("salt-placeholder"),
        iterations: 100000,
        hash: "SHA-256",
      },
      keyMaterial,
      { name: "AES-GCM", length: 256 },
      false,
      ["encrypt", "decrypt"],
    );
  }

  static async encryptMessage(
    content: string,
    userId?: string
  ): Promise<{
    encryptedContent: string;
    metadata: { iv: string; algorithm: string; version: number };
  }> {
    try {
      // Use secure encryption (version 1) if userId provided
      const key = userId
        ? await this.getSecureKey(userId)
        : await this.getLegacyKey();
      const version = userId ? 1 : 0;

      const iv = crypto.getRandomValues(new Uint8Array(12));
      const encodedContent = new TextEncoder().encode(content);

      const encrypted = await crypto.subtle.encrypt(
        { name: "AES-GCM", iv },
        key,
        encodedContent,
      );

      return {
        encryptedContent: btoa(
          String.fromCharCode(...new Uint8Array(encrypted)),
        ),
        metadata: {
          iv: btoa(String.fromCharCode(...iv)),
          algorithm: "AES-GCM",
          version: version,
        },
      };
    } catch (error) {
      console.error("Encryption failed:", error);
      // Fallback to plain text if encryption fails
      return {
        encryptedContent: content,
        metadata: { iv: "", algorithm: "none", version: 0 },
      };
    }
  }

  static async decryptMessage(
    encryptedContent: string,
    metadata: { iv: string; algorithm: string; version?: number },
    userId?: string
  ): Promise<string> {
    try {
      if (metadata.algorithm === "none") {
        return encryptedContent;
      }

      // Use appropriate key based on encryption version
      const version = metadata.version || 0;
      const key =
        version === 1 && userId
          ? await this.getSecureKey(userId)
          : await this.getLegacyKey();

      const iv = new Uint8Array(
        atob(metadata.iv)
          .split("")
          .map((char) => char.charCodeAt(0)),
      );
      const encrypted = new Uint8Array(
        atob(encryptedContent)
          .split("")
          .map((char) => char.charCodeAt(0)),
      );

      const decrypted = await crypto.subtle.decrypt(
        { name: "AES-GCM", iv },
        key,
        encrypted,
      );

      return new TextDecoder().decode(decrypted);
    } catch (error) {
      console.error("Decryption failed:", error);
      return "[Encrypted message - decryption failed]";
    }
  }
}

// Enhanced security headers for sensitive operations
export const getSecurityHeaders = () => ({
  "Content-Security-Policy":
    "default-src 'self'; script-src 'self' 'nonce-" +
    generateSecureId() +
    "'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://api.supabase.co;",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-XSS-Protection": "1; mode=block",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
});
