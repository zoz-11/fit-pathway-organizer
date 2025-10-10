import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export type UserRole = 'admin' | 'trainer' | 'athlete';

export const useUserRole = (userId?: string) => {
  return useQuery({
    queryKey: ['user-role', userId],
    queryFn: async () => {
      if (!userId) return null;
      
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching user role:', error);
        throw error;
      }

      return data?.role as UserRole | null;
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
