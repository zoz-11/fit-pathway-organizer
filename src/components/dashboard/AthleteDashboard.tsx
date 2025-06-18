
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  CheckCircle, 
  Clock, 
  Target, 
  Award,
  MessageSquare,
  Camera,
  Apple
} from "lucide-react";
import { useProfile } from "@/hooks/useProfile";
import { useTodayWorkouts, useUserWorkouts } from "@/hooks/useWorkouts";

export const AthleteDashboard = () => {
  // For demo purposes, using a mock user ID - will be replaced with real auth in Phase 2
  const mockUserId = "demo-athlete-id";
  
  const { data: profile, isLoading: profileLoading } = useProfile(mockUserId);
  const { data: todayWorkouts, isLoading: todayLoading } = useTodayWorkouts(mockUserId);
  const { data: allWorkouts, isLoading: workoutsLoading } = useUserWorkouts(mockUserId);

  // Calculate statistics from real data
  const totalWorkoutsThisWeek = allWorkouts?.filter(workout => {
    const workoutDate = new Date(workout.scheduled_date);
    const now = new Date();
    const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
    return workoutDate >= weekStart;
  }).length || 0;

  const completedWorkoutsThisWeek = allWorkouts?.filter(workout => {
    const workoutDate = new Date(workout.scheduled_date);
    const now = new Date();
    const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
    return workoutDate >= weekStart && workout.status === 'completed';
  }).length || 0;

  const weeklyProgress = totalWorkoutsThisWeek > 0 ? Math.round((completedWorkoutsThisWeek / totalWorkoutsThisWeek) * 100) : 0;

  // Calculate streak (mock for now)
  const streakDays = 7; // Will be calculated from actual completion data

  // Get next workout
  const nextWorkout = allWorkouts?.find(workout => 
    new Date(workout.scheduled_date) > new Date() && workout.status === 'scheduled'
  );

  // Transform today's workouts for display
  const todayWorkoutsList = todayWorkouts?.map(workout => ({
    name: workout.title,
    duration: `${workout.workout_exercises?.length || 0} exercises`,
    completed: workout.status === 'completed'
  })) || [];

  // Mock weekly schedule data (will be calculated from real data)
  const weeklySchedule = [
    { day: "Mon", workouts: 2, completed: 2 },
    { day: "Tue", workouts: 1, completed: 1 },
    { day: "Wed", workouts: 2, completed: 2 },
    { day: "Thu", workouts: 1, completed: 1 },
    { day: "Fri", workouts: 2, completed: 1 },
    { day: "Sat", workouts: 1, completed: 0 },
    { day: "Sun", workouts: 0, completed: 0 }
  ];

  if (profileLoading || todayLoading || workoutsLoading) {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-lg p-6 text-white">
          <h1 className="text-3xl font-bold mb-2">Loading your dashboard...</h1>
          <p className="text-green-100">Please wait while we fetch your data.</p>
        </div>
      </div>
    );
  }

  const athleteName = profile?.full_name || "Athlete";
  const subscriptionStatus = profile?.subscription_status || "trial";
  const subscriptionExpiry = profile?.subscription_expiry || "2024-08-15";

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {athleteName}!</h1>
        <p className="text-green-100">Ready to crush your fitness goals today?</p>
        <div className="mt-4 flex items-center space-x-4">
          <Badge className="bg-white/20 text-white border-white/30 capitalize">
            {subscriptionStatus}
          </Badge>
          <span className="text-sm text-green-100">
            Expires: {new Date(subscriptionExpiry).toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-green-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-gray-600 flex items-center">
              <Target className="w-4 h-4 mr-2 text-green-500" />
              Weekly Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 mb-2">{weeklyProgress}%</div>
            <Progress value={weeklyProgress} className="mb-2" />
            <div className="text-sm text-gray-500">
              {completedWorkoutsThisWeek}/{totalWorkoutsThisWeek} workouts completed
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-gray-600 flex items-center">
              <Award className="w-4 h-4 mr-2 text-orange-500" />
              Current Streak
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600 mb-2">{streakDays} days</div>
            <div className="text-sm text-gray-500">Keep it up! 🔥</div>
          </CardContent>
        </Card>

        <Card className="border-blue-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-gray-600 flex items-center">
              <Calendar className="w-4 h-4 mr-2 text-blue-500" />
              Next Workout
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold text-blue-600 mb-1">
              {nextWorkout?.title || "No upcoming workouts"}
            </div>
            <div className="text-sm text-gray-500">
              {nextWorkout ? new Date(nextWorkout.scheduled_date).toLocaleDateString() : "Schedule a workout"}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Today's Workouts & Weekly Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Workouts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                Today's Workouts
              </span>
              <Badge variant="outline">
                {todayWorkoutsList.filter(w => w.completed).length}/{todayWorkoutsList.length} Complete
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {todayWorkoutsList.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                No workouts scheduled for today
              </div>
            ) : (
              todayWorkoutsList.map((workout, index) => (
                <div key={index} className={`flex items-center justify-between p-3 rounded-lg border ${
                  workout.completed 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-gray-50 border-gray-200'
                }`}>
                  <div className="flex items-center space-x-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      workout.completed 
                        ? 'bg-green-500 text-white' 
                        : 'border-2 border-gray-300'
                    }`}>
                      {workout.completed && <CheckCircle className="w-4 h-4" />}
                    </div>
                    <div>
                      <p className={`font-medium ${workout.completed ? 'text-green-800' : 'text-gray-800'}`}>
                        {workout.name}
                      </p>
                      <p className="text-sm text-gray-500">{workout.duration}</p>
                    </div>
                  </div>
                  {!workout.completed && (
                    <Button size="sm" className="bg-green-500 hover:bg-green-600">
                      Start
                    </Button>
                  )}
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Weekly Schedule Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-blue-500" />
              This Week's Schedule
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-2">
              {weeklySchedule.map((day, index) => (
                <div key={index} className="text-center">
                  <div className="text-xs font-medium text-gray-500 mb-2">{day.day}</div>
                  <div className={`w-8 h-8 rounded-full mx-auto flex items-center justify-center text-xs font-bold ${
                    day.completed === day.workouts && day.workouts > 0
                      ? 'bg-green-500 text-white'
                      : day.completed > 0
                      ? 'bg-yellow-500 text-white'
                      : day.workouts > 0
                      ? 'bg-gray-200 text-gray-600'
                      : 'bg-gray-100 text-gray-400'
                  }`}>
                    {day.completed}/{day.workouts}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button className="h-24 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 flex flex-col space-y-2">
              <CheckCircle className="w-6 h-6" />
              <span>Log Workout</span>
            </Button>
            <Button className="h-24 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 flex flex-col space-y-2" variant="secondary">
              <MessageSquare className="w-6 h-6" />
              <span>Message Trainer</span>
            </Button>
            <Button className="h-24 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 flex flex-col space-y-2" variant="secondary">
              <Camera className="w-6 h-6" />
              <span>Upload Progress</span>
            </Button>
            <Button className="h-24 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 flex flex-col space-y-2" variant="secondary">
              <Apple className="w-6 h-6" />
              <span>View Diet Plan</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
