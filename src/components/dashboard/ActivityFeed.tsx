import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { handleApiError } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ActivityItem {
  id: string;
  text: string;
  timestamp: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

// Mock data for when Edge Functions are unavailable
const MOCK_ACTIVITY_DATA: ActivityItem[] = [
  {
    id: '1',
    text: 'Completed strength training workout',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    type: 'success'
  },
  {
    id: '2',
    text: 'Achieved new personal record on bench press',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
    type: 'success'
  },
  {
    id: '3',
    text: 'Scheduled cardio session for tomorrow',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
    type: 'info'
  },
  {
    id: '4',
    text: 'Missed scheduled workout - consider rescheduling',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    type: 'warning'
  },
  {
    id: '5',
    text: 'Updated fitness goals and targets',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    type: 'info'
  }
];

export const ActivityFeed = () => {
  const { data, isLoading, error, refetch } = useQuery<ActivityItem[]>({ 
    queryKey: ['activityFeed'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase.functions.invoke('fetch-activity-feed');
        
        if (error) {
          console.error("Edge function error:", error);
          // Return mock data instead of throwing error
          console.warn("Using mock activity data due to Edge Function unavailability");
          return MOCK_ACTIVITY_DATA;
        }
        
        return data || MOCK_ACTIVITY_DATA;
      } catch (err) {
        console.error("Activity feed fetch error:", err);
        console.warn("Using mock activity data due to Edge Function unavailability");
        return MOCK_ACTIVITY_DATA;
      }
    },
    retry: 1, // Only retry once
    retryDelay: 1000,
  });

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'success': return '🟢';
      case 'info': return '🔵';
      case 'warning': return '🟡';
      case 'error': return '🔴';
      default: return '⚪';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit', 
      minute: '2-digit'
    }).format(date);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </CardContent>
      </Card>
    );
  }

  // Show mock data warning if there was an error but we have fallback data
  const showMockDataWarning = error && data === MOCK_ACTIVITY_DATA;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        {showMockDataWarning && (
          <p className="text-sm text-amber-600">
            Showing sample data - Edge Functions unavailable
          </p>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data && data.length > 0 ? (
            data.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3 border-b pb-3 last:border-0">
                <div className="text-lg">{getActivityIcon(activity.type)}</div>
                <div className="flex-1">
                  <p className="text-sm">{activity.text}</p>
                  <p className="text-xs text-muted-foreground">{formatTimestamp(activity.timestamp)}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground text-center py-4">No recent activity to display.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
