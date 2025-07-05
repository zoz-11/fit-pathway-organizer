
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Calendar, Dumbbell, BarChart3, Plus, UserPlus, Send, PlusCircle } from "lucide-react";
import { AiChatAssistant } from "@/components/ai/AiChatAssistant";
import { SubscriptionManager } from "@/components/subscription/SubscriptionManager";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { useAuth } from "@/hooks/useAuthHook";
import { toast } from "sonner";
import { useState } from "react";

interface Activity {
  id: number;
  text: string;
  time: string;
  type: "success" | "info" | "warning";
}

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

export const TrainerDashboard = () => {
  const { profile } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  

  const handleAddAthlete = () => {
    const newActivity = {
      id: activities.length + 1,
      text: "New athlete 'Alex Johnson' has been added to your roster",
      time: "Just now",
      type: "success" as const
    };
    setActivities(prev => [newActivity, ...prev]);
    toast.success("New athlete added successfully!", {
      description: "Alex Johnson has been added to your athlete roster"
    });
  };

  const handleScheduleWorkout = () => {
    const newActivity = {
      id: activities.length + 1,
      text: "Workout scheduled for John - Upper Body Strength (Tomorrow 10 AM)",
      time: "Just now",
      type: "info" as const
    };
    setActivities(prev => [newActivity, ...prev]);
    toast.success("Workout scheduled!", {
      description: "Upper Body Strength workout scheduled for John tomorrow at 10 AM"
    });
  };

  const handleSendMessage = () => {
    toast.success("Message sent!", {
      description: "Workout reminder sent to all active athletes"
    });
  };

  const handleCreateExercise = () => {
    const newActivity = {
      id: activities.length + 1,
      text: "New exercise 'Diamond Push-ups' added to exercise library",
      time: "Just now",
      type: "success" as const
    };
    setActivities(prev => [newActivity, ...prev]);
    toast.success("Exercise created!", {
      description: "Diamond Push-ups has been added to your exercise library"
    });
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'success': return '🟢';
      case 'info': return '🔵';
      case 'warning': return '🟡';
      default: return '⚪';
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Trainer Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back, {profile?.full_name ?? 'Trainer'}! Here's what's happening with your athletes.
          </p>
        </div>
        <Button 
          onClick={handleAddAthlete}
          className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 w-full md:w-auto"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add New Athlete
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Athletes"
          value="12"
          icon={Users}
          description="+2 from last month"
        />
        <StatCard
          title="Scheduled Workouts"
          value="8"
          icon={Calendar}
          description="This week"
        />
        <StatCard
          title="Active Programs"
          value="5"
          icon={Dumbbell}
          description="Running programs"
        />
        <StatCard
          title="Completion Rate"
          value="87%"
          icon={BarChart3}
          description="+3% from last week"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Button 
                  variant="outline" 
                  className="justify-start h-auto p-4"
                  onClick={handleScheduleWorkout}
                >
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    <div className="text-left">
                      <div className="font-medium">Schedule Workout</div>
                      <div className="text-xs text-muted-foreground">Plan training sessions</div>
                    </div>
                  </div>
                </Button>
                <Button 
                  variant="outline" 
                  className="justify-start h-auto p-4"
                  onClick={handleAddAthlete}
                >
                  <div className="flex items-center space-x-3">
                    <UserPlus className="h-5 w-5 text-green-600" />
                    <div className="text-left">
                      <div className="font-medium">Add New Athlete</div>
                      <div className="text-xs text-muted-foreground">Expand your roster</div>
                    </div>
                  </div>
                </Button>
                <Button 
                  variant="outline" 
                  className="justify-start h-auto p-4"
                  onClick={handleSendMessage}
                >
                  <div className="flex items-center space-x-3">
                    <Send className="h-5 w-5 text-purple-600" />
                    <div className="text-left">
                      <div className="font-medium">Send Message</div>
                      <div className="text-xs text-muted-foreground">Communicate with athletes</div>
                    </div>
                  </div>
                </Button>
                <Button 
                  variant="outline" 
                  className="justify-start h-auto p-4"
                  onClick={handleCreateExercise}
                >
                  <div className="flex items-center space-x-3">
                    <PlusCircle className="h-5 w-5 text-orange-600" />
                    <div className="text-left">
                      <div className="font-medium">Create Exercise</div>
                      <div className="text-xs text-muted-foreground">Build exercise library</div>
                    </div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <ActivityFeed />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* AI Assistant */}
          <AiChatAssistant />
          
          {/* Subscription Management */}
          <SubscriptionManager />
        </div>
      </div>
    </div>
  );
};
