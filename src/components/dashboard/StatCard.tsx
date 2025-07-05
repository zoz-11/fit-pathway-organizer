import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import * as React from "react";

const StatCard = ({
  title,
  value,
  icon: Icon,
  description,
  trend = null,
}: {
  title: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  trend?: { value: number; label: string } | null;
}) => (
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
          <span
            className={`text-xs font-medium flex items-center ${
              trend.value > 0
                ? "text-green-500"
                : trend.value < 0
                ? "text-red-500"
                : "text-gray-500"
            }`}
          >
            {(() => {
              const trendArrow = trend.value > 0 ? "↑" : trend.value < 0 ? "↓" : "→";
              return trendArrow;
            })()} {Math.abs(trend.value)}% {" "}
            {trend.label}
          </span>
        )}
      </div>
    </CardContent>
  </Card>
);

export default StatCard;
