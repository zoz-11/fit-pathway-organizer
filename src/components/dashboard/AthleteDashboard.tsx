import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar, 
  Trophy, 
  Target, 
  Flame, 
  Play, 
  Clock, 
  Dumbbell, 
  TrendingUp,
  Users,
  Award,
  MessageSquare,
  Settings,
  Plus,
  CheckCircle,
  XCircle,
  Pause,
  Star,
  Heart,
  Zap,
  Activity,
  Square
} from "lucide-react";
import { AiChatAssistant } from "@/components/ai/AiChatAssistant";
import { SubscriptionManager } from "@/components/subscription/SubscriptionManager";
import { WorkoutDetailsModal } from "@/components/workout/WorkoutDetailsModal";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { dashboardApi, workoutSessionApi, goalsApi } from "@/lib/api";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import type { DashboardStats, WorkoutSession, FitnessGoal } from "@/types";

const StatCard = ({ title, value, icon: Icon, description, trend, color = "blue" }: {
  title: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  trend?: { value: number; isPositive: boolean };
  color?: string;
}) => (
  <Card className="relative overflow-hidden">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className={`h-4 w-4 text-${color}-600`} />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground">{description}</p>
      {trend && (
        <div className={`flex items-center text-xs mt-1 ${
          trend.isPositive ? 'text-green-600' : 'text-red-600'
        }`}>
          <TrendingUp className={`h-3 w-3 mr-1 ${
            trend.isPositive ? 'rotate-0' : 'rotate-180'
          }`} />
          {trend.value}% from last week
        </div>
      )}
    </CardContent>
  </Card>
);

