import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useWorkoutAssignments } from "@/hooks/useWorkoutAssignments";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

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
  const { assignments, isLoading } = useWorkoutAssignments();

  // Filter out invalid or malformed assignment objects and assert the type
  const validAssignments = Array.isArray(assignments)
    ? assignments.filter(
        (a): a is any =>
          a && typeof a === "object" && !!a.id && !!a.status,
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
      <div className="space-y-6 p-4 md:p-6">
        <header>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Assigned Workouts
          </h1>
          <p className="text-muted-foreground mt-1">
            Overview of all assigned workout plans for your athletes.
          </p>
        </header>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            renderSkeletons()
          ) : validAssignments.length > 0 ? (
            validAssignments.map((assignment) => (
              <Card key={assignment.id}>
                <CardHeader>
                  <CardTitle>
                    {assignment.title || "Untitled Workout"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Assigned to:{" "}
                    <span className="font-medium text-foreground">
                      {assignment.athlete?.full_name || "N/A"}
                    </span>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Scheduled Date:{" "}
                    <span className="font-medium text-foreground">
                      {new Date(assignment.scheduled_date).toLocaleDateString()}
                    </span>
                  </p>
                  <div>
                    Status:{" "}
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
              <p>No workouts have been assigned yet.</p>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default AssignedWorkoutsTrainer;
