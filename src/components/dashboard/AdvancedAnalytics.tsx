
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { handleApiError } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Dumbbell, Clock, TrendingUp } from 'lucide-react';

interface AnalyticsData {
  totalWorkouts: number;
  totalDuration: number;
  mostFrequentExercise: string;
  mostFrequentExerciseCount: number;
  exerciseFrequency: { [key: string]: number };
}

interface AdvancedAnalyticsProps {
  userId?: string; // Optional, for trainers to view athlete analytics
}

export const AdvancedAnalytics: React.FC<AdvancedAnalyticsProps> = ({ userId }) => {
  const { data, isLoading, error } = useQuery<AnalyticsData>({ 
    queryKey: ['advancedAnalytics', userId],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('fetch-analytics-data', {
        body: { userId: userId }
      });
      if (error) {
        handleApiError(error, `Failed to fetch analytics data`);
        throw error;
      }
      return data;
    },
  });

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-4 text-red-500">
          Error loading analytics data: {error.message}
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card>
        <CardContent className="p-4 text-muted-foreground">
          No analytics data available yet.
        </CardContent>
      </Card>
    );
  }

  const exerciseFrequencyData = Object.entries(data.exerciseFrequency).map(([name, count]) => ({
    name,
    count,
  })).sort((a, b) => b.count - a.count).slice(0, 5); // Top 5 exercises

  return (
    <Card>
      <CardHeader>
        <CardTitle>Advanced Analytics</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Workouts</CardTitle>
              <Dumbbell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.totalWorkouts}</div>
              <p className="text-xs text-muted-foreground">Completed workouts</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Duration</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.totalDuration} min</div>
              <p className="text-xs text-muted-foreground">Total exercise time</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Most Frequent Exercise</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.mostFrequentExercise}</div>
              <p className="text-xs text-muted-foreground">{data.mostFrequentExerciseCount} times</p>
            </CardContent>
          </Card>
        </div>

        {exerciseFrequencyData.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Top 5 Exercises</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={exerciseFrequencyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#8884d8" name="Times Completed" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
