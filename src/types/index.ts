export interface User {
  id: string;
  email: string;
  name: string;
  role: 'athlete' | 'trainer' | 'admin';
  avatar_url?: string;
  created_at: string;
  updated_at: string;
  preferences: UserPreferences;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: 'en' | 'es' | 'fr';
  units: 'metric' | 'imperial';
  notifications: NotificationSettings;
  privacy: PrivacySettings;
}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  workout_reminders: boolean;
  progress_updates: boolean;
  achievement_alerts: boolean;
}

export interface PrivacySettings {
  profile_visibility: 'public' | 'private' | 'friends';
  workout_sharing: boolean;
  progress_sharing: boolean;
}

export interface Workout {
  id: string;
  title: string;
  description: string;
  duration: number; // in minutes
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: WorkoutCategory;
  exercises: Exercise[];
  video_url?: string;
  thumbnail_url?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  tags: string[];
  equipment_needed: string[];
  calories_burn: number;
}

export type WorkoutCategory = 
  | 'strength'
  | 'cardio'
  | 'flexibility'
  | 'yoga'
  | 'pilates'
  | 'hiit'
  | 'crossfit'
  | 'sports'
  | 'recovery';

export interface Exercise {
  id: string;
  name: string;
  description: string;
  muscle_groups: MuscleGroup[];
  equipment: string[];
  instructions: string[];
  video_url?: string;
  image_url?: string;
  sets: number;
  reps: number;
  duration?: number; // for time-based exercises
  rest_time: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tips: string[];
}

export type MuscleGroup = 
  | 'chest'
  | 'back'
  | 'shoulders'
  | 'biceps'
  | 'triceps'
  | 'forearms'
  | 'abs'
  | 'obliques'
  | 'quads'
  | 'hamstrings'
  | 'glutes'
  | 'calves'
  | 'full_body';

export interface WorkoutSession {
  id: string;
  user_id: string;
  workout_id: string;
  started_at: string;
  completed_at?: string;
  duration: number; // actual duration in seconds
  status: 'in_progress' | 'completed' | 'paused' | 'cancelled';
  exercises_completed: ExerciseProgress[];
  notes?: string;
  rating?: number;
}

export interface ExerciseProgress {
  exercise_id: string;
  sets_completed: SetProgress[];
  notes?: string;
}

export interface SetProgress {
  set_number: number;
  reps_completed: number;
  weight_used?: number;
  duration?: number;
  rest_time: number;
  difficulty_rating?: number;
}

export interface FitnessGoal {
  id: string;
  user_id: string;
  title: string;
  description: string;
  category: GoalCategory;
  target_value: number;
  current_value: number;
  unit: string;
  deadline?: string;
  status: 'active' | 'completed' | 'paused';
  created_at: string;
  updated_at: string;
  milestones: GoalMilestone[];
}

export type GoalCategory = 
  | 'weight_loss'
  | 'muscle_gain'
  | 'strength'
  | 'endurance'
  | 'flexibility'
  | 'body_composition'
  | 'performance'
  | 'general_fitness';

export interface GoalMilestone {
  id: string;
  title: string;
  target_value: number;
  current_value: number;
  completed: boolean;
  completed_at?: string;
}

export interface Progress {
  id: string;
  user_id: string;
  date: string;
  weight?: number;
  body_fat?: number;
  muscle_mass?: number;
  measurements: BodyMeasurements;
  photos?: string[];
  notes?: string;
}

export interface BodyMeasurements {
  chest?: number;
  waist?: number;
  hips?: number;
  biceps?: number;
  thighs?: number;
  calves?: number;
  neck?: number;
  shoulders?: number;
}

export interface MealPlan {
  id: string;
  user_id: string;
  title: string;
  description: string;
  daily_calories: number;
  macro_split: MacroSplit;
  meals: Meal[];
  created_at: string;
  updated_at: string;
}

export interface MacroSplit {
  protein: number; // percentage
  carbs: number; // percentage
  fats: number; // percentage
}

export interface Meal {
  id: string;
  name: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  time: string;
  foods: FoodItem[];
  total_calories: number;
  macros: MacroSplit;
}

export interface FoodItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  fiber?: number;
  sugar?: number;
}

export interface Schedule {
  id: string;
  user_id: string;
  title: string;
  description: string;
  workouts: ScheduledWorkout[];
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

export interface ScheduledWorkout {
  id: string;
  workout_id: string;
  day_of_week: number; // 0-6 (Sunday-Saturday)
  time: string;
  duration: number;
  notes?: string;
}

export interface Achievement {
  id: string;
  user_id: string;
  title: string;
  description: string;
  icon: string;
  category: AchievementCategory;
  unlocked_at: string;
  progress?: number;
  max_progress?: number;
}

export type AchievementCategory = 
  | 'workouts'
  | 'streak'
  | 'goals'
  | 'strength'
  | 'endurance'
  | 'social'
  | 'special';

export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  type: 'text' | 'image' | 'file';
  sent_at: string;
  read_at?: string;
  attachments?: string[];
}

