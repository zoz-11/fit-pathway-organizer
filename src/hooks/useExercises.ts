
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useExercises = () => {
  return useQuery({
    queryKey: ['exercises'],
    queryFn: async () => {
      console.log('Fetching exercises from database...');
      const { data, error } = await supabase
        .from('exercises')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching exercises:', error);
        throw error;
      }

      console.log('Fetched exercises:', data);
      return data;
    },
  });
};

export const useExercisesByCategory = (category?: string) => {
  return useQuery({
    queryKey: ['exercises', 'category', category],
    queryFn: async () => {
      console.log('Fetching exercises by category:', category);
      let query = supabase
        .from('exercises')
        .select('*')
        .eq('is_public', true);

      if (category) {
        query = query.eq('category', category);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching exercises by category:', error);
        throw error;
      }

      console.log('Fetched exercises by category:', data);
      return data;
    },
    enabled: !!category,
  });
};
