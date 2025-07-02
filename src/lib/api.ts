import { supabase } from './supabase';
import type { 
  User, 
  Workout, 
  WorkoutSession, 
  FitnessGoal, 
  Progress, 
  MealPlan, 
  Schedule,
  Achievement,
  Message,
  Subscription,
  DashboardStats,
  WorkoutTemplate,
  WorkoutProgram,
  NutritionLog,
  InjuryLog,
  SleepLog,
  MoodLog,
  SocialConnection,
  WorkoutChallenge,
  Notification,
  Analytics
} from '@/types';

// User API
export const userApi = {
  async getCurrentUser(): Promise<User | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) throw error;
    return data;
  },

  async updateProfile(updates: Partial<User>): Promise<User> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updatePreferences(preferences: Partial<User['preferences']>): Promise<User> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('users')
      .update({ preferences })
      .eq('id', user.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};

// Workout API
export const workoutApi = {
  async getWorkouts(category?: string, difficulty?: string): Promise<Workout[]> {
    let query = supabase.from('workouts').select('*');
    
    if (category) query = query.eq('category', category);
    if (difficulty) query = query.eq('difficulty', difficulty);
    
    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  async getWorkout(id: string): Promise<Workout> {
    const { data, error } = await supabase
      .from('workouts')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async createWorkout(workout: Omit<Workout, 'id' | 'created_at' | 'updated_at'>): Promise<Workout> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('workouts')
      .insert({ ...workout, created_by: user.id })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateWorkout(id: string, updates: Partial<Workout>): Promise<Workout> {
    const { data, error } = await supabase
      .from('workouts')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteWorkout(id: string): Promise<void> {
    const { error } = await supabase
      .from('workouts')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};

// Workout Session API
export const workoutSessionApi = {
  async startWorkout(workoutId: string): Promise<WorkoutSession> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('workout_sessions')
      .insert({
        user_id: user.id,
        workout_id: workoutId,
        started_at: new Date().toISOString(),
        status: 'in_progress',
        duration: 0,
        exercises_completed: []
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateWorkoutSession(id: string, updates: Partial<WorkoutSession>): Promise<WorkoutSession> {
    const { data, error } = await supabase
      .from('workout_sessions')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async completeWorkout(id: string, duration: number, exercisesCompleted: any[]): Promise<WorkoutSession> {
    const { data, error } = await supabase
      .from('workout_sessions')
      .update({
        completed_at: new Date().toISOString(),
        status: 'completed',
        duration,
        exercises_completed: exercisesCompleted
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getUserWorkoutSessions(): Promise<WorkoutSession[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('workout_sessions')
      .select('*')
      .eq('user_id', user.id)
      .order('started_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }
};

// Goals API
export const goalsApi = {
  async getGoals(): Promise<FitnessGoal[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('fitness_goals')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async createGoal(goal: Omit<FitnessGoal, 'id' | 'created_at' | 'updated_at'>): Promise<FitnessGoal> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('fitness_goals')
      .insert({ ...goal, user_id: user.id })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateGoal(id: string, updates: Partial<FitnessGoal>): Promise<FitnessGoal> {
    const { data, error } = await supabase
      .from('fitness_goals')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteGoal(id: string): Promise<void> {
    const { error } = await supabase
      .from('fitness_goals')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};

// Progress API
export const progressApi = {
  async getProgressLogs(): Promise<Progress[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('progress_logs')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async addProgressLog(progress: Omit<Progress, 'id'>): Promise<Progress> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('progress_logs')
      .insert({ ...progress, user_id: user.id })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateProgressLog(id: string, updates: Partial<Progress>): Promise<Progress> {
    const { data, error } = await supabase
      .from('progress_logs')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};

// Meal Plan API
export const mealPlanApi = {
  async getMealPlans(): Promise<MealPlan[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('meal_plans')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async createMealPlan(mealPlan: Omit<MealPlan, 'id' | 'created_at' | 'updated_at'>): Promise<MealPlan> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('meal_plans')
      .insert({ ...mealPlan, user_id: user.id })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateMealPlan(id: string, updates: Partial<MealPlan>): Promise<MealPlan> {
    const { data, error } = await supabase
      .from('meal_plans')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};

// Schedule API
export const scheduleApi = {
  async getSchedules(): Promise<Schedule[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('schedules')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async createSchedule(schedule: Omit<Schedule, 'id' | 'created_at' | 'updated_at'>): Promise<Schedule> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('schedules')
      .insert({ ...schedule, user_id: user.id })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateSchedule(id: string, updates: Partial<Schedule>): Promise<Schedule> {
    const { data, error } = await supabase
      .from('schedules')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};

// Achievements API
export const achievementsApi = {
  async getAchievements(): Promise<Achievement[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('achievements')
      .select('*')
      .eq('user_id', user.id)
      .order('unlocked_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async unlockAchievement(achievement: Omit<Achievement, 'id'>): Promise<Achievement> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('achievements')
      .insert({ ...achievement, user_id: user.id })
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};

// Messages API
export const messagesApi = {
  async getMessages(userId: string): Promise<Message[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .or(`and(sender_id.eq.${user.id},receiver_id.eq.${userId}),and(sender_id.eq.${userId},receiver_id.eq.${user.id})`)
      .order('sent_at', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async sendMessage(message: Omit<Message, 'id' | 'sent_at'>): Promise<Message> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('messages')
      .insert({ ...message, sender_id: user.id })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async markAsRead(messageId: string): Promise<void> {
    const { error } = await supabase
      .from('messages')
      .update({ read_at: new Date().toISOString() })
      .eq('id', messageId);

    if (error) throw error;
  }
};

// Subscription API
export const subscriptionApi = {
  async getSubscription(): Promise<Subscription | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  async createSubscription(subscription: Omit<Subscription, 'id'>): Promise<Subscription> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('subscriptions')
      .insert({ ...subscription, user_id: user.id })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateSubscription(id: string, updates: Partial<Subscription>): Promise<Subscription> {
    const { data, error } = await supabase
      .from('subscriptions')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};

// Dashboard Stats API
export const dashboardApi = {
  async getDashboardStats(): Promise<DashboardStats> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Get workout sessions
    const { data: sessions } = await supabase
      .from('workout_sessions')
      .select('*')
      .eq('user_id', user.id);

    // Get goals
    const { data: goals } = await supabase
      .from('fitness_goals')
      .select('*')
      .eq('user_id', user.id);

    // Calculate stats
    const totalWorkouts = sessions?.length || 0;
    const completedWorkouts = sessions?.filter(s => s.status === 'completed').length || 0;
    const totalCalories = sessions?.reduce((sum, s) => sum + (s.duration || 0), 0) || 0;
    const completedGoals = goals?.filter(g => g.status === 'completed').length || 0;

    // Calculate streak (simplified)
    const today = new Date();
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thisWeekWorkouts = sessions?.filter(s => 
      new Date(s.started_at) >= weekAgo
    ).length || 0;

    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
    const thisMonthWorkouts = sessions?.filter(s => 
      new Date(s.started_at) >= monthAgo
    ).length || 0;

    return {
      total_workouts: totalWorkouts,
      current_streak: 7, // Simplified
      longest_streak: 14, // Simplified
      total_calories_burned: totalCalories,
      goals_completed: completedGoals,
      total_workout_time: totalCalories,
      this_week_workouts: thisWeekWorkouts,
      this_month_workouts: thisMonthWorkouts
    };
  }
};

// Analytics API
export const analyticsApi = {
  async getAnalytics(period: 'day' | 'week' | 'month' | 'year'): Promise<Analytics> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const endDate = new Date();
    const startDate = new Date();
    
    switch (period) {
      case 'day':
        startDate.setDate(endDate.getDate() - 1);
        break;
      case 'week':
        startDate.setDate(endDate.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(endDate.getMonth() - 1);
        break;
      case 'year':
        startDate.setFullYear(endDate.getFullYear() - 1);
        break;
    }

    // Get workout sessions for period
    const { data: sessions } = await supabase
      .from('workout_sessions')
      .select('*')
      .eq('user_id', user.id)
      .gte('started_at', startDate.toISOString())
      .lte('started_at', endDate.toISOString());

    // Get progress logs for period
    const { data: progressLogs } = await supabase
      .from('progress_logs')
      .select('*')
      .eq('user_id', user.id)
      .gte('date', startDate.toISOString().split('T')[0])
      .lte('date', endDate.toISOString().split('T')[0]);

    // Calculate analytics
    const workoutStats = {
      total_workouts: sessions?.length || 0,
      total_duration: sessions?.reduce((sum, s) => sum + (s.duration || 0), 0) || 0,
      total_calories: sessions?.reduce((sum, s) => sum + (s.duration || 0), 0) || 0,
      average_duration: sessions?.length ? sessions.reduce((sum, s) => sum + (s.duration || 0), 0) / sessions.length : 0,
      most_common_workout: 'Upper Body Strength', // Simplified
      workout_frequency: [1, 2, 3, 4, 5, 6, 7], // Simplified
      strength_progress: [] // Simplified
    };

    const nutritionStats = {
      average_calories: 2000, // Simplified
      macro_averages: { protein: 30, carbs: 40, fats: 30 },
      water_intake_average: 2000,
      meal_compliance: 85,
      nutrition_goals_met: 3
    };

    const progressStats = {
      weight_change: progressLogs?.length ? (progressLogs[0]?.weight || 0) - (progressLogs[progressLogs.length - 1]?.weight || 0) : 0,
      body_fat_change: 0,
      measurements_change: {},
      goal_completion_rate: 60,
      milestone_achievements: 5
    };

    const socialStats = {
      connections_count: 12,
      challenges_participated: 3,
      challenges_won: 2,
      social_engagement_score: 75
    };

    return {
      user_id: user.id,
      period,
      start_date: startDate.toISOString(),
      end_date: endDate.toISOString(),
      workout_stats: workoutStats,
      nutrition_stats: nutritionStats,
      progress_stats: progressStats,
      social_stats: socialStats
    };
  }
}; 