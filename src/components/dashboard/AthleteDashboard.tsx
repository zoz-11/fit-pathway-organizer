
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

export const AthleteDashboard = () => {
  // Mock data - will be replaced with real data from Supabase
  const athleteData = {
    name: "Sarah Wilson",
    subscriptionStatus: "Active",
    subscriptionExpiry: "2024-08-15",
    weeklyProgress: 75,
    completedWorkouts: 18,
    totalWorkouts: 24,
    streakDays: 7,
    nextWorkout: "Upper Body Strength",
    nextWorkoutTime: "Tomorrow, 9:00 AM"
  };

  const todayWorkouts = [
    { name: "Warm-up Cardio", duration: "10 min", completed: true },
    { name: "Strength Training", duration: "45 min", completed: true },
    { name: "Core Workout", duration: "15 min", completed: false },
    { name: "Cool Down Stretch", duration: "10 min", completed: false }
  ];

  const weeklySchedule = [
    { day: "Mon", workouts: 2, completed: 2 },
    { day: "Tue", workouts: 1, completed: 1 },
    { day: "Wed", workouts: 2, completed: 2 },
    { day: "Thu", workouts: 1, completed: 1 },
    { day: "Fri", workouts: 2, completed: 1 },
    { day: "Sat", workouts: 1, completed: 0 },
    { day: "Sun", workouts: 0, completed: 0 }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {athleteData.name}!</h1>
        <p className="text-green-100">Ready to crush your fitness goals today?</p>
        <div className="mt-4 flex items-center space-x-4">
          <Badge className="bg-white/20 text-white border-white/30">
            {athleteData.subscriptionStatus}
          </Badge>
          <span className="text-sm text-green-100">
            Expires: {new Date(athleteData.subscriptionExpiry).toLocaleDateString()}
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
            <div className="text-2xl font-bold text-green-600 mb-2">{athleteData.weeklyProgress}%</div>
            <Progress value={athleteData.weeklyProgress} className="mb-2" />
            <div className="text-sm text-gray-500">
              {athleteData.completedWorkouts}/{athleteData.totalWorkouts} workouts completed
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
            <div className="text-2xl font-bold text-orange-600 mb-2">{athleteData.streakDays} days</div>
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
            <div className="text-lg font-bold text-blue-600 mb-1">{athleteData.nextWorkout}</div>
            <div className="text-sm text-gray-500">{athleteData.nextWorkoutTime}</div>
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
              <Badge variant="outline">2/4 Complete</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {todayWorkouts.map((workout, index) => (
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
            ))}
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
