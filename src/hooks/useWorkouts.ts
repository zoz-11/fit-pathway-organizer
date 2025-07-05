
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuthProvider';

export const useScheduledWorkouts = (userId?: string) => {
  return useQuery({
    queryKey: ['scheduledWorkouts', userId],
    queryFn: async () => {
      if (!userId) return [];
      
      console.log('Fetching scheduled workouts for user:', userId);
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
        console.error('Error fetching scheduled workouts:', error);
        throw error;
      }

      console.log('Fetched scheduled workouts:', data);
      return data ?? [];
    },
    enabled: !!userId,
  });
};

export const useWorkouts = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: workouts, isLoading } = useQuery({
    queryKey: ['workouts', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('workouts') // Assuming a 'workouts' table for templates
        .select('*')
        .eq('trainer_id', user.id);

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const createWorkout = useMutation({
    mutationFn: async (newWorkout: { name: string; description?: string; exercises: Array<{ name: string; sets: number; reps: string }> }) => {
      if (!user) throw new Error("User not authenticated");

      const { data: workout, error } = await supabase
        .from('workouts')
        .insert({
          name: newWorkout.name,
          description: newWorkout.description,
          trainer_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      // Insert exercises
      const exercisesToInsert = newWorkout.exercises.map(ex => ({
        workout_id: workout.id,
        name: ex.name,
        sets: ex.sets,
        reps: ex.reps,
      }));

      const { error: exerciseError } = await supabase
        .from('workout_exercises') // Assuming a 'workout_exercises' table
        .insert(exercisesToInsert);

      if (exerciseError) throw exerciseError;

      return workout;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workouts', user?.id] });
    },
  });

  return { workouts, isLoading, createWorkout };
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
      return data ?? [];
    },
    enabled: !!userId,
  });
};
