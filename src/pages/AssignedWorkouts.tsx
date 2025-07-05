import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useWorkoutAssignments } from "@/hooks/useWorkoutAssignments";
import { Button } from "@/components/ui/button";
import { CheckCircle, Dumbbell, Calendar } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Type guard for workout assignment
interface WorkoutAssignmentRaw {
  id: unknown;
  status: unknown;
  completed_at?: unknown;
  due_date?: unknown;
  workout?: unknown;
}

// Type guard for workout assignment
function isWorkoutAssignment(a: WorkoutAssignmentRaw): a is { id: number; status: string; completed_at?: string; due_date?: string; workout?: { name?: string } } {
  return typeof a === 'object' && a !== null && typeof a.id === 'number' && typeof a.status === 'string';
}

const AssignedWorkouts = () => {
  const { assignments, isLoading, markAsComplete } = useWorkoutAssignments();

  if (isLoading) {
    return (
      <AppLayout>
        <div className="p-6">Loading assigned workouts...</div>
      </AppLayout>
    );
  }

  // Filter out any invalid assignments (e.g., SelectQueryError)
  const validAssignments = Array.isArray(assignments) ? assignments.filter(isWorkoutAssignment) : [];

  const pendingWorkouts = validAssignments.filter(a => a.status === 'pending');
  const completedWorkouts = validAssignments.filter(a => a.status === 'completed');

  const getMonthlyWorkoutData = () => {
    const monthlyData: { name: string; workouts: number }[] = [];
    const monthMap = new Map<string, number>();

    completedWorkouts.forEach(assignment => {
      if (assignment.completed_at) {
        const date = new Date(assignment.completed_at);
        const monthYear = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
        monthMap.set(monthYear, (monthMap.get(monthYear) || 0) + 1);
      }
    });

    monthMap.forEach((workouts, name) => {
      monthlyData.push({ name, workouts });
    });

    // Sort by date (this is a simplified sort, for real app, use proper date objects)
    monthlyData.sort((a, b) => new Date(a.name).getTime() - new Date(b.name).getTime());

    return monthlyData;
  };

  const monthlyWorkoutData = getMonthlyWorkoutData();

  return (
    <AppLayout>
      <div className="space-y-6 p-4 md:p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">My Assigned Workouts</h1>
            <p className="text-muted-foreground mt-1">View and manage your assigned workout plans.</p>
          </div>
        </div>

        {/* Progress Overview */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Workouts Completed</CardTitle>
              <Dumbbell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedWorkouts.length}</div>
              <p className="text-xs text-muted-foreground">Total workouts you've finished</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Workouts</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingWorkouts.length}</div>
              <p className="text-xs text-muted-foreground">Workouts waiting for you</p>
            </CardContent>
          </Card>
        </div>

        {/* Monthly Progress Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Workout Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={monthlyWorkoutData}
                  margin={{
                    top: 5, right: 30, left: 20, bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="workouts" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Pending Workouts */}
        <Card>
          <CardHeader>
            <CardTitle>Pending Workouts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {pendingWorkouts.length > 0 ? (
                pendingWorkouts.map((assignment) => (
                  <div key={assignment.id} className="p-4 border rounded-lg flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{assignment.workout?.name || 'Unnamed Workout'}</h3>
                      <p className="text-sm text-muted-foreground">Due Date: {assignment.due_date ? new Date(assignment.due_date).toLocaleDateString() : 'N/A'}</p>
                    </div>
                    <Button onClick={() => markAsComplete.mutate(Number(assignment.id))}>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Mark as Complete
                    </Button>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground">No pending workouts. Great job!</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Completed Workouts */}
        <Card>
          <CardHeader>
            <CardTitle>Completed Workouts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {completedWorkouts.length > 0 ? (
                completedWorkouts.map((assignment) => (
                  <div key={assignment.id} className="p-4 border rounded-lg flex items-center justify-between bg-green-50/50">
                    <div>
                      <h3 className="font-semibold">{assignment.workout?.name || 'Unnamed Workout'}</h3>
                      <p className="text-sm text-muted-foreground">Completed on: {assignment.completed_at ? new Date(assignment.completed_at).toLocaleDateString() : 'N/A'}</p>
                    </div>
                    <span className="text-green-600 font-medium">Completed</span>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground">No completed workouts yet.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default AssignedWorkouts;