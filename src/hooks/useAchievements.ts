import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export const useAchievements = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: allAchievements, isLoading: isLoadingAllAchievements } = useQuery({
    queryKey: ['allAchievements'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('achievements')
        .select('*');
      if (error) throw error;
      return data;
    },
  });

  const { data: userAchievements, isLoading: isLoadingUserAchievements } = useQuery({
    queryKey: ['userAchievements', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('user_achievements')
        .select('*, achievement:achievements(*)')
        .eq('user_id', user.id);
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const awardAchievement = useMutation({
    mutationFn: async (achievementName: string) => {
      if (!user) throw new Error("User not authenticated");

      // Find the achievement ID
      const { data: achievement, error: fetchError } = await supabase
        .from('achievements')
        .select('id')
        .eq('name', achievementName)
        .single();

      if (fetchError || !achievement) {
        throw new Error(`Achievement '${achievementName}' not found.`);
      }

      // Check if already awarded
      const { data: existingAward, error: existingError } = await supabase
        .from('user_achievements')
        .select('id')
        .eq('user_id', user.id)
        .eq('achievement_id', achievement.id)
        .single();

      if (existingError && existingError.code !== 'PGRST116') { // PGRST116 means no rows found
        throw existingError;
      }

      if (existingAward) {
        console.log(`Achievement '${achievementName}' already awarded to user ${user.id}`);
        return; // Already awarded, do nothing
      }

      // Award the achievement
      const { error: awardError } = await supabase
        .from('user_achievements')
        .insert({
          user_id: user.id,
          achievement_id: achievement.id,
        });

      if (awardError) throw awardError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userAchievements', user?.id] });
    },
  });

  return { allAchievements, isLoadingAllAchievements, userAchievements, isLoadingUserAchievements, awardAchievement };
};