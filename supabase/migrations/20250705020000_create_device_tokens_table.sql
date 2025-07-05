CREATE TABLE device_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE device_tokens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert their own device tokens." ON device_tokens
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can select their own device tokens." ON device_tokens
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own device tokens." ON device_tokens
  FOR DELETE USING (auth.uid() = user_id);
