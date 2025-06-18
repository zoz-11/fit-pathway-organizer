
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  Dumbbell, 
  Calendar, 
  TrendingUp, 
  Plus,
  UserCheck,
  Clock,
  AlertCircle
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useProfile } from "@/hooks/useProfile";
import { useTrainerAthletes } from "@/hooks/useProfile";
import { useExercises } from "@/hooks/useExercises";

export const TrainerDashboard = () => {
  // For demo purposes, using a mock trainer ID - will be replaced with real auth in Phase 2
  const mockTrainerId = "demo-trainer-id";
  
  const { data: profile, isLoading: profileLoading } = useProfile(mockTrainerId);
  const { data: athletes, isLoading: athletesLoading } = useTrainerAthletes(mockTrainerId);
  const { data: exercises, isLoading: exercisesLoading } = useExercises();

  // Calculate stats from real data
  const totalMembers = athletes?.length || 0;
  const activeMembers = athletes?.filter(athlete => 
    athlete.subscription_status === 'active' || athlete.subscription_status === 'trial'
  ).length || 0;
  const totalExercises = exercises?.length || 0;

  // Mock data for features not yet implemented
  const stats = {
    scheduledToday: 8,
    pendingRequests: 3,
    expiringSoon: 5
  };

  const recentActivity = [
    { user: "Demo Athlete", action: "Completed workout", time: "2 hours ago" },
    { user: "Test User", action: "Requested renewal", time: "4 hours ago" },
    { user: "Sample Member", action: "Uploaded progress photo", time: "6 hours ago" },
    { user: "Example Athlete", action: "Sent message", time: "1 day ago" }
  ];

  if (profileLoading || athletesLoading || exercisesLoading) {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-lg p-6 text-white">
          <h1 className="text-3xl font-bold mb-2">Loading trainer dashboard...</h1>
          <p className="text-blue-100">Please wait while we fetch your data.</p>
        </div>
      </div>
    );
  }

  const trainerName = profile?.full_name || "Trainer";

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {trainerName}!</h1>
        <p className="text-blue-100">Here's what's happening with your athletes today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-blue-200 hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-gray-600 flex items-center">
              <Users className="w-4 h-4 mr-2 text-blue-500" />
              Total Members
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{totalMembers}</div>
            <div className="text-sm text-green-600 flex items-center mt-1">
              <TrendingUp className="w-3 h-3 mr-1" />
              Connected to database
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200 hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-gray-600 flex items-center">
              <UserCheck className="w-4 h-4 mr-2 text-green-500" />
              Active Members
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activeMembers}</div>
            <div className="text-sm text-gray-500 mt-1">
              {totalMembers > 0 ? Math.round((activeMembers / totalMembers) * 100) : 0}% active rate
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-200 hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-gray-600 flex items-center">
              <Dumbbell className="w-4 h-4 mr-2 text-purple-500" />
              Exercise Library
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{totalExercises}</div>
            <div className="text-sm text-gray-500 mt-1">exercises available</div>
          </CardContent>
        </Card>

        <Card className="border-orange-200 hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-gray-600 flex items-center">
              <Calendar className="w-4 h-4 mr-2 text-orange-500" />
              Today's Schedules
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.scheduledToday}</div>
            <div className="text-sm text-gray-500 mt-1">workouts scheduled</div>
          </CardContent>
        </Card>
      </div>

      {/* Action Items & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Action Items */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center">
                <AlertCircle className="w-5 h-5 mr-2 text-amber-500" />
                Action Items
              </span>
              <Badge variant="secondary">{stats.pendingRequests + stats.expiringSoon}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg border border-amber-200">
              <div>
                <p className="font-medium text-amber-800">Pending Renewal Requests</p>
                <p className="text-sm text-amber-600">{stats.pendingRequests} members waiting</p>
              </div>
              <Button size="sm" className="bg-amber-500 hover:bg-amber-600">
                Review
              </Button>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
              <div>
                <p className="font-medium text-red-800">Expiring Soon</p>
                <p className="text-sm text-red-600">{stats.expiringSoon} subscriptions this week</p>
              </div>
              <Button size="sm" variant="destructive">
                Send Reminders
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="w-5 h-5 mr-2 text-blue-500" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.user}</p>
                    <p className="text-sm text-gray-600">{activity.action}</p>
                  </div>
                  <span className="text-xs text-gray-400">{activity.time}</span>
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
            <Button className="h-24 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 flex flex-col space-y-2">
              <Plus className="w-6 h-6" />
              <span>Add Exercise</span>
            </Button>
            <Button className="h-24 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 flex flex-col space-y-2" variant="secondary">
              <Calendar className="w-6 h-6" />
              <span>Create Schedule</span>
            </Button>
            <Button className="h-24 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 flex flex-col space-y-2" variant="secondary">
              <Users className="w-6 h-6" />
              <span>Manage Members</span>
            </Button>
            <Button className="h-24 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 flex flex-col space-y-2" variant="secondary">
              <TrendingUp className="w-6 h-6" />
              <span>View Reports</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
