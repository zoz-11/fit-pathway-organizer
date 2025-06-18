
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useUserWorkouts = (userId?: string) => {
  return useQuery({
    queryKey: ['workouts', userId],
    queryFn: async () => {
      if (!userId) return [];
      
      console.log('Fetching workouts for user:', userId);
      const { data, error } = await supabase
        .from('workout_schedules')
        .select(`
          *,
          workout_exercises (
            *,
            exercises (*)
          )
        `)
        .eq('athlete_id', userId)
        .order('scheduled_date', { ascending: true });

      if (error) {
        console.error('Error fetching workouts:', error);
        throw error;
      }

      console.log('Fetched workouts:', data);
      return data || [];
    },
    enabled: !!userId,
  });
};

export const useTodayWorkouts = (userId?: string) => {
  return useQuery({
    queryKey: ['workouts', 'today', userId],
    queryFn: async () => {
      if (!userId) return [];
      
      const today = new Date().toISOString().split('T')[0];
      console.log('Fetching today workouts for:', userId, 'date:', today);
      
      const { data, error } = await supabase
        .from('workout_schedules')
        .select(`
          *,
          workout_exercises (
            *,
            exercises (*)
          )
        `)
        .eq('athlete_id', userId)
        .eq('scheduled_date', today)
        .order('scheduled_time', { ascending: true });

      if (error) {
        console.error('Error fetching today workouts:', error);
        throw error;
      }

      console.log('Fetched today workouts:', data);
      return data || [];
    },
    enabled: !!userId,
  });
};
