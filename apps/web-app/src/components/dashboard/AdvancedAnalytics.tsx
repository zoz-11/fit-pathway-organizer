import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useLanguage } from "@/contexts/LanguageContext";

interface AnalyticsData {
  workoutTypes: { name: string; count: number }[];
  weeklyStats: { week: string; workouts: number; duration: number }[];
  monthlyProgress: {
    month: string;
    totalWorkouts: number;
    avgDuration: number;
  }[];
}

interface AdvancedAnalyticsProps {
  userId: string;
}

const AdvancedAnalytics: React.FC<AdvancedAnalyticsProps> = ({ userId }) => {
  const { t } = useLanguage();

  const fetchAnalytics = async (): Promise<AnalyticsData> => {
    // Fetch workout types distribution
    const { data: workouts, error: workoutsError } = await supabase
      .from("workouts")
      .select("workout_type")
      .eq("user_id", userId);

    if (workoutsError) throw workoutsError;

    const workoutTypes = workouts.reduce(
      (acc: { name: string; count: number }[], workout) => {
        const existing = acc.find((item) => item.name === workout.workout_type);
        if (existing) {
          existing.count += 1;
        } else {
          acc.push({ name: workout.workout_type, count: 1 });
        }
        return acc;
      },
      [],
    );

    // Fetch weekly stats
    const { data: weeklyData, error: weeklyError } = await supabase
      .from("workout_stats")
      .select("week, total_workouts, total_duration")
      .eq("user_id", userId)
      .order("week", { ascending: true })
      .limit(12);

    if (weeklyError) throw weeklyError;

    const weeklyStats = (weeklyData || []).map((stat) => ({
      week: stat.week,
      workouts: stat.total_workouts,
      duration: stat.total_duration,
    }));

    // Fetch monthly progress
    const { data: monthlyData, error: monthlyError } = await supabase
      .from("monthly_progress")
      .select("month, total_workouts, avg_duration")
      .eq("user_id", userId)
      .order("month", { ascending: true })
      .limit(6);

    if (monthlyError) throw monthlyError;

    const monthlyProgress = (monthlyData || []).map((stat) => ({
      month: stat.month,
      totalWorkouts: stat.total_workouts,
      avgDuration: stat.avg_duration,
    }));

    return {
      workoutTypes,
      weeklyStats,
      monthlyProgress,
    };
  };

  const { data, isLoading, error } = useQuery<AnalyticsData>({
    queryKey: ["analytics", userId],
    queryFn: fetchAnalytics,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <p>{t("common.loading")}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-red-600">
        <p>
          {t("common.error")}:
          {error instanceof Error ? error.message : t("common.unknownError")}
        </p>
      </div>
    );
  }

  if (!data) return null;

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t("analytics.workoutDistribution")}</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data.workoutTypes}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent = 0 }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {data.workoutTypes.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("analytics.weeklyStats")}</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.weeklyStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="workouts" fill="#8884d8" />
              <Bar dataKey="duration" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("analytics.monthlyProgress")}</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.monthlyProgress}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="totalWorkouts" fill="#8884d8" />
              <Bar dataKey="avgDuration" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvancedAnalytics;
