
-- Check if the enum types exist and create them if they don't
DO $$ 
BEGIN
  -- Create user_role enum if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
    CREATE TYPE public.user_role AS ENUM ('trainer', 'athlete');
  END IF;
  
  -- Create subscription_status enum if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'subscription_status') THEN
    CREATE TYPE public.subscription_status AS ENUM ('active', 'expired', 'trial', 'cancelled');
  END IF;
  
  -- Create exercise_category enum if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'exercise_category') THEN
    CREATE TYPE public.exercise_category AS ENUM ('cardio', 'strength', 'flexibility', 'sports', 'rehabilitation');
  END IF;
  
  -- Create workout_status enum if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'workout_status') THEN
    CREATE TYPE public.workout_status AS ENUM ('scheduled', 'in_progress', 'completed', 'skipped');
  END IF;
END $$;

-- Ensure the profiles table exists with correct structure
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'athlete',
  subscription_status subscription_status DEFAULT 'trial',
  subscription_expiry DATE,
  phone TEXT,
  date_of_birth DATE,
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  trainer_id UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on profiles if not already enabled
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to recreate them
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Trainers can view their athletes" ON public.profiles;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Trainers can view their athletes" ON public.profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'trainer'
    ) AND trainer_id = auth.uid()
  );

-- Recreate the handle_new_user function to ensure it works correctly
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $
DECLARE
  _full_name TEXT;
  _role public.user_role;
BEGIN
  _full_name := COALESCE(NEW.raw_user_meta_data->>'full_name', 'User');
  _role := COALESCE((NEW.raw_user_meta_data->>'role')::public.user_role, 'athlete');

  -- Validate full_name
  IF _full_name IS NULL OR _full_name = '' THEN
    RAISE EXCEPTION 'Full name cannot be empty.';
  END IF;

  -- Validate role
  IF _role IS NULL OR (_role != 'trainer' AND _role != 'athlete') THEN
    RAISE EXCEPTION 'Invalid role specified. Role must be ''trainer'' or ''athlete''.';
  END IF;

  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    _full_name,
    _role
  );
  RETURN NEW;
END;
$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists and recreate
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
