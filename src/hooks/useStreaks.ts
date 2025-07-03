import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export const useStreaks = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['streaks', user?.id],
    queryFn: async () => {
      if (!user) return { currentStreak: 0, longestStreak: 0 };

      const { data: completedWorkouts, error } = await supabase
        .from('workout_assignments')
        .select('completed_at')
        .eq('athlete_id', user.id)
        .eq('status', 'completed')
        .order('completed_at', { ascending: false });

      if (error) throw error;

      if (!completedWorkouts || completedWorkouts.length === 0) {
        return { currentStreak: 0, longestStreak: 0 };
      }

      let currentStreak = 0;
      let longestStreak = 0;
      let lastDate: Date | null = null;

      // Filter out null completed_at and convert to Date objects
      const dates = completedWorkouts
        .filter(w => w.completed_at !== null)
        .map(w => new Date(w.completed_at!))
        .sort((a, b) => b.getTime() - a.getTime()); // Sort descending

      for (const date of dates) {
        const today = new Date(date.getFullYear(), date.getMonth(), date.getDate());

        if (lastDate === null) {
          currentStreak = 1;
        } else {
          const diffTime = Math.abs(today.getTime() - lastDate.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

          if (diffDays === 1) {
            currentStreak++;
          } else if (diffDays > 1) {
            // Gap in streak, reset if not today or yesterday
            if (today.toDateString() !== new Date().toDateString() && today.toDateString() !== new Date(Date.now() - 86400000).toDateString()) {
              currentStreak = 1;
            }
          }
        }
        longestStreak = Math.max(longestStreak, currentStreak);
        lastDate = today;
      }

      // Adjust current streak if the last workout was not today or yesterday
      const now = new Date();
      const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getUTCDate() - 1);
      const mostRecentWorkoutDate = dates[0];

      if (mostRecentWorkoutDate && mostRecentWorkoutDate.toDateString() !== now.toDateString() && mostRecentWorkoutDate.toDateString() !== yesterday.toDateString()) {
        currentStreak = 0;
      }

      return { currentStreak, longestStreak };
    },
    enabled: !!user,
  });
};