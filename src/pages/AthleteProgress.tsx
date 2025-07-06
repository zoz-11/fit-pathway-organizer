import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, Target, Flame, Dumbbell } from "lucide-react";
import { handleApiError } from "@/lib/utils";
import { ChatWindow } from "@/components/messages/ChatWindow";
import { Badge } from "@/components/ui/badge";

// --- Type Definitions for API data ---
type AthleteProfile = {
  id: string;
  full_name: string | null;
  email: string | null;
  // Add any other profile fields you expect
};

type Workout = {
  id: string;
  title: string;
  status: "scheduled" | "in_progress" | "completed" | "skipped";
  scheduled_date: string;
};

// --- Reusable Stat Card Component ---
const StatCard = ({
  title,
  value,
  icon: Icon,
  description,
  isLoading = false,
}: {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  isLoading?: boolean;
}) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      {isLoading ? (
        <Skeleton className="h-8 w-1/3" />
      ) : (
        <div className="text-2xl font-bold">{value}</div>
      )}
      <p className="text-xs text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
);

// --- Main Athlete Progress Page Component ---
const AthleteProgress = () => {
  const { athleteId } = useParams<{ athleteId: string }>();

  // Query for the athlete's profile information
  const { data: athleteProfile, isLoading: isLoadingProfile } =
    useQuery<AthleteProfile | null>({
      queryKey: ["athleteProfile", athleteId],
      queryFn: async () => {
        if (!athleteId) return null;
        const { data, error } = await supabase
          .from("profiles")
          .select("id, full_name, email")
          .eq("id", athleteId)
          .single();
        if (error) {
          handleApiError(error, `Failed to load athlete profile`);
          return null;
        }
        return data;
      },
      enabled: !!athleteId,
    });

  // Query for the athlete's assigned workouts from the correct table
  const { data: assignedWorkouts, isLoading: isLoadingWorkouts } = useQuery<
    Workout[]
  >({
    queryKey: ["assignedWorkoutsForAthlete", athleteId],
    queryFn: async () => {
      if (!athleteId) return [];
      const { data, error } = await supabase
        .from("workout_schedules") // Corrected table name
        .select("id, title, status, scheduled_date")
        .eq("athlete_id", athleteId)
        .order("scheduled_date", { ascending: false });
      if (error) {
        handleApiError(error, `Failed to load assigned workouts`);
        throw error;
      }
      return data || [];
    },
    enabled: !!athleteId,
  });

  const isLoading = isLoadingProfile || isLoadingWorkouts;

  // Calculate stats safely
  const completedCount =
    assignedWorkouts?.filter((w) => w.status === "completed").length ?? 0;
  const scheduledCount =
    assignedWorkouts?.filter(
      (w) => w.status === "scheduled" || w.status === "in_progress",
    ).length ?? 0;

  if (isLoading) {
    return (
      <AppLayout>
        <div className="space-y-6 p-4 md:p-6">
          <Skeleton className="h-10 w-64 mb-4" />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Skeleton className="h-28" />
            <Skeleton className="h-28" />
            <Skeleton className="h-28" />
            <Skeleton className="h-28" />
          </div>
          <Skeleton className="h-96 w-full" />
        </div>
      </AppLayout>
    );
  }

  if (!athleteProfile) {
    return (
      <AppLayout>
        <div className="p-6 text-center text-muted-foreground">
          Athlete profile could not be loaded or was not found.
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6 p-4 md:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              {athleteProfile.full_name || "Athlete"}'s Progress
            </h1>
            <p className="text-muted-foreground mt-1">
              An overview of their fitness journey and recent activity.
            </p>
          </div>
          {athleteId && athleteProfile.full_name && (
            <ChatWindow
              participantId={athleteId}
              participantName={athleteProfile.full_name}
            />
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Workouts Completed"
            value={completedCount}
            icon={Dumbbell}
            description="Total completed workouts"
          />
          <StatCard
            title="Upcoming Workouts"
            value={scheduledCount}
            icon={Calendar}
            description="Workouts yet to be done"
          />
          <StatCard
            title="Goals Achieved"
            value="N/A"
            icon={Target}
            description="Feature coming soon"
          />
          <StatCard
            title="Current Streak"
            value="N/A"
            icon={Flame}
            description="Feature coming soon"
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Workout History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {assignedWorkouts && assignedWorkouts.length > 0 ? (
                assignedWorkouts.slice(0, 10).map(
                  (
                    assignment, // Show recent 10
                  ) => (
                    <div
                      key={assignment.id}
                      className="flex items-center justify-between p-3 rounded-lg border"
                    >
                      <div>
                        <p className="font-medium">{assignment.title}</p>
                        <p className="text-sm text-muted-foreground">
                          Scheduled:{" "}
                          {new Date(
                            assignment.scheduled_date,
                          ).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge
                        variant={
                          assignment.status === "completed"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {assignment.status}
                      </Badge>
                    </div>
                  ),
                )
              ) : (
                <p className="text-center text-muted-foreground py-4">
                  No workout history available for this athlete yet.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default AthleteProgress;
