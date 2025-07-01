import { Card, CardContent } from '@/components/ui/card';

interface AchievementCardProps {
  title: string;
  description: string;
  icon: string;
  unlockedAt: string;
}

export const AchievementCard = ({ title, description, icon, unlockedAt }: AchievementCardProps) => {
  return (
    <Card className="border-green-200 bg-green-50">
      <CardContent className="p-4">
        <div className="flex items-center space-x-3">
          <div className="text-2xl">{icon}</div>
          <div>
            <h3 className="font-semibold text-sm">{title}</h3>
            <p className="text-xs text-muted-foreground">{description}</p>
            <p className="text-xs text-green-600">
              Unlocked {new Date(unlockedAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}; 