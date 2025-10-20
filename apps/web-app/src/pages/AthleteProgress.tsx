import { AppLayout } from "@/components/layout/AppLayout";
import { PageLayout } from "@/components/layout/PageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, Target, Flame, Dumbbell } from "lucide-react";
import { handleApiError } from "@/lib/utils";
import { ChatWindow } from "@/components/messages/ChatWindow";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/ui/StatCard";
import { useLanguage } from "@/contexts/LanguageContext";

interface AthleteProfile {
  id: string;
  full_name: string;
  email: string;
}

interface Workout {
  id: string;
  title: string;
  status: string;
  scheduled_date: string;
}

// --- Main Athlete Progress Page Component ---
const AthleteProgress = () => {
  const { t } = useLanguage();
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
        <PageLayout
          title={t("athleteProgress.title")}
          description={t("athleteProgress.description")}
        >
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Skeleton className="h-28" />
            <Skeleton className="h-28" />
            <Skeleton className="h-28" />
            <Skeleton className="h-28" />
          </div>
          <Skeleton className="h-96 w-full" />
        </PageLayout>
      </AppLayout>
    );
  }

  if (!athleteProfile) {
    return (
      <AppLayout>
        <PageLayout
          title={t("athleteProgress.notFound.title")}
          description={t("athleteProgress.notFound.description")}
        >
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              {t("athleteProgress.notFound.message")}
            </p>
          </div>
        </PageLayout>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <PageLayout
        title={t("athleteProgress.title")} 
        description={t("athleteProgress.description")}
      >
        <div className="flex justify-end">
          {athleteId && athleteProfile.full_name && (
            <ChatWindow
              participantId={athleteId}
              participantName={athleteProfile.full_name}
            />
          )}
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title={t("athleteProgress.stats.completed")}
            value={completedCount}
            icon={Dumbbell}
            description={t("athleteProgress.stats.completedDescription")}
          />
          <StatCard
            title={t("athleteProgress.stats.upcoming")}
            value={scheduledCount}
            icon={Calendar}
            description={t("athleteProgress.stats.upcomingDescription")}
          />
          <StatCard
            title={t("athleteProgress.stats.goals")}
            value="N/A"
            icon={Target}
            description={t("athleteProgress.stats.goalsDescription")}
          />
          <StatCard
            title={t("athleteProgress.stats.streak")}
            value="N/A"
            icon={Flame}
            description={t("athleteProgress.stats.streakDescription")}
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t("athleteProgress.workoutHistory.title")}</CardTitle>
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
                          {t("athleteProgress.workoutHistory.scheduled")}:{" "}
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
                  {t("athleteProgress.workoutHistory.noHistory")}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </PageLayout>
    </AppLayout>
  );
};

export default AthleteProgress;
