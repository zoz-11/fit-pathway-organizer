
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { handleApiError } from "@/lib/utils";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';

interface ProgressData {
  date: string;
  count: number;
}

interface ProgressChartsProps {
  userId?: string; // Optional, for trainers to view athlete progress
}

export const ProgressCharts: React.FC<ProgressChartsProps> = ({ userId }) => {
  const { data, isLoading, error } = useQuery<ProgressData[]>({ 
    queryKey: ['progressData', userId],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('fetch-progress-data', {
        body: { userId: userId }
      });
      if (error) {
        handleApiError(error, `Failed to fetch progress data`);
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
          Error loading progress data: {error.message}
        </CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardContent className="p-4 text-muted-foreground">
          No progress data available yet.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Workout Progress Over Time</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={data}
            margin={{
              top: 5, right: 30, left: 20, bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tickFormatter={(tick) => format(new Date(tick), 'MMM dd')} />
            <YAxis />
            <Tooltip labelFormatter={(label) => `Date: ${format(new Date(label), 'PPP')}`} />
            <Legend />
            <Line type="monotone" dataKey="count" stroke="#8884d8" activeDot={{ r: 8 }} name="Workouts Completed" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
