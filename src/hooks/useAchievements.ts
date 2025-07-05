import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuthProvider';

export const useAchievements = () => {
  const { user } = useAuth();
  
  // Temporarily disabled - database tables don't exist yet
  const allAchievements = [];
  const userAchievements = [];
  const isLoadingAllAchievements = false;
  const isLoadingUserAchievements = false;
  
  const awardAchievement = {
    mutate: () => {
      console.log('Achievement system temporarily disabled');
    }
  };

  return { 
    allAchievements, 
    isLoadingAllAchievements, 
    userAchievements, 
    isLoadingUserAchievements, 
    awardAchievement 
  };
};