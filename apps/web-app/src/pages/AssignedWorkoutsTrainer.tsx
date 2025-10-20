import { AppLayout } from "@/components/layout/AppLayout";
import { PageLayout } from "@/components/layout/PageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useWorkoutAssignments } from "@/hooks/useWorkoutAssignments";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/contexts/LanguageContext";

// Define a type for the assignment object for type safety
type WorkoutAssignment = {
  id: string;
  title: string;
  scheduled_date: string;
  status: "scheduled" | "in_progress" | "completed" | "skipped";
  athlete: {
    full_name: string | null;
  } | null;
};

const AssignedWorkoutsTrainer = () => {
  const { t } = useLanguage();
  const { assignments, isLoading } = useWorkoutAssignments();

  // Filter out invalid or malformed assignment objects and assert the type
  const validAssignments = Array.isArray(assignments)
    ? assignments.filter(
        (a): a is any => a && typeof a === "object" && !!a.id && !!a.status,
      )
    : [];

  const renderSkeletons = () =>
    Array.from({ length: 6 }).map((_, index) => (
      <Card key={index}>
        <CardHeader>
          <Skeleton className="h-6 w-3/4" />
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-6 w-1/4" />
        </CardContent>
      </Card>
    ));

  return (
    <AppLayout>
      <PageLayout
        title={t("assignedWorkoutsTrainer.title")}
        description={t("assignedWorkoutsTrainer.description")}
      >
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            renderSkeletons()
          ) : validAssignments.length > 0 ? (
            validAssignments.map((assignment) => (
              <Card key={assignment.id}>
                <CardHeader>
                  <CardTitle>
                    {assignment.title || t("assignedWorkoutsTrainer.untitledWorkout")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    {t("assignedWorkoutsTrainer.assignedTo")}{" "}
                    <span className="font-medium text-foreground">
                      {assignment.athlete?.full_name || t("assignedWorkoutsTrainer.notApplicable")}
                    </span>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {t("assignedWorkoutsTrainer.scheduledDate")}{" "}
                    <span className="font-medium text-foreground">
                      {new Date(assignment.scheduled_date).toLocaleDateString()}
                    </span>
                  </p>
                  <div>
                    {t("assignedWorkoutsTrainer.status")}{" "}
                    <Badge
                      variant={
                        assignment.status === "completed"
                          ? "default"
                          : assignment.status === "in_progress"
                            ? "outline"
                            : "secondary"
                      }
                      className="capitalize"
                    >
                      {assignment.status.replace("_", " ")}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center text-muted-foreground py-10">
              <p>{t("assignedWorkoutsTrainer.noWorkouts")}</p>
            </div>
          )}
        </div>
      </PageLayout>
    </AppLayout>
  );
};

export default AssignedWorkoutsTrainer;
