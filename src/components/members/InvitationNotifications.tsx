import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuthProvider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from "sonner";
import { handleApiError } from "@/lib/utils";

const useInvitations = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: invitations, isLoading } = useQuery({
    queryKey: ['invitations', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('trainer_athletes')
        .select('*, trainer:profiles!trainer_id(*)')
        .eq('athlete_id', user.id)
        .eq('status', 'pending');

      if (error) {
        handleApiError(error, `Failed to fetch invitations`);
        throw error;
      }
      return data;
    },
    enabled: !!user,
  });

  const updateInvitation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: 'accepted' | 'declined' }) => {
      const { error } = await supabase
        .from('trainer_athletes')
        .update({ status })
        .eq('id', id);

      if (error) {
        handleApiError(error, `Failed to update invitation`);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invitations', user?.id] });
    },
  });

  return { invitations, isLoading, updateInvitation };
};

export const InvitationNotifications = () => {
  const { invitations, isLoading, updateInvitation } = useInvitations();

  if (isLoading || !invitations || invitations.length === 0) {
    return null;
  }

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>Invitations</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {invitations.map((invitation) => (
          <div key={invitation.id} className="flex items-center justify-between">
            <p>You have an invitation from {invitation.trainer.full_name}</p>
            <div className="space-x-2">
              <Button size="default" onClick={() => updateInvitation.mutate({ id: invitation.id, status: 'accepted' })}>Accept</Button>
              <Button variant="outline" size="default" onClick={() => updateInvitation.mutate({ id: invitation.id, status: 'declined' })}>Decline</Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};