
-- Create goal_type enum
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'goal_type') THEN
    CREATE TYPE public.goal_type AS ENUM ('weight', 'strength', 'cardio', 'nutrition', 'other');
  END IF;
END $$;

-- Create goal_status enum
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'goal_status') THEN
    CREATE TYPE public.goal_status AS ENUM ('active', 'completed', 'abandoned');
  END IF;
END $$;

-- Create goals table
CREATE TABLE IF NOT EXISTS public.goals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  goal_type public.goal_type NOT NULL,
  target_value DECIMAL(10, 2),
  target_date DATE,
  description TEXT,
  status public.goal_status NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for goals table
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;

-- Policies for goals table
CREATE POLICY "Users can view their own goals" ON public.goals
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create goals" ON public.goals
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own goals" ON public.goals
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own goals" ON public.goals
  FOR DELETE USING (auth.uid() = user_id);
