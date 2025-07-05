import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Trophy, Target, Flame, Play, Clock, Dumbbell, BarChart, Activity, Heart } from "lucide-react";
import { AiChatAssistant } from "@/components/ai/AiChatAssistant";
import { SubscriptionManager } from "@/components/subscription/SubscriptionManager";
import { useAuth } from "@/hooks/useAuthProvider";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

const StatCard = ({ title, value, icon: Icon, description, trend }: {
  title: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  trend?: { value: number; label: string };
}) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground">{description}</p>
      {trend && (
        <p className="text-xs text-green-600 mt-1">+{trend.value}% {trend.label}</p>
      )}
    </CardContent>
  </Card>
);

export const AthleteDashboard_Version2 = () => {
  const { profile } = useAuth();
  const [workoutInProgress, setWorkoutInProgress] = useState(false);
  const [workoutTime, setWorkoutTime] = useState(0);
  const [activeTab, setActiveTab] = useState("overview");
  const [heartRate, setHeartRate] = useState(72);
  const [caloriesBurned, setCaloriesBurned] = useState(0);

  useEffect(() => {
    // Simulate heart rate changes during workout
    if (workoutInProgress) {
      const heartRateInterval = setInterval(() => {
        setHeartRate(prev => {
          const variation = Math.floor(Math.random() * 10) - 3; // -3 to +6 variation
          return Math.min(Math.max(prev + variation, 70), 160); // Keep between 70-160 bpm
        });
        
        // Increment calories burned (simplified calculation)
        setCaloriesBurned(prev => prev + (Math.random() * 0.3));
      }, 3000);
      
      return () => clearInterval(heartRateInterval);
    }
  }, [workoutInProgress]);

  const handleStartWorkout = () => {
    if (!workoutInProgress) {
      setWorkoutInProgress(true);
      setWorkoutTime(0);
      setCaloriesBurned(0);
      toast.success("Workout started! Timer is now running.");
      
      // Simple timer that increments every second
      const timer = setInterval(() => {
        setWorkoutTime(prev => prev + 1);
      }, 1000);

      // Store timer reference so we can clear it later
      (window as any).workoutTimer = timer;
    } else {
      // End workout
      setWorkoutInProgress(false);
      clearInterval((window as any).workoutTimer);
      const minutes = Math.floor(workoutTime / 60);
      const seconds = workoutTime % 60;
      toast.success(`Workout completed! Duration: ${minutes}m ${seconds}s`, {
        description: `You burned approximately ${Math.round(caloriesBurned)} calories`
      });
      setWorkoutTime(0);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleViewDetails = () => {
    toast.info("Opening workout details...", {
      description: "Upper Body Strength: 6 exercises including Push-ups, Pull-ups, Bench Press, Shoulder Press, Bicep Curls, and Tricep Dips"
    });
  };

  const handleScheduleWorkout = () => {
    toast.success("Workout scheduled!", {
      description: "Your workout has been added to your calendar"
    });
  };

  const getHeartRateColor = (rate: number) => {
    if (rate < 100) return "text-green-500";
    if (rate < 140) return "text-orange-500";
    return "text-red-500";
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">My Fitness Journey</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back, {profile?.full_name ?? 'Athlete'}! Ready to crush your fitness goals?
          </p>
        </div>
        <Button 
          onClick={handleStartWorkout}
          className={`${
            workoutInProgress 
              ? 'bg-red-500 hover:bg-red-600' 
              : 'bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600'
          } w-full md:w-auto px-6 py-2 transition-all duration-300`}
        >
          {workoutInProgress ? (
            <>
              <Clock className="mr-2 h-4 w-4" />
              End Workout ({formatTime(workoutTime)})
            </>
          ) : (
            <>
              <Play className="mr-2 h-4 w-4" />
              Start Workout
            </>
          )}
        </Button>
      </div>

      {/* Workout Timer Card - shown when workout is in progress */}
      {workoutInProgress && (
        <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200 shadow-lg">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <div>
                  <h3 className="font-semibold text-lg">Workout In Progress</h3>
                  <p className="text-sm text-muted-foreground">Upper Body Strength</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 w-full md:w-auto">
                <div className="flex flex-col items-center justify-center p-2 bg-white dark:bg-card rounded-lg shadow-sm">
                  <Clock className="h-4 w-4 text-blue-500 mb-1" />
                  <span className="text-xl font-bold">{formatTime(workoutTime)}</span>
                  <span className="text-xs text-gray-500">Duration</span>
                </div>
                <div className="flex flex-col items-center justify-center p-2 bg-white dark:bg-card rounded-lg shadow-sm">
                  <Heart className={`h-4 w-4 ${getHeartRateColor(heartRate)} mb-1`} />
                  <span className={`text-xl font-bold ${getHeartRateColor(heartRate)}`}>{heartRate}</span>
                  <span className="text-xs text-gray-500">BPM</span>
                </div>
                <div className="flex flex-col items-center justify-center p-2 bg-white dark:bg-card rounded-lg shadow-sm">
                  <Flame className="h-4 w-4 text-orange-500 mb-1" />
                  <span className="text-xl font-bold">{Math.round(caloriesBurned)}</span>
                  <span className="text-xs text-gray-500">Calories</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
          <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          {/* Stats Overview */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Workouts This Week"
              value="4"
              icon={Calendar}
              description="2 more to go!"
              trend={{ value: 20, label: "vs last week" }}
            />
            <StatCard
              title="Streak"
              value="7 days"
              icon={Flame}
              description="Personal best!"
              trend={{ value: 40, label: "increase" }}
            />
            <StatCard
              title="Goals Achieved"
              value="3/5"
              icon={Target}
              description="60% complete"
              trend={{ value: 15, label: "this month" }}
            />
            <StatCard
              title="Total Workouts"
              value="42"
              icon={Trophy}
              description="This month"
              trend={{ value: 8, label: "vs last month" }}
            />
          </div>

          {/* Main Content Grid */}
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              {/* Today's Workout */}
              <Card>
                <CardHeader>
                  <CardTitle>Today's Workout</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg">
                    <div className="flex items-center space-x-3 mb-2">
                      <Dumbbell className="h-5 w-5 text-blue-600" />
                      <h3 className="font-semibold text-lg">Upper Body Strength</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">45 minutes • 6 exercises</p>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button 
                        size="sm" 
                        onClick={handleStartWorkout}
                        className="flex-1 sm:flex-none transition-all duration-300"
                        variant={workoutInProgress ? "destructive" : "default"}
                      >
                        {workoutInProgress ? (
                          <>
                            <Clock className="mr-2 h-4 w-4" />
                            End Workout
                          </>
                        ) : (
                          <>
                            <Play className="mr-2 h-4 w-4" />
                            Start Now
                          </>
                        )}
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

              {/* Weekly Progress */}
              <Card>
                <CardHeader>
                  <CardTitle>Weekly Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                      <div key={day} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                        <span className="font-medium">{day}</span>
                        <div className="flex-1 mx-4">
                          <Progress value={index < 4 ? 100 : index === 4 ? 60 : 0} className="h-2 bg-gray-200 dark:bg-gray-800" />
                        </div>
                        <div className="flex items-center space-x-2 min-w-[100px] text-right">
                          {index < 4 && <span className="text-green-600 font-semibold">✓ Completed</span>}
                          {index === 4 && <span className="text-blue-600 font-semibold">In Progress</span>}
                          {index > 4 && <span className="text-gray-400">Planned</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Upcoming Workouts */}
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Workouts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { name: 'Cardio Blast', time: 'Tomorrow • 30 min', icon: '🏃', intensity: 'Medium' },
                      { name: 'Leg Day', time: 'Sunday • 60 min', icon: '🦵', intensity: 'High' },
                      { name: 'Core & Flexibility', time: 'Monday • 20 min', icon: '🧘', intensity: 'Low' }
                    ].map((workout) => (
                      <div key={`${workout.name}-${workout.time}`} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 bg-gray-50 dark:bg-card rounded-lg gap-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{workout.icon}</span>
                          <div>
                            <p className="font-medium">{workout.name}</p>
                            <div className="flex items-center">
                              <p className="text-sm text-muted-foreground">{workout.time}</p>
                              <span className="mx-2 text-gray-300">•</span>
                              <span className={`text-xs px-2 py-0.5 rounded-full ${
                                workout.intensity === 'High' ? 'bg-red-100 text-red-700' :
                                workout.intensity === 'Medium' ? 'bg-orange-100 text-orange-700' :
                                'bg-green-100 text-green-700'
                              }`}>
                                {workout.intensity}
                              </span>
                            </div>
                          </div>
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
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Fitness Insights */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart className="h-5 w-5 mr-2 text-blue-500" />
                    Fitness Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Weekly Goal Progress</span>
                        <span className="text-sm font-medium">70%</span>
                      </div>
                      <Progress value={70} className="h-2 bg-gray-200 dark:bg-gray-800" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Monthly Target</span>
                        <span className="text-sm font-medium">45%</span>
                      </div>
                      <Progress value={45} className="h-2 bg-gray-200 dark:bg-gray-800" />
                    </div>
                    <div className="pt-2">
                      <h4 className="text-sm font-medium mb-2">Recent Achievements</h4>
                      <div className="space-y-2">
                        <div className="flex items-center p-2 bg-green-50 rounded-md">
                          <Trophy className="h-4 w-4 text-green-500 mr-2" />
                          <span className="text-sm">7-Day Streak Milestone</span>
                        </div>
                        <div className="flex items-center p-2 bg-blue-50 rounded-md">
                          <Activity className="h-4 w-4 text-blue-500 mr-2" />
                          <span className="text-sm">New Personal Best: Bench Press</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* AI Fitness Coach */}
              <AiChatAssistant />
              
              {/* Subscription Management */}
              <SubscriptionManager />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="progress" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Progress Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">Your fitness journey visualized over time</p>
              <div className="h-[300px] flex items-center justify-center bg-gray-50 dark:bg-card rounded-md">
                <p className="text-muted-foreground">Progress charts will be displayed here</p>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Body Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { label: 'Weight', value: '165 lbs', change: '-2.5 lbs this month' },
                    { label: 'Body Fat', value: '18%', change: '-1.2% this month' },
                    { label: 'Muscle Mass', value: '72.4 lbs', change: '+1.8 lbs this month' }
                  ].map((metric) => (
                    <div key={metric.label} className="flex justify-between items-center p-2 border-b last:border-0">
                      <span className="font-medium">{metric.label}</span>
                      <div className="text-right">
                        <div className="font-bold">{metric.value}</div>
                        <div className="text-xs text-green-600">{metric.change}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { label: 'Avg. Workout Duration', value: '42 min', change: '+5 min from last month' },
                    { label: 'Weekly Active Days', value: '4.5 days', change: '+0.5 days from last month' },
                    { label: 'Calories Burned (Weekly)', value: '3,240', change: '+320 from last month' }
                  ].map((metric) => (
                    <div key={metric.label} className="flex justify-between items-center p-2 border-b last:border-0">
                      <span className="font-medium">{metric.label}</span>
                      <div className="text-right">
                        <div className="font-bold">{metric.value}</div>
                        <div className="text-xs text-green-600">{metric.change}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="nutrition" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Nutrition Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">Track your daily nutrition and calorie intake</p>
              
              <div className="grid gap-4 md:grid-cols-4 mb-6">
                <div className="p-4 bg-blue-50 rounded-lg text-center">
                  <h3 className="text-sm font-medium text-gray-500">Calories</h3>
                  <p className="text-2xl font-bold">1,840</p>
                  <p className="text-xs text-gray-500">of 2,200 goal</p>
                  <Progress value={83} className="h-1 mt-2 bg-gray-200 dark:bg-gray-800" />
                </div>
                <div className="p-4 bg-red-50 rounded-lg text-center">
                  <h3 className="text-sm font-medium text-gray-500">Protein</h3>
                  <p className="text-2xl font-bold">96g</p>
                  <p className="text-xs text-gray-500">of 120g goal</p>
                  <Progress value={80} className="h-1 mt-2 bg-gray-200 dark:bg-gray-800" />
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg text-center">
                  <h3 className="text-sm font-medium text-gray-500">Carbs</h3>
                  <p className="text-2xl font-bold">210g</p>
                  <p className="text-xs text-gray-500">of 250g goal</p>
                  <Progress value={84} className="h-1 mt-2 bg-gray-200 dark:bg-gray-800" />
                </div>
                <div className="p-4 bg-green-50 rounded-lg text-center">
                  <h3 className="text-sm font-medium text-gray-500">Fats</h3>
                  <p className="text-2xl font-bold">58g</p>
                  <p className="text-xs text-gray-500">of 70g goal</p>
                  <Progress value={82} className="h-1 mt-2 bg-gray-200 dark:bg-gray-800" />
                </div>
              </div>
              
              <h3 className="font-medium mb-2">Today's Meals</h3>
              <div className="space-y-3">
                {[
                  { meal: 'Breakfast', food: 'Oatmeal with berries and protein shake', calories: 420, time: '7:30 AM' },
                  { meal: 'Lunch', food: 'Grilled chicken salad with olive oil dressing', calories: 580, time: '12:15 PM' },
                  { meal: 'Snack', food: 'Greek yogurt with nuts', calories: 240, time: '3:00 PM' },
                  { meal: 'Dinner', food: 'Salmon with quinoa and vegetables', calories: 600, time: '7:00 PM' }
                ].map((meal) => (
                  <div key={`${meal.meal}-${meal.time}`} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-card rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <div>
                      <div className="flex items-center">
                        <span className="font-medium">{meal.meal}</span>
                        <span className="text-xs text-gray-500 ml-2">• {meal.time}</span>
                      </div>
                      <p className="text-sm text-gray-600">{meal.food}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-bold">{meal.calories}</span>
                      <span className="text-xs text-gray-500"> cal</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};