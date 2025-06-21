
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Trophy, Target, Flame, Play, MessageSquare } from "lucide-react";
import { AiChatAssistant } from "@/components/ai/AiChatAssistant";
import { SubscriptionManager } from "@/components/subscription/SubscriptionManager";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const StatCard = ({ title, value, icon: Icon, description }: {
  title: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
);

export const AthleteDashboard = () => {
  const { profile } = useAuth();

  const handleStartWorkout = () => {
    toast.success("Starting your workout! Let's go!");
  };

  const handleViewDetails = () => {
    toast.info("Workout details feature coming soon!");
  };

  const handleScheduleWorkout = () => {
    toast.info("Schedule workout feature coming soon!");
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">My Fitness Journey</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back, {profile?.full_name || 'Athlete'}! Ready to crush your fitness goals?
          </p>
        </div>
        <Button 
          onClick={handleStartWorkout}
          className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 w-full md:w-auto px-6 py-2"
        >
          <Play className="mr-2 h-4 w-4" />
          Start Workout
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Workouts This Week"
          value="4"
          icon={Calendar}
          description="2 more to go!"
        />
        <StatCard
          title="Streak"
          value="7 days"
          icon={Flame}
          description="Personal best!"
        />
        <StatCard
          title="Goals Achieved"
          value="3/5"
          icon={Target}
          description="60% complete"
        />
        <StatCard
          title="Total Workouts"
          value="42"
          icon={Trophy}
          description="This month"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          {/* Today's Workout */}
          <Card>
            <CardHeader>
              <CardTitle>Today's Workout</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg">
                <h3 className="font-semibold text-lg">Upper Body Strength</h3>
                <p className="text-sm text-muted-foreground">45 minutes • 6 exercises</p>
                <div className="mt-3 flex flex-col sm:flex-row gap-2">
                  <Button 
                    size="sm" 
                    onClick={handleStartWorkout}
                    className="flex-1 sm:flex-none"
                  >
                    <Play className="mr-2 h-4 w-4" />
                    Start Now
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleViewDetails}
                    className="flex-1 sm:flex-none"
                  >
                    View Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Progress Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Weekly Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Mon</span>
                  <span className="text-green-600">✓</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tue</span>
                  <span className="text-green-600">✓</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Wed</span>
                  <span className="text-green-600">✓</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Thu</span>
                  <span className="text-green-600">✓</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Fri</span>
                  <span className="text-blue-600">Today</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Sat</span>
                  <span>-</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Sun</span>
                  <span>-</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Subscription Management */}
          <SubscriptionManager />
        </div>

        {/* AI Fitness Coach */}
        <div className="order-first lg:order-last">
          <AiChatAssistant />
        </div>
      </div>

      {/* Upcoming Workouts */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Workouts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 bg-gray-50 rounded-lg gap-2">
              <div>
                <p className="font-medium">Cardio Blast</p>
                <p className="text-sm text-muted-foreground">Tomorrow • 30 min</p>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleScheduleWorkout}
                className="w-full sm:w-auto"
              >
                Schedule
              </Button>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 bg-gray-50 rounded-lg gap-2">
              <div>
                <p className="font-medium">Leg Day</p>
                <p className="text-sm text-muted-foreground">Sunday • 60 min</p>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleScheduleWorkout}
                className="w-full sm:w-auto"
              >
                Schedule
              </Button>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 bg-gray-50 rounded-lg gap-2">
              <div>
                <p className="font-medium">Core & Flexibility</p>
                <p className="text-sm text-muted-foreground">Monday • 20 min</p>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleScheduleWorkout}
                className="w-full sm:w-auto"
              >
                Schedule
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
