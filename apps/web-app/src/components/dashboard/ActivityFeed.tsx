import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";

interface ActivityItem {
  id: string;
  text: string;
  timestamp: string;
  type: "success" | "info" | "warning" | "error";
}

// Mock data for when Edge Functions are unavailable
const MOCK_ACTIVITY_DATA: ActivityItem[] = [
  {
    id: "1",
    text: "Completed strength training workout",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    type: "success",
  },
  {
    id: "2",
    text: "Achieved new personal record on bench press",
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
    type: "success",
  },
  {
    id: "3",
    text: "Scheduled cardio session for tomorrow",
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
    type: "info",
  },
  {
    id: "4",
    text: "Missed scheduled workout - consider rescheduling",
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // 8 hours ago
    type: "warning",
  },
  {
    id: "5",
    text: "Updated nutrition plan",
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
    type: "info",
  },
];

const ActivityFeed: React.FC = () => {
  const { t } = useLanguage();

  const { data, isLoading, error } = useQuery<ActivityItem[]>({
    queryKey: ["activityFeed"],
    queryFn: async () => {
      const { data: activities, error } = await supabase
        .from("activity_feed")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) throw error;

      return activities.map((activity) => ({
        id: activity.id,
        text: activity.text,
        timestamp: activity.created_at,
        type: activity.type,
      }));
    },
    retry: false,
  });

  const activities = data || MOCK_ACTIVITY_DATA;

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t("dashboard.activityFeed")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <p>{t("common.loading")}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("dashboard.activityFeed")}</CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 rounded bg-yellow-50 p-3 text-sm text-yellow-800">
            {t("dashboard.usingMockData")}
          </div>
        )}
        <div className="space-y-4">
          {activities.map((item) => (
            <div
              key={item.id}
              className={`flex items-start space-x-3 rounded-lg p-3 ${
                item.type === "success"
                  ? "bg-green-50"
                  : item.type === "warning"
                    ? "bg-yellow-50"
                    : item.type === "error"
                      ? "bg-red-50"
                      : "bg-blue-50"
              }`}
            >
              <div className="flex-1">
                <p
                  className={`text-sm font-medium ${
                    item.type === "success"
                      ? "text-green-900"
                      : item.type === "warning"
                        ? "text-yellow-900"
                        : item.type === "error"
                          ? "text-red-900"
                          : "text-blue-900"
                  }`}
                >
                  {item.text}
                </p>
                <p
                  className={`mt-1 text-xs ${
                    item.type === "success"
                      ? "text-green-700"
                      : item.type === "warning"
                        ? "text-yellow-700"
                        : item.type === "error"
                          ? "text-red-700"
                          : "text-blue-700"
                  }`}
                >
                  {new Date(item.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityFeed;