const QuickActionCard = ({ title, description, icon: Icon, onClick, variant = "default" }: {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  onClick: () => void;
  variant?: "default" | "success" | "warning" | "destructive";
}) => (
  <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={onClick}>
    <CardContent className="p-4">
      <div className="flex items-center space-x-3">
        <div className={`p-2 rounded-lg ${
          variant === "success" ? "bg-green-100 text-green-600" :
          variant === "warning" ? "bg-yellow-100 text-yellow-600" :
          variant === "destructive" ? "bg-red-100 text-red-600" :
          "bg-blue-100 text-blue-600"
        }`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-sm">{title}</h3>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
    </CardContent>
  </Card>
);

const GoalCard = ({ goal }: { goal: FitnessGoal }) => {
  const progress = (goal.current_value / goal.target_value) * 100;
  const isCompleted = goal.status === 'completed';
  const isOverdue = goal.deadline && new Date(goal.deadline) < new Date();

  return (
    <Card className={`${isCompleted ? 'border-green-200 bg-green-50' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Target className="h-4 w-4" />
            {goal.title}
          </CardTitle>
          <Badge variant={isCompleted ? "default" : isOverdue ? "destructive" : "secondary"}>
            {isCompleted ? "Completed" : isOverdue ? "Overdue" : goal.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>{goal.current_value} / {goal.target_value} {goal.unit}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
          <p className="text-xs text-muted-foreground">{goal.description}</p>
          {goal.deadline && (
            <p className="text-xs text-muted-foreground">
              Deadline: {new Date(goal.deadline).toLocaleDateString()}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export const AthleteDashboard = () => {
  const { profile } = useAuth();
  const queryClient = useQueryClient();
  const [workoutInProgress, setWorkoutInProgress] = useState(false);
  const [currentWorkoutSession, setCurrentWorkoutSession] = useState<WorkoutSession | null>(null);
  const [showWorkoutModal, setShowWorkoutModal] = useState(false);
  const [workoutTime, setWorkoutTime] = useState(0);

  // Fetch dashboard data
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: dashboardApi.getDashboardStats,
  });

  const { data: goals, isLoading: goalsLoading } = useQuery({
    queryKey: ['goals'],
    queryFn: goalsApi.getGoals,
  });

  const { data: recentSessions } = useQuery({
    queryKey: ['recent-sessions'],
    queryFn: workoutSessionApi.getUserWorkoutSessions,
  });

  // Mutations
  const startWorkoutMutation = useMutation({
    mutationFn: workoutSessionApi.startWorkout,
    onSuccess: (session) => {
      setCurrentWorkoutSession(session);
      setWorkoutInProgress(true);
      setWorkoutTime(0);
      toast.success("Workout started! Let's crush it! 💪");
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
    },
    onError: (error) => {
      toast.error("Failed to start workout. Please try again.");
    }
  });

  const completeWorkoutMutation = useMutation({
    mutationFn: ({ id, duration, exercisesCompleted }: {
      id: string;
      duration: number;
      exercisesCompleted: unknown[];
    }) => workoutSessionApi.completeWorkout(id, duration, exercisesCompleted),
    onSuccess: () => {
      setWorkoutInProgress(false);
      setCurrentWorkoutSession(null);
      setWorkoutTime(0);
      toast.success("Workout completed! Great job! 🎉");
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      queryClient.invalidateQueries({ queryKey: ['recent-sessions'] });
    },
    onError: (error) => {
      toast.error("Failed to complete workout. Please try again.");
    }
  });

  // Workout timer effect
  useEffect(() => {
    let interval: number;
    if (workoutInProgress) {
      interval = setInterval(() => {
        setWorkoutTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [workoutInProgress]);

  const handleStartWorkout = () => {
    if (!workoutInProgress) {
      startWorkoutMutation.mutate("sample-workout-id");
    }
  };

  const handleCompleteWorkout = () => {
    if (currentWorkoutSession) {
      completeWorkoutMutation.mutate({
        id: currentWorkoutSession.id,
        duration: workoutTime,
        exercisesCompleted: []
      });
    }
  };

  const handleStartWorkoutFromModal = () => {
    handleStartWorkout();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const quickActions = [
    {
      title: "Start Workout",
      description: "Begin your fitness journey",
      icon: Play,
      onClick: handleStartWorkout,
      variant: "success" as const
    },
    {
      title: "Log Progress",
      description: "Track your measurements",
      icon: TrendingUp,
      onClick: () => toast.info("Progress logging coming soon!"),
      variant: "default" as const
    },
    {
      title: "Plan Meals",
      description: "Create nutrition plan",
      icon: Heart,
      onClick: () => toast.info("Meal planning coming soon!"),
      variant: "default" as const
    },
    {
      title: "Connect Friends",
      description: "Build your fitness community",
      icon: Users,
      onClick: () => toast.info("Social features coming soon!"),
      variant: "default" as const
    }
  ];

  if (statsLoading || goalsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
            My Fitness Journey
          </h1>
          <p className="text-muted-foreground">
            Welcome back, {profile?.name || 'Athlete'}! Ready to crush your fitness goals?
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={handleStartWorkout}
            disabled={workoutInProgress}
            className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white px-6 py-2 rounded-lg font-medium"
          >
            <Dumbbell className="mr-2 h-4 w-4" />
            {workoutInProgress ? "Workout in Progress" : "Start Workout"}
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Workout Timer */}
      {workoutInProgress && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="text-center space-y-4">
              <div className="text-3xl font-mono font-bold text-blue-600">
                {formatTime(workoutTime)}
              </div>
              <div className="flex justify-center gap-2">
                <Button onClick={handleCompleteWorkout} size="sm" className="bg-red-600 hover:bg-red-700">
                  <Square className="h-4 w-4 mr-1" />
                  Complete Workout
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Workouts This Week"
          value={stats?.this_week_workouts.toString() || "0"}
          icon={Calendar}
          description="Keep the momentum going!"
          trend={{ value: 15, isPositive: true }}
          color="blue"
        />
        <StatCard
          title="Current Streak"
          value={`${stats?.current_streak || 0} days`}
          icon={Flame}
          description="Personal best!"
          trend={{ value: 8, isPositive: true }}
          color="orange"
        />
        <StatCard
          title="Goals Achieved"
          value={`${stats?.goals_completed || 0}/${goals?.length || 0}`}
          icon={Target}
          description="Making progress!"
          color="green"
        />
        <StatCard
          title="Total Workouts"
          value={stats?.total_workouts.toString() || "0"}
          icon={Trophy}
          description="This month"
          trend={{ value: 12, isPositive: true }}
          color="purple"
        />
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="goals">Goals</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-blue-600" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  {quickActions.map((action, index) => (
                    <QuickActionCard key={index} {...action} />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* AI Chat Assistant */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-green-600" />
                  AI Fitness Coach
                </CardTitle>
              </CardHeader>
              <CardContent>
                <AiChatAssistant />
              </CardContent>
            </Card>
          </div>

          {/* Today's Workout */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Dumbbell className="h-5 w-5 text-blue-600" />
                Today's Workout
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-green-800">Upper Body Strength</h3>
                    <span className="text-sm text-green-600">45 minutes • 6 exercises</span>
                  </div>
                  <p className="text-sm text-green-700 mb-3">
                    Focus on building upper body strength with compound movements
                  </p>
                  <div className="flex gap-2">
                    <Button 
                      onClick={handleStartWorkout}
                      disabled={workoutInProgress}
                      className="flex-1 sm:flex-none bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
                    >
                      <Play className="mr-2 h-4 w-4" />
                      Start Now
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setShowWorkoutModal(true)}
                      className="flex-1 sm:flex-none"
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="goals" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Your Fitness Goals</h2>
            <Button onClick={() => toast.info("Goal creation coming soon!")}>
              <Plus className="mr-2 h-4 w-4" />
              Add Goal
            </Button>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {goals?.map((goal) => (
              <GoalCard key={goal.id} goal={goal} />
            ))}
            {(!goals || goals.length === 0) && (
              <Card className="col-span-full">
                <CardContent className="p-8 text-center">
                  <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No goals set yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Set your first fitness goal to start tracking your progress
                  </p>
                  <Button onClick={() => toast.info("Goal creation coming soon!")}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Your First Goal
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="progress" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Progress Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <div className="text-2xl font-bold text-blue-600 mb-2">Progress Chart</div>
                  <p className="text-muted-foreground">Visual progress tracking coming soon!</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Recent Achievements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Card className="border-green-200 bg-green-50">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">🏆</div>
                        <div>
                          <h3 className="font-semibold text-sm">First Workout</h3>
                          <p className="text-xs text-muted-foreground">Completed your first workout</p>
                          <p className="text-xs text-green-600">
                            Unlocked {new Date().toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentSessions && recentSessions.length > 0 ? (
                  recentSessions.slice(0, 5).map((session) => (
                    <Card key={session.id}>
                      <CardContent className="p-3">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium text-sm">Workout Session</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(session.started_at).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">{session.status}</p>
                            <p className="text-xs text-muted-foreground">
                              {Math.floor(session.duration / 60)}m {session.duration % 60}s
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-4">
                    <p className="text-muted-foreground">No recent activity</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modals */}
      {showWorkoutModal && (
        <WorkoutDetailsModal 
          isOpen={showWorkoutModal}
          onClose={() => setShowWorkoutModal(false)}
          workoutId="sample-workout-id"
        />
      )}

      {/* Subscription Manager */}
      <SubscriptionManager />
    </div>
  );
};
