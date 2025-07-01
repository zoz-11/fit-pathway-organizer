import { Card, CardContent } from '@/components/ui/card';
import type { WorkoutSession } from '@/types';

interface RecentActivityProps {
  sessions: WorkoutSession[];
}

export const RecentActivity = ({ sessions }: RecentActivityProps) => {
  return (
    <div className="space-y-3">
      {sessions.length === 0 ? (
        <div className="text-center py-4">
          <p className="text-muted-foreground">No recent activity</p>
        </div>
      ) : (
        sessions.slice(0, 5).map((session) => (
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
      )}
    </div>
  );
}; 