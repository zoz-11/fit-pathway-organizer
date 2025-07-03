import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useWorkoutAssignments } from "@/hooks/useWorkoutAssignments";
import { Badge } from "@/components/ui/badge";

const AssignedWorkoutsTrainer = () => {
  const { assignments, isLoading } = useWorkoutAssignments();

  if (isLoading) {
    return (
      <AppLayout>
        <div className="p-6">Loading assigned workouts...</div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6 p-4 md:p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Assigned Workouts</h1>
            <p className="text-muted-foreground mt-1">Overview of all assigned workout plans to your athletes.</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {assignments && assignments.length > 0 ? (
            assignments.map((assignment) => (
              <Card key={assignment.id}>
                <CardHeader>
                  <CardTitle>{assignment.workout.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p>Assigned to: {assignment.athlete.full_name}</p>
                  <p>Due Date: {new Date(assignment.due_date).toLocaleDateString()}</p>
                  <p>Status: <Badge variant={assignment.status === 'completed' ? 'default' : 'secondary'}>{assignment.status}</Badge></p>
                </CardContent>
              </Card>
            ))
          ) : (
            <p>No workouts assigned yet.</p>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default AssignedWorkoutsTrainer;