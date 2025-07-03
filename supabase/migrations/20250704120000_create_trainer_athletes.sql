CREATE TABLE public.trainer_athletes (
  trainer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  athlete_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (trainer_id, athlete_id)
);

ALTER TABLE public.trainer_athletes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Trainers can manage their own athlete relationships" ON public.trainer_athletes
  FOR ALL
  USING (auth.uid() = trainer_id);

CREATE POLICY "Athletes can view their own trainer relationships" ON public.trainer_athletes
  FOR SELECT
  USING (auth.uid() = athlete_id);
