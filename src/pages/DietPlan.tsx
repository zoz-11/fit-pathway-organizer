import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Apple, Coffee, Utensils, Moon } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { toast } from "sonner";

const DietPlan = () => {
  const handleMealComplete = (meal: string) => {
    toast.success(`${meal} completed!`);
  };

  const meals = [
    {
      time: "Breakfast",
      icon: Coffee,
      color: "text-orange-600",
      foods: [
        { name: "Oatmeal with berries", calories: 320, protein: "12g" },
        { name: "Greek yogurt", calories: 150, protein: "15g" },
        { name: "Banana", calories: 105, protein: "1g" }
      ]
    },
    {
      time: "Lunch",
      icon: Utensils,
      color: "text-green-600",
      foods: [
        { name: "Grilled chicken breast", calories: 250, protein: "46g" },
        { name: "Quinoa salad", calories: 180, protein: "6g" },
        { name: "Mixed vegetables", calories: 50, protein: "2g" }
      ]
    },
    {
      time: "Snack",
      icon: Apple,
      color: "text-red-600",
      foods: [
        { name: "Protein shake", calories: 200, protein: "25g" },
        { name: "Almonds (handful)", calories: 160, protein: "6g" }
      ]
    },
    {
      time: "Dinner",
      icon: Moon,
      color: "text-purple-600",
      foods: [
        { name: "Baked salmon", calories: 280, protein: "39g" },
        { name: "Sweet potato", calories: 112, protein: "2g" },
        { name: "Steamed broccoli", calories: 30, protein: "3g" }
      ]
    }
  ];

  const totalCalories = meals.reduce((total, meal) => 
    total + meal.foods.reduce((mealTotal, food) => mealTotal + food.calories, 0), 0
  );

  const totalProtein = meals.reduce((total, meal) => 
    total + meal.foods.reduce((mealTotal, food) => mealTotal + parseInt(food.protein), 0), 0
  );

  return (
    <AppLayout>
      <div className="space-y-6 p-4 md:p-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">My Diet Plan</h1>
          <p className="text-muted-foreground mt-1">
            Your personalized nutrition plan for optimal fitness results
          </p>
        </div>

        {/* Daily Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Today's Nutrition Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{totalCalories}</p>
                <p className="text-sm text-gray-600">Total Calories</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{totalProtein}g</p>
                <p className="text-sm text-gray-600">Protein</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-orange-600">2.5L</p>
                <p className="text-sm text-gray-600">Water Goal</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">4/4</p>
                <p className="text-sm text-gray-600">Meals Planned</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Meal Plans */}
        <div className="grid gap-6">
          {meals.map((meal, index) => {
            const Icon = meal.icon;
            return (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Icon className={`h-6 w-6 ${meal.color}`} />
                      <CardTitle className="text-xl">{meal.time}</CardTitle>
                    </div>
                    <Button 
                      size="sm"
                      onClick={() => handleMealComplete(meal.time)}
                    >
                      Mark Complete
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {meal.foods.map((food, foodIndex) => (
                      <div key={foodIndex} className="flex items-center justify-between p-3 bg-white dark:bg-card rounded-lg">
                        <div>
                          <p className="font-medium">{food.name}</p>
                          <p className="text-sm text-gray-600">{food.calories} cal • {food.protein} protein</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-3 border-t">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">Meal Total:</span>
                      <span>
                        {meal.foods.reduce((total, food) => total + food.calories, 0)} calories • 
                        {meal.foods.reduce((total, food) => total + parseInt(food.protein), 0)}g protein
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
};

export default DietPlan;
