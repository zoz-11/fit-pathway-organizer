import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, Target, Calendar, Award } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { ProgressCharts } from "@/components/dashboard/ProgressCharts";
import { AdvancedAnalytics } from "@/components/dashboard/AdvancedAnalytics";

const Progress = () => {
  const progressData = [
    { month: "Jan", workouts: 12, weight: 180 },
    { month: "Feb", workouts: 16, weight: 178 },
    { month: "Mar", workouts: 18, weight: 176 },
    { month: "Apr", workouts: 20, weight: 174 },
    { month: "May", workouts: 22, weight: 172 },
    { month: "Jun", workouts: 25, weight: 170 }
  ];

  const achievements = [
    { title: "First Workout", date: "2024-01-15", icon: "🏃" },
    { title: "10 Workouts", date: "2024-02-10", icon: "💪" },
    { title: "Weight Goal", date: "2024-04-20", icon: "🎯" },
    { title: "Consistency King", date: "2024-05-15", icon: "👑" },
    { title: "Month Streak", date: "2024-06-01", icon: "🔥" }
  ];

  return (
    <AppLayout>
      <div className="space-y-6 p-4 md:p-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Progress Tracking</h1>
          <p className="text-muted-foreground mt-1">
            Track your fitness journey and celebrate your achievements
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Workouts</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">113</div>
              <p className="text-xs text-muted-foreground">+12 from last month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Weight Lost</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">10 lbs</div>
              <p className="text-xs text-muted-foreground">Since January</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">15 days</div>
              <p className="text-xs text-muted-foreground">Personal best!</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Achievements</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5</div>
              <p className="text-xs text-muted-foreground">Badges earned</p>
            </CardContent>
          </Card>
        </div>

        {/* Progress Chart */}
        <ProgressCharts userId="current-user-id" />

        {/* Advanced Analytics */}
        <AdvancedAnalytics userId="current-user-id" />

        {/* Achievements */}
        <Card>
          <CardHeader>
            <CardTitle>Achievements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {achievements.map((achievement, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg">
                  <div className="text-2xl">{achievement.icon}</div>
                  <div>
                    <p className="font-medium">{achievement.title}</p>
                    <p className="text-sm text-gray-600">{achievement.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Goal Setting */}
        <Card>
          <CardHeader>
            <CardTitle>Current Goals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Reach 165 lbs</p>
                  <p className="text-sm text-gray-600">5 lbs to go</p>
                </div>
                <div className="w-32 bg-gray-200 dark:bg-gray-800 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '70%' }}></div>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">30-day streak</p>
                  <p className="text-sm text-gray-600">15 days completed</p>
                </div>
                <div className="w-32 bg-gray-200 dark:bg-gray-800 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '50%' }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Progress;
