ALTER TABLE public.trainer_athletes
ADD COLUMN status TEXT NOT NULL DEFAULT 'pending';

-- Add a check constraint to ensure the status is one of the allowed values
ALTER TABLE public.trainer_athletes
ADD CONSTRAINT valid_status CHECK (status IN ('pending', 'accepted'));
