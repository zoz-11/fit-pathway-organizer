import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useParams } from "react-router-dom";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, Trophy, Target, Flame, Dumbbell } from "lucide-react";

import { ChatWindow } from "@/components/messages/ChatWindow";

const StatCard = ({ title, value, icon: Icon, description }: {
  title: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
);

const AthleteProgress = () => {
  const { athleteId } = useParams<{ athleteId: string }>();

  const { data: athleteProfile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ['athleteProfile', athleteId],
    queryFn: async () => {
      if (!athleteId) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', athleteId)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!athleteId,
  });

  const { data: assignedWorkouts, isLoading: isLoadingWorkouts } = useQuery({
    queryKey: ['assignedWorkouts', athleteId],
    queryFn: async () => {
      if (!athleteId) return [];
      const { data, error } = await supabase
        .from('workout_assignments')
        .select('*, workout:workouts(*)')
        .eq('athlete_id', athleteId)
        .order('due_date', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!athleteId,
  });

  if (isLoadingProfile || isLoadingWorkouts) {
    return (
      <AppLayout>
        <div className="space-y-6 p-4 md:p-6">
          <Skeleton className="h-10 w-64 mb-4" />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
          </div>
          <Skeleton className="h-64 w-full" />
        </div>
      </AppLayout>
    );
  }

  if (!athleteProfile) {
    return (
      <AppLayout>
        <div className="p-6 text-center">Athlete not found.</div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6 p-4 md:p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{athleteProfile.full_name}'s Progress</h1>
            <p className="text-muted-foreground mt-1">
              Overview of {athleteProfile.full_name}'s fitness journey.
            </p>
          </div>
          <ChatWindow participantId={athleteId} participantName={athleteProfile.full_name} />
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Workouts Completed"
            value={assignedWorkouts?.filter(wa => wa.status === 'completed').length.toString() || "0"}
            icon={Dumbbell}
            description="Total completed workouts"
          />
          <StatCard
            title="Pending Workouts"
            value={assignedWorkouts?.filter(wa => wa.status === 'pending').length.toString() || "0"}
            icon={Calendar}
            description="Workouts yet to be done"
          />
          <StatCard
            title="Goals Achieved"
            value="N/A"
            icon={Target}
            description="(Feature coming soon)"
          />
          <StatCard
            title="Current Streak"
            value="N/A"
            icon={Flame}
            description="(Feature coming soon)"
          />
        </div>

        {/* Recent Workouts */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Workout History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {assignedWorkouts && assignedWorkouts.length > 0 ? (
                assignedWorkouts.map((assignment) => (
                  <div key={assignment.id} className="flex items-center justify-between p-3 rounded-lg border">
                    <div>
                      <p className="font-medium">{assignment.workout.name}</p>
                      <p className="text-sm text-muted-foreground">Due: {new Date(assignment.due_date).toLocaleDateString()}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      assignment.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {assignment.status}
                    </span>
                  </div>
                ))
              ) : (
                <p>No workout history available for this athlete.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default AthleteProgress;