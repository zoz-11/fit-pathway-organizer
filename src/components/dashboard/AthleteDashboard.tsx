import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Dumbbell, PlayCircle, Trophy } from "lucide-react";
import { useAuth } from "@/hooks/useAuthProvider";
import { useNavigate } from "react-router-dom";

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, description }) => {
  return (
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
};

export const AthleteDashboard: React.FC = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();

  const handleViewUpcomingWorkout = () => {
    navigate('/schedule');
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Athlete Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back, {profile?.full_name ?? "Athlete"}! Here's your current progress.
          </p>
        </div>
        <Button 
          onClick={handleViewUpcomingWorkout}
          className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 w-full md:w-auto"
        >
          View Upcoming Workout
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Workouts Completed"
          value="24"
          icon={Dumbbell}
          description="Great job this month"
        />
        <StatCard
          title="Next Workout"
          value="Leg Day"
          icon={Calendar}
          description="Tomorrow 7:00 AM"
        />
        <StatCard
          title="Current Program"
          value="Hypertrophy"
          icon={PlayCircle}
          description="Week 3 of 8"
        />
        <StatCard
          title="Achievements"
          value="5"
          icon={Trophy}
          description="Keep it up!"
        />
      </div>

      {/* Placeholder for future athlete-specific widgets */}
      <Card>
        <CardHeader>
          <CardTitle>Your Progress Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Progress charts and analytics will appear here.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AthleteDashboard; 