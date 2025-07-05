import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuthProvider';
import { useAchievements } from './useAchievements';

export const useWorkoutAssignments = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { awardAchievement } = useAchievements();

  const { data: assignments, isLoading } = useQuery({
    queryKey: ['workout-assignments', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('workout_schedules')
        .select('*, athlete:profiles!athlete_id(*)')
        .eq('trainer_id', user.id);

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const assignWorkout = useMutation({
    mutationFn: async ({ workoutId, athleteId, dueDate }: { workoutId: number; athleteId: string; dueDate: string }) => {
      const { error } = await supabase
        .from('workout_schedules')
        .insert([{ athlete_id: athleteId, trainer_id: user.id, scheduled_date: dueDate, title: `Workout ${workoutId}` }]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workout-assignments', user?.id] });
    },
  });

  const markAsComplete = useMutation({
    mutationFn: async (assignmentId: string) => {
      const { error } = await supabase
        .from('workout_schedules')
        .update({ status: 'completed' })
        .eq('id', assignmentId);

      if (error) throw error;

      // Check for "First Workout Completed" achievement
      const { data: completedWorkoutsCount, error: countError } = await supabase
        .from('workout_schedules')
        .select('id', { count: 'exact' })
        .eq('athlete_id', user.id)
        .eq('status', 'completed');

      if (countError) {
        console.error("Error counting completed workouts:", countError);
      } else if (completedWorkoutsCount && completedWorkoutsCount.length === 1) {
        awardAchievement.mutate('First Workout Completed');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workout-assignments', user?.id] });
    },
  });

  return { assignments, isLoading, assignWorkout, markAsComplete };
};