import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreateWorkoutDialog } from "@/components/workouts/CreateWorkoutDialog";
import { Edit, Trash2 } from "lucide-react";
import { useWorkouts } from "@/hooks/useWorkouts";
import { Skeleton } from "@/components/ui/skeleton";

const WorkoutLibrary = () => {
  const { workouts, isLoading } = useWorkouts();

  if (isLoading) {
    return (
      <AppLayout>
        <div className="p-6">
          <Skeleton className="h-10 w-48 mb-4" />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6 p-4 md:p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Workout Library</h1>
            <p className="text-muted-foreground mt-1">Manage your custom workout plans.</p>
          </div>
          <CreateWorkoutDialog />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {workouts && workouts.length > 0 ? (
            workouts.map((workout) => (
              <Card key={workout.id}>
                <CardHeader>
                  <CardTitle>{workout.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm text-muted-foreground">{workout.description}</p>
                  <div className="flex justify-end space-x-2 mt-4">
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <p>No workouts created yet. Click "Create New Workout" to get started!</p>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default WorkoutLibrary;