
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useProfile = (userId?: string) => {
  return useQuery({
    queryKey: ['profile', userId],
    queryFn: async () => {
      if (!userId) return null;
      
      console.log('Fetching profile for user:', userId);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching profile:', error);
        throw error;
      }

      console.log('Fetched profile:', data);
      return data;
    },
    enabled: !!userId,
  });
};

export const useTrainerAthletes = (trainerId?: string) => {
  return useQuery({
    queryKey: ['athletes', trainerId],
    queryFn: async () => {
      if (!trainerId) return [];
      
      console.log('Fetching athletes for trainer:', trainerId);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('trainer_id', trainerId)
        .eq('role', 'athlete')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching trainer athletes:', error);
        throw error;
      }

      console.log('Fetched trainer athletes:', data);
      return data || [];
    },
    enabled: !!trainerId,
  });
};
