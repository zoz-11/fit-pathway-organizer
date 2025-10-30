import { AppLayout } from "@/components/layout/AppLayout";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useWorkoutAssignments } from "@/hooks/useWorkoutAssignments";
import { Calendar, CheckCircle, Dumbbell, Video, Play } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { VideoPlayer } from "@/components/video/VideoPlayer";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useLanguage } from "@/contexts/LanguageContext";

// A more accurate type for the workout assignment object, including optional fields.
type WorkoutAssignment = {
  id: string;
  created_at: string;
  updated_at: string;
  title: string;
  description: string | null;
  status: "scheduled" | "in_progress" | "completed" | "skipped";
  scheduled_date: string;
  scheduled_time: string | null;
  notes: string | null;
  athlete_id: string;
  trainer_id: string;
  completed_at: string | null; // This field was missing in the original type
  athlete: {
    full_name: string | null;
    [key: string]: any;
  } | null;
};

const AssignedWorkouts = () => {
  const { assignments, isLoading, markAsComplete } = useWorkoutAssignments();
  const { t } = useLanguage();
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [selectedVideoUrl, setSelectedVideoUrl] = useState<string>("");

  if (isLoading) {
    return (
      <AppLayout>
        <PageLayout
          title={t("assignedWorkouts.title")}
          description={t("assignedWorkouts.description")}
        >
          <div className="p-6">{t("assignedWorkouts.loading")}</div>
        </PageLayout>
      </AppLayout>
    );
  }

  // Ensure assignments is an array before filtering
  const validAssignments: any[] = Array.isArray(assignments)
    ? assignments.filter((a): a is any => a && typeof a === "object" && !!a.id)
    : [];

  const scheduledWorkouts = validAssignments.filter(
    (a) => a.status === "scheduled" || a.status === "in_progress",
  );
  const completedWorkouts = validAssignments.filter(
    (a) => a.status === "completed",
  );

  const getMonthlyWorkoutData = () => {
    const monthMap = new Map<string, number>();

    completedWorkouts.forEach((assignment) => {
      // Use completed_at for accuracy, fall back to scheduled_date if needed
      const completionDate =
        assignment.completed_at || assignment.scheduled_date;
      if (completionDate) {
        const date = new Date(completionDate);
        const monthYear = date.toLocaleString("default", {
          month: "short",
          year: "numeric",
        });
        monthMap.set(monthYear, (monthMap.get(monthYear) || 0) + 1);
      }
    });

    // Convert map to array and sort by date
    return Array.from(monthMap.entries())
      .map(([name, workouts]) => ({ name, workouts }))
      .sort((a, b) => new Date(a.name).getTime() - new Date(b.name).getTime());
  };

  const monthlyWorkoutData = getMonthlyWorkoutData();

  return (
    <AppLayout>
      <PageLayout
        title={t("assignedWorkouts.title")}
        description={t("assignedWorkouts.description")}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t("assignedWorkouts.completed.title")}
              </CardTitle>
              <Dumbbell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {completedWorkouts.length}
              </div>
              <p className="text-xs text-muted-foreground">
                {t("assignedWorkouts.completed.description")}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t("assignedWorkouts.upcoming.title")}
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {scheduledWorkouts.length}
              </div>
              <p className="text-xs text-muted-foreground">
                {t("assignedWorkouts.upcoming.description")}
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t("assignedWorkouts.monthlyProgress.title")}</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyWorkoutData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="workouts" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("assignedWorkouts.scheduled.title")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {scheduledWorkouts.length > 0 ? (
                scheduledWorkouts.map((assignment) => (
                  <div
                    key={assignment.id}
                    className="p-4 border rounded-lg flex items-center justify-between"
                  >
                  <div className="flex-1">
                    <h3 className="font-semibold">{assignment.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {t("assignedWorkouts.scheduled.due")}{" "}
                      {new Date(
                        assignment.scheduled_date,
                      ).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedVideoUrl("https://www.youtube.com/watch?v=IODxDxX7oi4");
                        setVideoModalOpen(true);
                      }}
                    >
                      <Play className="h-4 w-4 me-2" />
                      {t("assignedWorkouts.videoPreview")}
                    </Button>
                    <Button
                      onClick={() => markAsComplete.mutate(assignment.id)}
                    >
                      <CheckCircle className="h-4 w-4 me-2 dropdown-item-icon" />
                      {t("assignedWorkouts.scheduled.markAsComplete")}
                    </Button>
                  </div>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-center py-4">
                  {t("assignedWorkouts.scheduled.noWorkouts")}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("assignedWorkouts.completed.table.title")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {completedWorkouts.length > 0 ? (
                completedWorkouts.map((assignment) => (
                  <div
                    key={assignment.id}
                    className="p-4 border rounded-lg flex items-center justify-between bg-green-50/50 dark:bg-green-900/10"
                  >
                    <div>
                      <h3 className="font-semibold">{assignment.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {t("assignedWorkouts.completed.table.completedOn")}{" "}
                        {assignment.completed_at
                          ? new Date(
                              assignment.completed_at,
                            ).toLocaleDateString()
                          : t("assignedWorkouts.na")}
                      </p>
                    </div>
                    <span className="text-green-600 font-medium flex items-center">
                      <CheckCircle className="h-4 w-4 me-2 dropdown-item-icon" />
                      {t("assignedWorkouts.completed.table.status.completed")}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-center py-4">
                  {t("assignedWorkouts.completed.table.noWorkouts")}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Video Modal */}
        <Dialog open={videoModalOpen} onOpenChange={setVideoModalOpen}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>{t("assignedWorkouts.videoPreview")}</DialogTitle>
            </DialogHeader>
            {selectedVideoUrl && (
              <VideoPlayer url={selectedVideoUrl} />
            )}
          </DialogContent>
        </Dialog>
      </PageLayout>
    </AppLayout>
  );
};

export default AssignedWorkouts;
