import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuthProvider';

export const useAchievements = () => {
  const { user } = useAuth();

  return { allAchievements, isLoadingAllAchievements, userAchievements, isLoadingUserAchievements, awardAchievement };
};
