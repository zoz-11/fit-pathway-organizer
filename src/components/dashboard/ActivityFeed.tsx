
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { handleApiError } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatDistanceToNow } from 'date-fns';
import { Activity } from 'lucide-react';

interface ActivityItem {
  id: string;
  type: string;
  description: string;
  timestamp: string;
}

export const ActivityFeed: React.FC = () => {
  const { data: activities, isLoading, error } = useQuery<ActivityItem[]>({ 
    queryKey: ['activityFeed'],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('fetch-activity-feed');
      if (error) {
        handleApiError(error, `Failed to fetch activity feed`);
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
          Error loading activity feed: {error.message}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Activity className="h-5 w-5 text-purple-600" />
          <CardTitle>Recent Activity</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {activities && activities.length > 0 ? (
          <ScrollArea className="h-[300px]">
            <div className="space-y-4 pr-4">
              {activities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    {/* You can use different icons based on activity.type */}
                    <Activity className="h-4 w-4 text-gray-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{activity.description}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        ) : (
          <p className="text-muted-foreground">No recent activity.</p>
        )}
      </CardContent>
    </Card>
  );
};
