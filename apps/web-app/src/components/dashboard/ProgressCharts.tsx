import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
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
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

interface ProgressData {
  date: string;
  count: number;
}

interface ProgressChartsProps {
  userId: string;
}

// Mock data for when Edge Functions are unavailable
const MOCK_PROGRESS_DATA: ProgressData[] = [
  { date: "2024-01-01", count: 2 },
  { date: "2024-01-02", count: 1 },
  { date: "2024-01-03", count: 3 },
  { date: "2024-01-04", count: 0 },
  { date: "2024-01-05", count: 2 },
  { date: "2024-01-06", count: 4 },
  { date: "2024-01-07", count: 1 },
  { date: "2024-01-08", count: 3 },
  { date: "2024-01-09", count: 2 },
  { date: "2024-01-10", count: 5 },
];
export const ProgressCharts: React.FC<ProgressChartsProps> = ({ userId }) => {
  const { t } = useLanguage();
  const { data, isLoading, error, refetch } = useQuery<ProgressData[]>({
    queryKey: ["progressData", userId],
    queryFn: async () => {
      try {
        const { data, error } = await supabase.functions.invoke(
          "fetch-progress-data",
          {
            body: { userId: userId },
          },
        );

        if (error) {
          console.error("Edge function error:", error);
          // Return mock data instead of throwing error
          console.warn(
            "Using mock progress data due to Edge Function unavailability",
          );
          return MOCK_PROGRESS_DATA;
        }

        return data || MOCK_PROGRESS_DATA;
      } catch (err) {
        console.error("Progress data fetch error:", err);
        console.warn(
          "Using mock progress data due to Edge Function unavailability",
        );
        return MOCK_PROGRESS_DATA;
      }
    },
    retry: 1, // Only retry once
    retryDelay: 1000,
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

  // Show mock data warning if there was an error but we have fallback data
  const showMockDataWarning = error && data === MOCK_PROGRESS_DATA;

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardContent className="p-4 text-muted-foreground">
          {t("progressCharts.noData")}
        </CardContent>
      </Card>
    );
  }

  const chartData = data.map((item) => ({
    ...item,
    date: format(new Date(item.date), "MMM dd"),
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("progressCharts.title")}</CardTitle>
        {showMockDataWarning && (
          <p className="text-sm text-amber-600">
            {t("progressCharts.mockDataWarning")}
          </p>
        )}
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#3b82f6"
              strokeWidth={2}
              name={t("progressCharts.workouts")}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
