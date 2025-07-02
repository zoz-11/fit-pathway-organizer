import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { goalsApi } from '@/lib/api';
import { toast } from 'sonner';
import type { FitnessGoal } from '@/types';

interface GoalProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
  goal?: FitnessGoal | null;
}

export const GoalProgressModal = ({ isOpen, onClose, goal }: GoalProgressModalProps) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    title: goal?.title || '',
    description: goal?.description || '',
    category: goal?.category || 'general_fitness',
    target_value: goal?.target_value || 0,
    current_value: goal?.current_value || 0,
    unit: goal?.unit || '',
    deadline: goal?.deadline ? new Date(goal.deadline).toISOString().split('T')[0] : '',
  });

  const createGoalMutation = useMutation({
    mutationFn: goalsApi.createGoal,
    onSuccess: () => {
      toast.success('Goal created successfully!');
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      onClose();
    },
    onError: () => {
      toast.error('Failed to create goal. Please try again.');
    }
  });

  const updateGoalMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<FitnessGoal> }) => 
      goalsApi.updateGoal(id, updates),
    onSuccess: () => {
      toast.success('Goal updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      onClose();
    },
    onError: () => {
      toast.error('Failed to update goal. Please try again.');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const goalData = {
      title: formData.title,
      description: formData.description,
      category: formData.category as any,
      target_value: Number(formData.target_value),
      current_value: Number(formData.current_value),
      unit: formData.unit,
      deadline: formData.deadline || undefined,
      status: 'active' as const,
      milestones: []
    };

    if (goal) {
      updateGoalMutation.mutate({ id: goal.id, updates: goalData });
    } else {
      createGoalMutation.mutate(goalData);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {goal ? 'Edit Goal' : 'Create New Goal'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Goal Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="e.g., Lose 10 pounds"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Describe your goal..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weight_loss">Weight Loss</SelectItem>
                  <SelectItem value="muscle_gain">Muscle Gain</SelectItem>
                  <SelectItem value="strength">Strength</SelectItem>
                  <SelectItem value="endurance">Endurance</SelectItem>
                  <SelectItem value="flexibility">Flexibility</SelectItem>
                  <SelectItem value="body_composition">Body Composition</SelectItem>
                  <SelectItem value="performance">Performance</SelectItem>
                  <SelectItem value="general_fitness">General Fitness</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="deadline">Deadline (Optional)</Label>
              <Input
                id="deadline"
                type="date"
                value={formData.deadline}
                onChange={(e) => handleInputChange('deadline', e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="target_value">Target</Label>
              <Input
                id="target_value"
                type="number"
                value={formData.target_value}
                onChange={(e) => handleInputChange('target_value', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="current_value">Current</Label>
              <Input
                id="current_value"
                type="number"
                value={formData.current_value}
                onChange={(e) => handleInputChange('current_value', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="unit">Unit</Label>
              <Input
                id="unit"
                value={formData.unit}
                onChange={(e) => handleInputChange('unit', e.target.value)}
                placeholder="e.g., lbs, kg, reps"
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={createGoalMutation.isPending || updateGoalMutation.isPending}>
              {goal ? 'Update Goal' : 'Create Goal'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}; 