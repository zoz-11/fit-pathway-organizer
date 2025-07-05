export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      exercise_completions: {
        Row: {
          athlete_id: string
          completed_at: string | null
          completed_duration_minutes: number | null
          completed_reps: number | null
          completed_sets: number | null
          difficulty_rating: number | null
          exercise_id: string
          id: string
          notes: string | null
          weight_used_kg: number | null
          workout_id: string
        }
        Insert: {
          athlete_id: string
          completed_at?: string | null
          completed_duration_minutes?: number | null
          completed_reps?: number | null
          completed_sets?: number | null
          difficulty_rating?: number | null
          exercise_id: string
          id?: string
          notes?: string | null
          weight_used_kg?: number | null
          workout_id: string
        }
        Update: {
          athlete_id?: string
          completed_at?: string | null
          completed_duration_minutes?: number | null
          completed_reps?: number | null
          completed_sets?: number | null
          difficulty_rating?: number | null
          exercise_id?: string
          id?: string
          notes?: string | null
          weight_used_kg?: number | null
          workout_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "exercise_completions_athlete_id_fkey"
            columns: ["athlete_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exercise_completions_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "exercises"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exercise_completions_workout_id_fkey"
            columns: ["workout_id"]
            isOneToOne: false
            referencedRelation: "workout_schedules"
            referencedColumns: ["id"]
          },
        ]
      }
      exercises: {
        Row: {
          category: Database["public"]["Enums"]["exercise_category"]
          created_at: string | null
          created_by: string | null
          description: string | null
          difficulty_level: number | null
          duration_minutes: number | null
          equipment_needed: string[] | null
          id: string
          instructions: string[] | null
          is_public: boolean | null
          muscle_groups: string[] | null
          title: string
          updated_at: string | null
          youtube_link: string | null
        }
        Insert: {
          category: Database["public"]["Enums"]["exercise_category"]
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          difficulty_level?: number | null
          duration_minutes?: number | null
          equipment_needed?: string[] | null
          id?: string
          instructions?: string[] | null
          is_public?: boolean | null
          muscle_groups?: string[] | null
          title: string
          updated_at?: string | null
          youtube_link?: string | null
        }
        Update: {
          category?: Database["public"]["Enums"]["exercise_category"]
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          difficulty_level?: number | null
          duration_minutes?: number | null
          equipment_needed?: string[] | null
          id?: string
          instructions?: string[] | null
          is_public?: boolean | null
          muscle_groups?: string[] | null
          title?: string
          updated_at?: string | null
          youtube_link?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "exercises_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          created_at: string | null
          id: string
          is_read: boolean | null
          recipient_id: string
          sender_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          recipient_id: string
          sender_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          recipient_id?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          date_of_birth: string | null
          email: string
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          full_name: string
          id: string
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          subscription_expiry: string | null
          subscription_status:
            | Database["public"]["Enums"]["subscription_status"]
            | null
          trainer_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          date_of_birth?: string | null
          email: string
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          full_name: string
          id: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          subscription_expiry?: string | null
          subscription_status?:
            | Database["public"]["Enums"]["subscription_status"]
            | null
          trainer_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          date_of_birth?: string | null
          email?: string
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          full_name?: string
          id?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          subscription_expiry?: string | null
          subscription_status?:
            | Database["public"]["Enums"]["subscription_status"]
            | null
          trainer_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_trainer_id_fkey"
            columns: ["trainer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      workout_exercises: {
        Row: {
          created_at: string | null
          duration_minutes: number | null
          exercise_id: string
          id: string
          notes: string | null
          order_index: number
          reps: number | null
          rest_seconds: number | null
          sets: number | null
          weight_kg: number | null
          workout_id: string
        }
        Insert: {
          created_at?: string | null
          duration_minutes?: number | null
          exercise_id: string
          id?: string
          notes?: string | null
          order_index: number
          reps?: number | null
          rest_seconds?: number | null
          sets?: number | null
          weight_kg?: number | null
          workout_id: string
        }
        Update: {
          created_at?: string | null
          duration_minutes?: number | null
          exercise_id?: string
          id?: string
          notes?: string | null
          order_index?: number
          reps?: number | null
          rest_seconds?: number | null
          sets?: number | null
          weight_kg?: number | null
          workout_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workout_exercises_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "exercises"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workout_exercises_workout_id_fkey"
            columns: ["workout_id"]
            isOneToOne: false
            referencedRelation: "workout_schedules"
            referencedColumns: ["id"]
          },
        ]
      }
      workout_schedules: {
        Row: {
          athlete_id: string
          created_at: string | null
          description: string | null
          id: string
          notes: string | null
          scheduled_date: string
          scheduled_time: string | null
          status: Database["public"]["Enums"]["workout_status"] | null
          title: string
          trainer_id: string
          updated_at: string | null
        }
        Insert: {
          athlete_id: string
          created_at?: string | null
          description?: string | null
          id?: string
          notes?: string | null
          scheduled_date: string
          scheduled_time?: string | null
          status?: Database["public"]["Enums"]["workout_status"] | null
          title: string
          trainer_id: string
          updated_at?: string | null
        }
        Update: {
          athlete_id?: string
          created_at?: string | null
          description?: string | null
          id?: string
          notes?: string | null
          scheduled_date?: string
          scheduled_time?: string | null
          status?: Database["public"]["Enums"]["workout_status"] | null
          title?: string
          trainer_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "workout_schedules_athlete_id_fkey"
            columns: ["athlete_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workout_schedules_trainer_id_fkey"
            columns: ["trainer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      workout_assignments: {
        Row: {
          id: string
          workout_id: string
          athlete_id: string
          trainer_id: string
          assigned_at: string | null
          due_date: string | null
          status: Database["public"]["Enums"]["workout_assignment_status"]
          completed_at: string | null
        }
        Insert: {
          id?: string
          workout_id: string
          athlete_id: string
          trainer_id: string
          assigned_at?: string | null
          due_date?: string | null
          status?: Database["public"]["Enums"]["workout_assignment_status"]
          completed_at?: string | null
        }
        Update: {
          id?: string
          workout_id?: string
          athlete_id?: string
          trainer_id?: string
          assigned_at?: string | null
          due_date?: string | null
          status?: Database["public"]["Enums"]["workout_assignment_status"]
          completed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "workout_assignments_athlete_id_fkey"
            columns: ["athlete_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workout_assignments_trainer_id_fkey"
            columns: ["trainer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workout_assignments_workout_id_fkey"
            columns: ["workout_id"]
            isOneToOne: false
            referencedRelation: "workout_schedules"
            referencedColumns: ["id"]
          },
        ]
      }
      trainer_athletes: {
        Row: {
          id: string
          trainer_id: string
          athlete_id: string
          status: Database["public"]["Enums"]["trainer_athlete_status"]
          created_at: string | null
        }
        Insert: {
          id?: string
          trainer_id: string
          athlete_id: string
          status?: Database["public"]["Enums"]["trainer_athlete_status"]
          created_at?: string | null
        }
        Update: {
          id?: string
          trainer_id?: string
          athlete_id?: string
          status?: Database["public"]["Enums"]["trainer_athlete_status"]
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "trainer_athletes_athlete_id_fkey"
            columns: ["athlete_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trainer_athletes_trainer_id_fkey"
            columns: ["trainer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      user_owns_profile: {
        Args: { profile_id: string }
        Returns: boolean
      }
    }
    Enums: {
      exercise_category:
        | "cardio"
        | "strength"
        | "flexibility"
        | "sports"
        | "rehabilitation"
      subscription_status: "active" | "expired" | "trial" | "cancelled"
      user_role: "trainer" | "athlete"
      workout_status: "scheduled" | "in_progress" | "completed" | "skipped"
      trainer_athlete_status: "pending" | "accepted" | "declined"
      workout_assignment_status: "pending" | "completed"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      exercise_category: [
        "cardio",
        "strength",
        "flexibility",
        "sports",
        "rehabilitation",
      ],
      subscription_status: ["active", "expired", "trial", "cancelled"],
      user_role: ["trainer", "athlete"],
      workout_status: ["scheduled", "in_progress", "completed", "skipped"],
      trainer_athlete_status: ["pending", "accepted", "declined"],
      workout_assignment_status: ["pending", "completed"],
    },
  },
} as const
