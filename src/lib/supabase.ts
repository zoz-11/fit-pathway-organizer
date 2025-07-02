import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database schema types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string;
          role: 'athlete' | 'trainer' | 'admin';
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
          preferences: any;
        };
        Insert: {
          id?: string;
          email: string;
          name: string;
          role?: 'athlete' | 'trainer' | 'admin';
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
          preferences?: any;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          role?: 'athlete' | 'trainer' | 'admin';
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
          preferences?: any;
        };
      };
      workouts: {
        Row: {
          id: string;
          title: string;
          description: string;
          duration: number;
          difficulty: 'beginner' | 'intermediate' | 'advanced';
          category: string;
          exercises: any[];
          video_url: string | null;
          thumbnail_url: string | null;
          created_by: string;
          created_at: string;
          updated_at: string;
          tags: string[];
          equipment_needed: string[];
          calories_burn: number;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          duration: number;
          difficulty: 'beginner' | 'intermediate' | 'advanced';
          category: string;
          exercises: any[];
          video_url?: string | null;
          thumbnail_url?: string | null;
          created_by: string;
          created_at?: string;
          updated_at?: string;
          tags?: string[];
          equipment_needed?: string[];
          calories_burn: number;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          duration?: number;
          difficulty?: 'beginner' | 'intermediate' | 'advanced';
          category?: string;
          exercises?: any[];
          video_url?: string | null;
          thumbnail_url?: string | null;
          created_by?: string;
          created_at?: string;
          updated_at?: string;
          tags?: string[];
          equipment_needed?: string[];
          calories_burn?: number;
        };
      };
      workout_sessions: {
        Row: {
          id: string;
          user_id: string;
          workout_id: string;
          started_at: string;
          completed_at: string | null;
          duration: number;
          status: 'in_progress' | 'completed' | 'paused' | 'cancelled';
          exercises_completed: any[];
          notes: string | null;
          rating: number | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          workout_id: string;
          started_at: string;
          completed_at?: string | null;
          duration: number;
          status: 'in_progress' | 'completed' | 'paused' | 'cancelled';
          exercises_completed?: any[];
          notes?: string | null;
          rating?: number | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          workout_id?: string;
          started_at?: string;
          completed_at?: string | null;
          duration?: number;
          status?: 'in_progress' | 'completed' | 'paused' | 'cancelled';
          exercises_completed?: any[];
          notes?: string | null;
          rating?: number | null;
        };
      };
      fitness_goals: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string;
          category: string;
          target_value: number;
          current_value: number;
          unit: string;
          deadline: string | null;
          status: 'active' | 'completed' | 'paused';
          created_at: string;
          updated_at: string;
          milestones: any[];
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          description: string;
          category: string;
          target_value: number;
          current_value: number;
          unit: string;
          deadline?: string | null;
          status?: 'active' | 'completed' | 'paused';
          created_at?: string;
          updated_at?: string;
          milestones?: any[];
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          description?: string;
          category?: string;
          target_value?: number;
          current_value?: number;
          unit?: string;
          deadline?: string | null;
          status?: 'active' | 'completed' | 'paused';
          created_at?: string;
          updated_at?: string;
          milestones?: any[];
        };
      };
      progress_logs: {
        Row: {
          id: string;
          user_id: string;
          date: string;
          weight: number | null;
          body_fat: number | null;
          muscle_mass: number | null;
          measurements: any;
          photos: string[] | null;
          notes: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          date: string;
          weight?: number | null;
          body_fat?: number | null;
          muscle_mass?: number | null;
          measurements?: any;
          photos?: string[] | null;
          notes?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          date?: string;
          weight?: number | null;
          body_fat?: number | null;
          muscle_mass?: number | null;
          measurements?: any;
          photos?: string[] | null;
          notes?: string | null;
        };
      };
      meal_plans: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string;
          daily_calories: number;
          macro_split: any;
          meals: any[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          description: string;
          daily_calories: number;
          macro_split: any;
          meals: any[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          description?: string;
          daily_calories?: number;
          macro_split?: any;
          meals?: any[];
          created_at?: string;
          updated_at?: string;
        };
      };
      schedules: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string;
          workouts: any[];
          created_at: string;
          updated_at: string;
          is_active: boolean;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          description: string;
          workouts: any[];
          created_at?: string;
          updated_at?: string;
          is_active?: boolean;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          description?: string;
          workouts?: any[];
          created_at?: string;
          updated_at?: string;
          is_active?: boolean;
        };
      };
      achievements: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string;
          icon: string;
          category: string;
          unlocked_at: string;
          progress: number | null;
          max_progress: number | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          description: string;
          icon: string;
          category: string;
          unlocked_at: string;
          progress?: number | null;
          max_progress?: number | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          description?: string;
          icon?: string;
          category?: string;
          unlocked_at?: string;
          progress?: number | null;
          max_progress?: number | null;
        };
      };
      messages: {
        Row: {
          id: string;
          sender_id: string;
          receiver_id: string;
          content: string;
          type: 'text' | 'image' | 'file';
          sent_at: string;
          read_at: string | null;
          attachments: string[] | null;
        };
        Insert: {
          id?: string;
          sender_id: string;
          receiver_id: string;
          content: string;
          type: 'text' | 'image' | 'file';
          sent_at?: string;
          read_at?: string | null;
          attachments?: string[] | null;
        };
        Update: {
          id?: string;
          sender_id?: string;
          receiver_id?: string;
          content?: string;
          type?: 'text' | 'image' | 'file';
          sent_at?: string;
          read_at?: string | null;
          attachments?: string[] | null;
        };
      };
      subscriptions: {
        Row: {
          id: string;
          user_id: string;
          plan: 'free' | 'basic' | 'premium' | 'pro';
          status: 'active' | 'cancelled' | 'expired' | 'trial';
          start_date: string;
          end_date: string | null;
          auto_renew: boolean;
          payment_method: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          plan: 'free' | 'basic' | 'premium' | 'pro';
          status?: 'active' | 'cancelled' | 'expired' | 'trial';
          start_date: string;
          end_date?: string | null;
          auto_renew?: boolean;
          payment_method?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          plan?: 'free' | 'basic' | 'premium' | 'pro';
          status?: 'active' | 'cancelled' | 'expired' | 'trial';
          start_date?: string;
          end_date?: string | null;
          auto_renew?: boolean;
          payment_method?: string | null;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type Inserts<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];
export type Updates<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']; 