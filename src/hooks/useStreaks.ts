import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuthProvider';

// Helper functions for date comparisons
const isSameDay = (d1: Date, d2: Date) =>
  d1.getFullYear() === d2.getFullYear() &&
  d1.getMonth() === d2.getMonth() &&
  d1.getDate() === d2.getDate();

const isYesterday = (d1: Date, d2: Date) => {
  const yesterday = new Date(d2);
  yesterday.setDate(d2.getDate() - 1);
  return isSameDay(d1, yesterday);
};

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

      // Filter out null completed_at and convert to Date objects
      const dates = completedWorkouts
        .filter(w => w.completed_at !== null)
        .map(w => new Date(w.completed_at))
        .sort((a, b) => b.getTime() - a.getTime()); // Sort descending

      let currentStreak = 0;
      let longestStreak = 0;
      let lastProcessedDate: Date | null = null;
      const today = new Date(); // Get today's date once

      for (const date of dates) {
        // Normalize date to start of day for accurate comparison
        const normalizedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

        if (lastProcessedDate === null) {
          // First date, start a streak
          currentStreak = 1;
        } else {
          if (isSameDay(normalizedDate, lastProcessedDate)) {
            // Same day, do nothing (already counted)
            continue;
          } else if (isYesterday(normalizedDate, lastProcessedDate)) {
            // Consecutive day
            currentStreak++;
          } else {
            // Gap of more than one day, reset streak
            currentStreak = 1;
          }
        }
        longestStreak = Math.max(longestStreak, currentStreak);
        lastProcessedDate = normalizedDate;
      }

      // Final adjustment for current streak based on today's date
      if (dates.length > 0) {
        const mostRecentWorkoutDate = new Date(dates[0].getFullYear(), dates[0].getMonth(), dates[0].getDate());
        if (!isSameDay(mostRecentWorkoutDate, today) && !isYesterday(mostRecentWorkoutDate, today)) {
          currentStreak = 0;
        }
      }

      return { currentStreak, longestStreak };
    },
    enabled: !!user,
  });
};