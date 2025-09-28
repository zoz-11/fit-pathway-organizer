import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { MessageInputSchema } from '@/lib/security';
import { MessageEncryption } from '@/lib/encryption';
import { SecurityAlert } from '@/components/ui/SecurityAlert';
import { Send, Shield } from 'lucide-react';
import { z } from 'zod';

interface SecureMessageInputProps {
  recipientId: string;
  onSendMessage: (content: string, encryptedMetadata?: any) => Promise<void>;
  disabled?: boolean;
}

export const SecureMessageInput: React.FC<SecureMessageInputProps> = ({
  recipientId,
  onSendMessage,
  disabled = false
}) => {
  const [content, setContent] = useState('');
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [useEncryption, setUseEncryption] = useState(true);

  const handleSend = async () => {
    setError(null);
    
    try {
      // Validate input
      const validatedData = MessageInputSchema.parse({
        content,
        recipient: recipientId
      });

      setIsEncrypting(true);

      let finalContent = validatedData.content;
      let encryptedMetadata = {};

      if (useEncryption) {
        const encrypted = await MessageEncryption.encryptMessage(validatedData.content);
        finalContent = encrypted.encryptedContent;
        encryptedMetadata = encrypted.metadata;
      }

      await onSendMessage(finalContent, encryptedMetadata);
      setContent('');
    } catch (error) {
      if (error instanceof z.ZodError) {
        setError(error.errors[0].message);
      } else {
        setError('Failed to send message. Please try again.');
      }
    } finally {
      setIsEncrypting(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (content.trim() && !disabled && !isEncrypting) {
        handleSend();
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={useEncryption}
            onChange={(e) => setUseEncryption(e.target.checked)}
            className="rounded"
          />
          <Shield className="h-4 w-4" />
          Encrypt message
        </label>
      </div>

      <div className="relative">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          maxLength={1000}
          disabled={disabled || isEncrypting}
          className="min-h-[100px] pr-12"
        />
        <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
          {content.length}/1000
        </div>
      </div>

      {error && (
        <SecurityAlert level="error" message={error} />
      )}

      <Button
        onClick={handleSend}
        disabled={!content.trim() || disabled || isEncrypting}
        className="w-full"
      >
        {isEncrypting ? (
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" />
            {useEncryption ? 'Encrypting...' : 'Sending...'}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Send className="h-4 w-4" />
            Send Message
          </div>
        )}
      </Button>
    </div>
  );
};

export default SecureMessageInput;