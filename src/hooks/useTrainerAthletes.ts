import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuthProvider';

export const useTrainerAthletes = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: athletes, isLoading } = useQuery({
    queryKey: ['trainer-athletes', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('trainer_athletes')
        .select(`
          status,
          profiles!trainer_athletes_athlete_id_fkey (*)
        `)
        .eq('trainer_id', user.id);

      if (error) throw error;
      return data?.map(item => item.profiles).filter(Boolean) || [];
    },
    enabled: !!user,
  });

  const inviteAthlete = useMutation({
    mutationFn: async (athleteEmail: string) => {
      if (!user) throw new Error("User not authenticated");
      
      // 1. Find the user with the given email.
      const { data: athlete, error: fetchError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', athleteEmail)
        .single();

      if (fetchError || !athlete) {
        throw new Error("Athlete not found.");
      }

      // 2. Create an invitation record.
      const { error: insertError } = await supabase
        .from('trainer_athletes')
        .insert([{ trainer_id: user.id, athlete_id: athlete.id, status: 'pending' }]);

      if (insertError) {
        throw insertError;
      }

      // 3. Send an email notification.
      const { data: trainerProfile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user.id)
        .single();

      if (trainerProfile) {
        await supabase.functions.invoke('send-notification-email', {
          body: {
            to: athleteEmail,
            type: 'invitation',
            data: {
              trainerName: trainerProfile.full_name,
            },
          },
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trainer-athletes', user?.id] });
    },
  });

  const removeAthlete = useMutation({
    mutationFn: async (athleteId: string) => {
      if (!user) throw new Error("User not authenticated");
      
      const { error } = await supabase
        .from('trainer_athletes')
        .delete()
        .eq('trainer_id', user.id)
        .eq('athlete_id', athleteId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trainer-athletes', user?.id] });
    },
  });

  return { athletes, isLoading, inviteAthlete, removeAthlete };
};