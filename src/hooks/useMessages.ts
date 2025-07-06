import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuthProvider';

export const useMessages = (participantId?: string) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: messages, isLoading } = useQuery({
    queryKey: ['messages', user?.id, participantId],
    queryFn: async () => {
      if (!user || !participantId) return [];

      const { data, error } = await supabase
        .from('messages')
        .select('*, sender:profiles!sender_id(full_name), recipient:profiles!recipient_id(full_name)')
        .or(`and(sender_id.eq.${user.id},recipient_id.eq.${participantId}),and(sender_id.eq.${participantId},recipient_id.eq.${user.id})`)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data;
    },
    enabled: !!user && !!participantId,
  });

  const sendMessage = useMutation({
    mutationFn: async ({ recipientId, content }: { recipientId: string; content: string }) => {
      if (!user) throw new Error("User not authenticated");

      const { error } = await supabase
        .from('messages')
        .insert({
          sender_id: user.id,
          recipient_id: recipientId,
          content,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages', user?.id, participantId] });
    },
  });

  return { messages, isLoading, sendMessage };
};