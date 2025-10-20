import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Apple, Coffee, Utensils, Moon } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { toast } from "sonner";
import { MealCompletion } from "@/components/diet/MealCompletion";
import { useLanguage } from "@/contexts/LanguageContext";

const DietPlan = () => {
  const { t } = useLanguage();
  const handleMealComplete = (meal: string) => {
    toast.success(t("dietPlan.toast.mealCompleted", { meal }));
  };

  const meals = [
    {
      time: t("dietPlan.meals.breakfast.title"),
      icon: Coffee,
      color: "text-orange-600",
      foods: [
        { name: t("dietPlan.meals.breakfast.food1.name"), calories: 320, protein: "12g" },
        { name: t("dietPlan.meals.breakfast.food2.name"), calories: 150, protein: "15g" },
        { name: t("dietPlan.meals.breakfast.food3.name"), calories: 105, protein: "1g" },
      ],
    },
    {
      time: t("dietPlan.meals.lunch.title"),
      icon: Utensils,
      color: "text-green-600",
      foods: [
        { name: t("dietPlan.meals.lunch.food1.name"), calories: 250, protein: "46g" },
        { name: t("dietPlan.meals.lunch.food2.name"), calories: 180, protein: "6g" },
        { name: t("dietPlan.meals.lunch.food3.name"), calories: 50, protein: "2g" },
      ],
    },
    {
      time: t("dietPlan.meals.snack.title"),
      icon: Apple,
      color: "text-red-600",
      foods: [
        { name: t("dietPlan.meals.snack.food1.name"), calories: 200, protein: "25g" },
        { name: t("dietPlan.meals.snack.food2.name"), calories: 160, protein: "6g" },
      ],
    },
    {
      time: t("dietPlan.meals.dinner.title"),
      icon: Moon,
      color: "text-purple-600",
      foods: [
        { name: t("dietPlan.meals.dinner.food1.name"), calories: 280, protein: "39g" },
        { name: t("dietPlan.meals.dinner.food2.name"), calories: 112, protein: "2g" },
        { name: t("dietPlan.meals.dinner.food3.name"), calories: 30, protein: "3g" },
      ],
    },
  ];

  const totalCalories = meals.reduce(
    (total, meal) =>
      total +
      meal.foods.reduce((mealTotal, food) => mealTotal + food.calories, 0),
    0,
  );

  const totalProtein = meals.reduce(
    (total, meal) =>
      total +
      meal.foods.reduce(
        (mealTotal, food) => mealTotal + parseInt(food.protein),
        0,
      ),
    0,
  );

  return (
    <AppLayout>
      <div className="space-y-6 p-4 md:p-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            {t("dietPlan.title")}
          </h1>
          <p className="text-muted-foreground mt-1">
            {t("dietPlan.description")}
          </p>
        </div>

        {/* Daily Summary */}
        <Card>
          <CardHeader>
            <CardTitle>{t("dietPlan.summary.title")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">
                  {totalCalories}
                </p>
                <p className="text-sm text-gray-600">{t("dietPlan.summary.totalCalories")}</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {totalProtein}g
                </p>
                <p className="text-sm text-gray-600">{t("dietPlan.summary.protein")}</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-orange-600">2.5L</p>
                <p className="text-sm text-gray-600">{t("dietPlan.summary.waterGoal")}</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">4/4</p>
                <p className="text-sm text-gray-600">{t("dietPlan.summary.mealsPlanned")}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Meal Plans */}
        <div className="grid gap-6">
          {meals.map((meal, index) => (
            <MealCompletion
              key={index}
              mealName={meal.time}
              foods={meal.foods}
              icon={meal.icon}
              color={meal.color}
            />
          ))}
        </div>
      </div>
    </AppLayout>
  );
};

export default DietPlan;