export interface Chat {
  id: string;
  participants: string[];
  last_message?: Message;
  unread_count: number;
  created_at: string;
  updated_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  plan: SubscriptionPlan;
  status: 'active' | 'cancelled' | 'expired' | 'trial';
  start_date: string;
  end_date?: string;
  auto_renew: boolean;
  payment_method?: string;
}

export type SubscriptionPlan = 
  | 'free'
  | 'basic'
  | 'premium'
  | 'pro';

export interface DashboardStats {
  total_workouts: number;
  current_streak: number;
  longest_streak: number;
  total_calories_burned: number;
  goals_completed: number;
  total_workout_time: number;
  this_week_workouts: number;
  this_month_workouts: number;
}

export interface WorkoutTemplate {
  id: string;
  name: string;
  description: string;
  category: WorkoutCategory;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number;
  exercises: Exercise[];
  is_public: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
  rating: number;
  review_count: number;
}

export interface WorkoutProgram {
  id: string;
  name: string;
  description: string;
  duration_weeks: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  goals: string[];
  workouts: ProgramWorkout[];
  created_by: string;
  created_at: string;
  updated_at: string;
  is_public: boolean;
  rating: number;
  review_count: number;
}

export interface ProgramWorkout {
  week: number;
  day: number;
  workout_id: string;
  notes?: string;
}

export interface NutritionLog {
  id: string;
  user_id: string;
  date: string;
  meals: Meal[];
  water_intake: number; // in ml
  supplements: Supplement[];
  total_calories: number;
  macros: MacroSplit;
  notes?: string;
}

export interface Supplement {
  id: string;
  name: string;
  dosage: string;
  time_taken: string;
  notes?: string;
}

export interface InjuryLog {
  id: string;
  user_id: string;
  injury_type: string;
  description: string;
  severity: 'mild' | 'moderate' | 'severe';
  affected_area: string;
  occurred_at: string;
  healed_at?: string;
  treatment: string;
  notes?: string;
}

export interface SleepLog {
  id: string;
  user_id: string;
  date: string;
  sleep_time: string;
  wake_time: string;
  duration: number; // in hours
  quality: 1 | 2 | 3 | 4 | 5;
  notes?: string;
}

export interface MoodLog {
  id: string;
  user_id: string;
  date: string;
  mood: 1 | 2 | 3 | 4 | 5; // 1=very bad, 5=excellent
  energy_level: 1 | 2 | 3 | 4 | 5;
  stress_level: 1 | 2 | 3 | 4 | 5;
  notes?: string;
}

export interface SocialConnection {
  id: string;
  user_id: string;
  connected_user_id: string;
  status: 'pending' | 'accepted' | 'blocked';
  created_at: string;
  updated_at: string;
}

export interface WorkoutChallenge {
  id: string;
  title: string;
  description: string;
  type: 'individual' | 'team' | 'community';
  start_date: string;
  end_date: string;
  participants: string[];
  leaderboard: ChallengeParticipant[];
  rewards: string[];
  is_active: boolean;
}

export interface ChallengeParticipant {
  user_id: string;
  score: number;
  rank: number;
  progress: number;
}

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: any;
  read: boolean;
  created_at: string;
  action_url?: string;
}

export type NotificationType = 
  | 'workout_reminder'
  | 'goal_achieved'
  | 'streak_milestone'
  | 'friend_request'
  | 'challenge_invite'
  | 'system_update'
  | 'achievement_unlocked';

export interface Analytics {
  user_id: string;
  period: 'day' | 'week' | 'month' | 'year';
  start_date: string;
  end_date: string;
  workout_stats: WorkoutAnalytics;
  nutrition_stats: NutritionAnalytics;
  progress_stats: ProgressAnalytics;
  social_stats: SocialAnalytics;
}

export interface WorkoutAnalytics {
  total_workouts: number;
  total_duration: number;
  total_calories: number;
  average_duration: number;
  most_common_workout: string;
  workout_frequency: number[];
  strength_progress: { exercise: string; max_weight: number; date: string }[];
}

export interface NutritionAnalytics {
  average_calories: number;
  macro_averages: MacroSplit;
  water_intake_average: number;
  meal_compliance: number;
  nutrition_goals_met: number;
}

export interface ProgressAnalytics {
  weight_change: number;
  body_fat_change: number;
  measurements_change: BodyMeasurements;
  goal_completion_rate: number;
  milestone_achievements: number;
}

export interface SocialAnalytics {
  connections_count: number;
  challenges_participated: number;
  challenges_won: number;
  social_engagement_score: number;
} 