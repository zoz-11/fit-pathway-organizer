import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuthProvider';

// Temporary mock data until achievement tables are created
const mockAchievements = [
  { id: '1', name: 'First Workout', description: 'Complete your first workout', icon: '🏋️' },
  { id: '2', name: 'Week Warrior', description: 'Complete 7 workouts in a week', icon: '🔥' },
  { id: '3', name: 'Strength Builder', description: 'Complete 10 strength workouts', icon: '💪' },
  { id: '4', name: 'Consistency King', description: 'Work out for 30 days straight', icon: '👑' },
];

export const useAchievements = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: allAchievements, isLoading: isLoadingAllAchievements } = useQuery({
    queryKey: ['allAchievements'],
    queryFn: async () => {
      // Return mock data for now since achievements system is not required
      return mockAchievements;
    },
  });

  const { data: userAchievements, isLoading: isLoadingUserAchievements } = useQuery({
    queryKey: ['userAchievements', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      // Return mock data - first 2 achievements as "awarded"
      return mockAchievements.slice(0, 2).map(achievement => ({
        id: `user_${achievement.id}`,
        user_id: user.id,
        achievement_id: achievement.id,
        awarded_at: new Date().toISOString(),
        achievement
      }));
    },
    enabled: !!user,
  });

  const awardAchievement = useMutation({
    mutationFn: async (achievementName: string) => {
      if (!user) throw new Error("User not authenticated");

      // Mock achievement awarding for now
      console.log(`Achievement awarded: ${achievementName}`);

      // Check if already awarded
      // const { data: existingAward, error: existingError } = await supabase
      //   .from('user_achievements')
      //   .select('id')
      //   .eq('user_id', user.id)
      //   .eq('achievement_id', achievement.id)
      //   .single();
      // if (existingError && existingError.code !== 'PGRST116') {
      //   throw existingError;
      // }
      // if (existingAward) {
      //   throw new Error('Achievement already awarded');
      // }

      // Award the achievement
      // const { error: awardError } = await supabase
      //   .from('user_achievements')
      //   .insert({
      //     user_id: user.id,
      //     achievement_id: achievement.id,
      //     awarded_at: new Date().toISOString(),
      //   });
      // if (awardError) throw awardError;

      // For now, just log the achievement
      console.log(`Achievement "${achievementName}" would be awarded to user ${user.id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userAchievements', user?.id] });
    },
  });

  return {
    allAchievements,
    isLoadingAllAchievements,
    userAchievements,
    isLoadingUserAchievements,
    awardAchievement,
  };
};
