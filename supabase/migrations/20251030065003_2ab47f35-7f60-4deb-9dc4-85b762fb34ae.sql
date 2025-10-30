-- Create user encryption keys table for secure message encryption
CREATE TABLE IF NOT EXISTS public.user_encryption_keys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  salt text NOT NULL,
  key_version integer NOT NULL DEFAULT 1,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id, key_version)
);

-- Enable RLS
ALTER TABLE public.user_encryption_keys ENABLE ROW LEVEL SECURITY;

-- Users can only read their own encryption keys
CREATE POLICY "Users can view their own encryption keys"
ON public.user_encryption_keys
FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own encryption keys
CREATE POLICY "Users can insert their own encryption keys"
ON public.user_encryption_keys
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Create index for faster lookups
CREATE INDEX idx_user_encryption_keys_user_id ON public.user_encryption_keys(user_id);
CREATE INDEX idx_user_encryption_keys_user_version ON public.user_encryption_keys(user_id, key_version);

-- Add trigger for updated_at
CREATE TRIGGER update_user_encryption_keys_updated_at
BEFORE UPDATE ON public.user_encryption_keys
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add key_version to messages table for migration support
ALTER TABLE public.messages 
ADD COLUMN IF NOT EXISTS encryption_version integer DEFAULT 0;

COMMENT ON TABLE public.user_encryption_keys IS 'Stores user-specific encryption salts for secure message encryption';
COMMENT ON COLUMN public.messages.encryption_version IS '0 = legacy (hardcoded keys), 1+ = secure key derivation';