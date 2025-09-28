-- PHASE 1: Fix RLS policies infinite recursion and create storage bucket
-- Fix infinite recursion in profiles table RLS policies
DROP POLICY IF EXISTS "Trainers can view their athletes" ON public.profiles;

-- Create improved RLS policies without recursion
CREATE POLICY "Trainers can view their athletes" 
ON public.profiles 
FOR SELECT 
USING (
  (get_current_user_role() = 'trainer' AND trainer_id = auth.uid())
);

-- Create storage bucket for avatars
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('avatars', 'avatars', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp'])
ON CONFLICT (id) DO NOTHING;

-- Create RLS policies for avatar storage
CREATE POLICY "Avatar images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own avatar" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own avatar" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Add join_date column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS join_date DATE DEFAULT CURRENT_DATE;

-- Update existing profiles to have join_date
UPDATE public.profiles 
SET join_date = CURRENT_DATE 
WHERE join_date IS NULL;