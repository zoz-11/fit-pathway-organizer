INSERT INTO public.achievements (name, description, criteria)
VALUES
  ('First Workout Completed', 'Complete your very first assigned workout.', '{"type": "workout_completion", "count": 1}'),
  ('7-Day Streak', 'Complete a workout for 7 consecutive days.', '{"type": "streak", "days": 7}')
ON CONFLICT (name) DO NOTHING;
