import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";

interface TrendInfo {
  value: number;
  label: string;
}

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  trend?: TrendInfo | null;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  description,
  trend = null,
}) => {
  const { t } = useLanguage();
  
  const trendLabel = trend
    ? `${trend.value > 0 ? "Up" : trend.value < 0 ? "Down" : "No change"} ${Math.abs(
        trend.value
      )}% ${trend.label}`
    : null;

  const trendColor = trend
    ? trend.value > 0
      ? "text-green-500"
      : trend.value < 0
      ? "text-red-500"
      : "text-gray-500"
    : "";

  return (
    <Card className="transition-all duration-200 hover:shadow-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">{description}</p>
          {trend && (
            <span className={trendColor + " text-xs font-medium flex items-center"}>
              {trendLabel}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export { StatCard };
export default StatCard;
