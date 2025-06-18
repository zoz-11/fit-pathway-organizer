
-- Create enum types for better data integrity
CREATE TYPE public.user_role AS ENUM ('trainer', 'athlete');
CREATE TYPE public.subscription_status AS ENUM ('active', 'expired', 'trial', 'cancelled');
CREATE TYPE public.exercise_category AS ENUM ('cardio', 'strength', 'flexibility', 'sports', 'rehabilitation');
CREATE TYPE public.workout_status AS ENUM ('scheduled', 'in_progress', 'completed', 'skipped');

-- Create profiles table (extends auth.users)
CREATE TABLE public.profiles (
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

-- Create exercises library table
CREATE TABLE public.exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  category exercise_category NOT NULL,
  youtube_link TEXT,
  instructions TEXT[],
  duration_minutes INTEGER,
  difficulty_level INTEGER CHECK (difficulty_level >= 1 AND difficulty_level <= 5),
  equipment_needed TEXT[],
  muscle_groups TEXT[],
  created_by UUID REFERENCES public.profiles(id),
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create workout schedules table
CREATE TABLE public.workout_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  athlete_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  trainer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  scheduled_date DATE NOT NULL,
  scheduled_time TIME,
  status workout_status DEFAULT 'scheduled',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create workout exercises junction table
CREATE TABLE public.workout_exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workout_id UUID NOT NULL REFERENCES public.workout_schedules(id) ON DELETE CASCADE,
  exercise_id UUID NOT NULL REFERENCES public.exercises(id) ON DELETE CASCADE,
  sets INTEGER,
  reps INTEGER,
  duration_minutes INTEGER,
  rest_seconds INTEGER,
  weight_kg DECIMAL(5,2),
  notes TEXT,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create exercise completions table (for tracking progress)
CREATE TABLE public.exercise_completions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  athlete_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  workout_id UUID NOT NULL REFERENCES public.workout_schedules(id) ON DELETE CASCADE,
  exercise_id UUID NOT NULL REFERENCES public.exercises(id) ON DELETE CASCADE,
  completed_sets INTEGER DEFAULT 0,
  completed_reps INTEGER DEFAULT 0,
  completed_duration_minutes INTEGER DEFAULT 0,
  weight_used_kg DECIMAL(5,2),
  difficulty_rating INTEGER CHECK (difficulty_rating >= 1 AND difficulty_rating <= 5),
  notes TEXT,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create messages table for trainer-athlete communication
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  recipient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercise_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

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

-- Create RLS policies for exercises
CREATE POLICY "Everyone can view public exercises" ON public.exercises
  FOR SELECT USING (is_public = true);

CREATE POLICY "Users can view their own exercises" ON public.exercises
  FOR SELECT USING (created_by = auth.uid());

CREATE POLICY "Trainers can create exercises" ON public.exercises
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'trainer'
    )
  );

CREATE POLICY "Users can update their own exercises" ON public.exercises
  FOR UPDATE USING (created_by = auth.uid());

-- Create RLS policies for workout schedules
CREATE POLICY "Athletes can view their own workouts" ON public.workout_schedules
  FOR SELECT USING (athlete_id = auth.uid());

CREATE POLICY "Trainers can view workouts they created" ON public.workout_schedules
  FOR SELECT USING (trainer_id = auth.uid());

CREATE POLICY "Trainers can create workout schedules" ON public.workout_schedules
  FOR INSERT WITH CHECK (trainer_id = auth.uid());

CREATE POLICY "Trainers can update their workout schedules" ON public.workout_schedules
  FOR UPDATE USING (trainer_id = auth.uid());

-- Create RLS policies for workout exercises
CREATE POLICY "Users can view workout exercises if they can view the workout" ON public.workout_exercises
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.workout_schedules 
      WHERE id = workout_id AND (athlete_id = auth.uid() OR trainer_id = auth.uid())
    )
  );

CREATE POLICY "Trainers can manage workout exercises" ON public.workout_exercises
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.workout_schedules 
      WHERE id = workout_id AND trainer_id = auth.uid()
    )
  );

-- Create RLS policies for exercise completions
CREATE POLICY "Athletes can view their own completions" ON public.exercise_completions
  FOR SELECT USING (athlete_id = auth.uid());

CREATE POLICY "Trainers can view their athletes' completions" ON public.exercise_completions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = athlete_id AND trainer_id = auth.uid()
    )
  );

CREATE POLICY "Athletes can create their own completions" ON public.exercise_completions
  FOR INSERT WITH CHECK (athlete_id = auth.uid());

-- Create RLS policies for messages
CREATE POLICY "Users can view messages sent to them" ON public.messages
  FOR SELECT USING (recipient_id = auth.uid() OR sender_id = auth.uid());

CREATE POLICY "Users can send messages" ON public.messages
  FOR INSERT WITH CHECK (sender_id = auth.uid());

CREATE POLICY "Users can update messages they sent" ON public.messages
  FOR UPDATE USING (sender_id = auth.uid());

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'athlete')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert sample data for development
INSERT INTO public.exercises (title, description, category, youtube_link, instructions, duration_minutes, difficulty_level, equipment_needed, muscle_groups, is_public) VALUES
('Push-ups', 'Classic bodyweight exercise for upper body strength', 'strength', 'https://youtube.com/watch?v=example1', ARRAY['Start in plank position', 'Lower body to ground', 'Push back up', 'Repeat'], 10, 2, ARRAY['None'], ARRAY['Chest', 'Triceps', 'Shoulders'], true),
('Running', 'Cardiovascular endurance exercise', 'cardio', 'https://youtube.com/watch?v=example2', ARRAY['Start with light jog', 'Maintain steady pace', 'Focus on breathing', 'Cool down gradually'], 30, 3, ARRAY['Running shoes'], ARRAY['Legs', 'Core', 'Cardiovascular'], true),
('Plank', 'Core strengthening isometric exercise', 'strength', 'https://youtube.com/watch?v=example3', ARRAY['Start in push-up position', 'Hold position', 'Keep body straight', 'Breathe normally'], 5, 2, ARRAY['None'], ARRAY['Core', 'Shoulders'], true),
('Yoga Flow', 'Flexibility and mindfulness practice', 'flexibility', 'https://youtube.com/watch?v=example4', ARRAY['Begin in mountain pose', 'Flow through positions', 'Focus on breathing', 'End in relaxation'], 20, 2, ARRAY['Yoga mat'], ARRAY['Full body'], true),
('Squats', 'Lower body strength exercise', 'strength', 'https://youtube.com/watch?v=example5', ARRAY['Stand with feet shoulder-width apart', 'Lower into sitting position', 'Keep knees behind toes', 'Return to standing'], 15, 3, ARRAY['None'], ARRAY['Quadriceps', 'Glutes', 'Core'], true);

-- Create indexes for better performance
CREATE INDEX idx_profiles_role ON public.profiles(role);
CREATE INDEX idx_profiles_trainer_id ON public.profiles(trainer_id);
CREATE INDEX idx_exercises_category ON public.exercises(category);
CREATE INDEX idx_workout_schedules_athlete_id ON public.workout_schedules(athlete_id);
CREATE INDEX idx_workout_schedules_trainer_id ON public.workout_schedules(trainer_id);
CREATE INDEX idx_workout_schedules_scheduled_date ON public.workout_schedules(scheduled_date);
CREATE INDEX idx_messages_recipient_id ON public.messages(recipient_id);
CREATE INDEX idx_messages_sender_id ON public.messages(sender_id);
