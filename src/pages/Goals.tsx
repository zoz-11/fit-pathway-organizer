import React, { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { handleApiError } from "@/lib/utils";
import { PlusCircle, Edit, Trash2, CheckCircle, XCircle } from "lucide-react";
import { format } from "date-fns";

interface Goal {
  id: string;
  user_id: string;
  goal_type: 'weight' | 'strength' | 'cardio' | 'nutrition' | 'other';
  target_value: number | null;
  target_date: string | null;
  description: string;
  status: 'active' | 'completed' | 'abandoned';
  created_at: string;
  updated_at: string;
}

const Goals = () => {
  const queryClient = useQueryClient();
  const [newGoal, setNewGoal] = useState<Partial<Goal>>({
    goal_type: 'other',
    description: '',
    status: 'active',
  });
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);

  const { data: goals, isLoading, error } = useQuery<Goal[]>({ 
    queryKey: ['goals'],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('manage-goals', {
        body: { action: 'fetch' }
      });
      if (error) throw error;
      return data;
    },
  });

  const createGoalMutation = useMutation({
    mutationFn: async (goalData: Partial<Goal>) => {
      const { data, error } = await supabase.functions.invoke('manage-goals', {
        body: { action: 'create', goal: goalData }
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      setNewGoal({ goal_type: 'other', description: '', status: 'active' });
      toast.success("Goal created successfully!");
    },
    onError: (err) => {
      handleApiError(err, `Failed to create goal`);
    },
  });

  const updateGoalMutation = useMutation({
    mutationFn: async (goalData: Partial<Goal>) => {
      if (!goalData.id) throw new Error("Goal ID is required for update.");
      const { data, error } = await supabase.functions.invoke('manage-goals', {
        body: { action: 'update', goalId: goalData.id, goal: goalData }
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      setEditingGoal(null);
      toast.success("Goal updated successfully!");
    },
    onError: (err) => {
      handleApiError(err, `Failed to update goal`);
    },
  });

  const deleteGoalMutation = useMutation({
    mutationFn: async (goalId: string) => {
      const { data, error } = await supabase.functions.invoke('manage-goals', {
        body: { action: 'delete', goalId }
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      toast.success("Goal deleted successfully!");
    },
    onError: (err) => {
      handleApiError(err, `Failed to delete goal`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingGoal) {
      updateGoalMutation.mutate(editingGoal);
    } else {
      createGoalMutation.mutate(newGoal);
    }
  };

  const handleEditClick = (goal: Goal) => {
    setEditingGoal({ ...goal, target_date: goal.target_date ? format(new Date(goal.target_date), 'yyyy-MM-dd') : null });
    setNewGoal({ goal_type: 'other', description: '', status: 'active' }); // Clear new goal form
  };

  const handleCancelEdit = () => {
    setEditingGoal(null);
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="p-4 md:p-6">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-4">Goals</h1>
          <p>Loading goals...</p>
        </div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout>
        <div className="p-4 md:p-6">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-4">Goals</h1>
          <p className="text-red-500">Error loading goals: {error.message}</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6 p-4 md:p-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Goals</h1>
          <p className="text-muted-foreground mt-1">
            Set and track your fitness and nutrition goals.
          </p>
        </div>

        {/* Goal Form */}
        <Card>
          <CardHeader>
            <CardTitle>{editingGoal ? "Edit Goal" : "Add New Goal"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="goal-type">Goal Type</Label>
                <Select
                  value={editingGoal?.goal_type || newGoal.goal_type}
                  onValueChange={(value: Goal['goal_type']) =>
                    editingGoal
                      ? setEditingGoal({ ...editingGoal, goal_type: value })
                      : setNewGoal({ ...newGoal, goal_type: value })
                  }
                >
                  <SelectTrigger id="goal-type">
                    <SelectValue placeholder="Select a goal type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weight">Weight</SelectItem>
                    <SelectItem value="strength">Strength</SelectItem>
                    <SelectItem value="cardio">Cardio</SelectItem>
                    <SelectItem value="nutrition">Nutrition</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="e.g., Lose 10 lbs, Run a marathon, Lift 200 lbs"
                  value={editingGoal?.description || newGoal.description}
                  onChange={(e) =>
                    editingGoal
                      ? setEditingGoal({ ...editingGoal, description: e.target.value })
                      : setNewGoal({ ...newGoal, description: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="target-value">Target Value (optional)</Label>
                <Input
                  id="target-value"
                  type="number"
                  step="0.01"
                  placeholder="e.g., 150 (lbs), 200 (lbs), 26.2 (miles)"
                  value={editingGoal?.target_value || newGoal.target_value || ''}
                  onChange={(e) =>
                    editingGoal
                      ? setEditingGoal({ ...editingGoal, target_value: parseFloat(e.target.value) || null })
                      : setNewGoal({ ...newGoal, target_value: parseFloat(e.target.value) || null })
                  }
                />
              </div>
              <div>
                <Label htmlFor="target-date">Target Date (optional)</Label>
                <Input
                  id="target-date"
                  type="date"
                  value={editingGoal?.target_date || newGoal.target_date || ''}
                  onChange={(e) =>
                    editingGoal
                      ? setEditingGoal({ ...editingGoal, target_date: e.target.value || null })
                      : setNewGoal({ ...newGoal, target_date: e.target.value || null })
                  }
                />
              </div>
              {editingGoal && (
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={editingGoal.status}
                    onValueChange={(value: Goal['status']) =>
                      setEditingGoal({ ...editingGoal, status: value })
                    }
                  >
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="abandoned">Abandoned</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div className="flex space-x-2">
                <Button 
                  type="submit" 
                  size="default"
                  disabled={createGoalMutation.isPending || updateGoalMutation.isPending}
                >
                  {createGoalMutation.isPending || updateGoalMutation.isPending ? 'Saving...' : 'Save Goal'}
                </Button>
                {editingGoal && (
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="default"
                    onClick={handleCancelEdit}
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Goal List */}
        <Card>
          <CardHeader>
            <CardTitle>Your Goals</CardTitle>
          </CardHeader>
          <CardContent>
            {goals && goals.length > 0 ? (
              <div className="space-y-4">
                {goals.map((goal) => (
                  <div key={goal.id} className="flex items-center justify-between p-3 rounded-lg border">
                    <div>
                      <p className="font-medium">{goal.description}</p>
                      <p className="text-sm text-muted-foreground">
                        Type: {goal.goal_type} {goal.target_value ? `| Target: ${goal.target_value}` : ''}
                        {goal.target_date ? ` | By: ${format(new Date(goal.target_date), 'PPP')}` : ''}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Status: <span className={`font-semibold ${
                          goal.status === 'active' ? 'text-blue-600' :
                          goal.status === 'completed' ? 'text-green-600' :
                          'text-red-600'
                        }`}>{goal.status}</span>
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleEditClick(goal)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => deleteGoalMutation.mutate(goal.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No goals set yet. Add one above!</p>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Goals;
