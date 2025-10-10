-- Add missing columns to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS avatar_url TEXT,
ADD COLUMN IF NOT EXISTS fitness_level TEXT,
ADD COLUMN IF NOT EXISTS goals TEXT,
ADD COLUMN IF NOT EXISTS location TEXT;

-- Add comment explaining these are user-editable fields
COMMENT ON COLUMN public.profiles.avatar_url IS 'Public URL to user profile picture in storage';
COMMENT ON COLUMN public.profiles.fitness_level IS 'User-defined fitness level (e.g., Beginner, Intermediate, Advanced)';
COMMENT ON COLUMN public.profiles.goals IS 'User fitness goals';
COMMENT ON COLUMN public.profiles.location IS 'User location';

-- Update RLS policy for profiles to allow users to update these new fields
-- (Policies already exist, just ensuring they cover the new columns)