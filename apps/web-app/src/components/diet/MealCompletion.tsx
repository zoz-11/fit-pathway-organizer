import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Plus, Minus } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

interface MealItem {
  name: string;
  calories: number;
  protein: string;
}

interface MealCompletionProps {
  mealName: string;
  foods: MealItem[];
  icon: React.ComponentType<any>;
  color: string;
}

export const MealCompletion = ({
  mealName,
  foods,
  icon: Icon,
  color,
}: MealCompletionProps) => {
  const { t } = useLanguage();
  const [completed, setCompleted] = useState(false);
  const [servings, setServings] = useState<{ [key: string]: number }>({});

  const handleMealComplete = () => {
    setCompleted(!completed);
    toast.success(
      completed ? t("mealCompletion.toast.incomplete", { mealName }) : t("mealCompletion.toast.complete", { mealName }),
    );
  };

  const updateServing = (foodName: string, change: number) => {
    const current = servings[foodName] || 1;
    const newValue = Math.max(0, current + change);
    setServings((prev) => ({ ...prev, [foodName]: newValue }));
  };

  const getTotalCalories = () => {
    return foods.reduce((total, food) => {
      const serving = servings[food.name] || 1;
      return total + food.calories * serving;
    }, 0);
  };

  const getTotalProtein = () => {
    return foods.reduce((total, food) => {
      const serving = servings[food.name] || 1;
      return total + parseInt(food.protein) * serving;
    }, 0);
  };

  return (
    <Card className={completed ? "bg-green-50 border-green-200" : ""}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Icon className={`h-6 w-6 ${color}`} />
            <CardTitle className="text-xl">{mealName}</CardTitle>
            {completed && <Check className="h-5 w-5 text-green-600" />}
          </div>
          <Button
            size="sm"
            variant={completed ? "secondary" : "default"}
            onClick={handleMealComplete}
          >
            {completed ? t("mealCompletion.markIncomplete") : t("mealCompletion.markComplete")}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {foods.map((food, foodIndex) => {
            const serving = servings[food.name] || 1;
            return (
              <div
                key={foodIndex}
                className="flex items-center justify-between p-3 bg-white dark:bg-card rounded-lg"
              >
                <div className="flex-1">
                  <p className="font-medium">{food.name}</p>
                  <p className="text-sm text-gray-600">
                    {food.calories * serving} {t("mealCompletion.calories")} •{" "}
                    {parseInt(food.protein) * serving}g {t("mealCompletion.protein")}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateServing(food.name, -0.5)}
                    disabled={serving <= 0}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="text-sm font-medium min-w-8 text-center">
                    {serving}x
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateServing(food.name, 0.5)}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-4 pt-3 border-t">
          <div className="flex justify-between text-sm">
            <span className="font-medium">{t("mealCompletion.mealTotal")}</span>
            <span>
              {getTotalCalories()} {t("mealCompletion.calories")} • {getTotalProtein()}g {t("mealCompletion.protein")}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
