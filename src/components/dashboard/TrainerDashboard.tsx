
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Calendar, Dumbbell, BarChart3, MessageSquare, Plus } from "lucide-react";
import { AiChatAssistant } from "@/components/ai/AiChatAssistant";
import { SubscriptionManager } from "@/components/subscription/SubscriptionManager";
import { useAuth } from "@/hooks/useAuth";

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Trainer Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {profile?.full_name || 'Trainer'}! Here's what's happening with your athletes.
          </p>
        </div>
        <Button className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600">
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
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="mr-2 h-4 w-4" />
                Schedule Workout
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Users className="mr-2 h-4 w-4" />
                Add New Athlete
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <MessageSquare className="mr-2 h-4 w-4" />
                Send Message
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Dumbbell className="mr-2 h-4 w-4" />
                Create Exercise
              </Button>
            </CardContent>
          </Card>

          {/* Subscription Management */}
          <SubscriptionManager />
        </div>

        {/* AI Assistant */}
        <AiChatAssistant />
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">John completed Upper Body Workout</p>
                <p className="text-xs text-muted-foreground">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Sarah started Cardio Program</p>
                <p className="text-xs text-muted-foreground">4 hours ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Mike missed scheduled workout</p>
                <p className="text-xs text-muted-foreground">Yesterday</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
