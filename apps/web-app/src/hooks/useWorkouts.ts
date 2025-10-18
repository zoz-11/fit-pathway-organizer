import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuthProvider";

export const useScheduledWorkouts = (userId?: string) => {
  return useQuery({
    queryKey: ["scheduledWorkouts", userId],
    queryFn: async () => {
      if (!userId) return [];

      const { data, error } = await supabase
        .from("workout_schedules")
        .select(
          `
          *,
          workout_exercises (
            *,
            exercises (*)
          )
        `,
        )
        .eq("athlete_id", userId)
        .order("scheduled_date", { ascending: true });

      if (error) {
        console.error("Error fetching scheduled workouts:", error);
        throw error;
      }

      return data ?? [];
    },
    enabled: !!userId,
  });
};

export const useWorkouts = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: workouts, isLoading } = useQuery({
    queryKey: ["workouts", user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from("workout_schedules")
        .select("*")
        .eq("trainer_id", user.id);

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const createWorkout = useMutation({
    mutationFn: async (newWorkout: {
      name: string;
      description?: string;
      exercises: Array<{ name: string; sets: number; reps: string }>;
    }) => {
      if (!user) throw new Error("User not authenticated");

      const { data: workout, error } = await supabase
        .from("workout_schedules")
        .insert({
          title: newWorkout.name,
          description: newWorkout.description,
          trainer_id: user.id,
          athlete_id: user.id, // Temporary - should be set when assigning
          scheduled_date: new Date().toISOString().split("T")[0],
        })
        .select()
        .single();

      if (error) throw error;

      // Insert exercises
      if (newWorkout.exercises && newWorkout.exercises.length > 0) {
        const exercisesToInsert = newWorkout.exercises.map((ex, index) => ({
          workout_id: workout.id,
          exercise_id: workout.id, // Temporary - should reference actual exercises
          order_index: index,
          sets: ex.sets,
          reps: parseInt(ex.reps) || 0,
        }));

        const { error: exerciseError } = await supabase
          .from("workout_exercises")
          .insert(exercisesToInsert);

        if (exerciseError) throw exerciseError;
      }

      return workout;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workouts", user?.id] });
    },
  });

  return { workouts, isLoading, createWorkout };
};

export const useTodayWorkouts = (userId?: string) => {
  return useQuery({
    queryKey: ["workouts", "today", userId],
    queryFn: async () => {
      if (!userId) return [];

      const today = new Date().toISOString().split("T")[0];

      const { data, error } = await supabase
        .from("workout_schedules")
        .select(
          `
          *,
          workout_exercises (
            *,
            exercises (*)
          )
        `,
        )
        .eq("athlete_id", userId)
        .eq("scheduled_date", today)
        .order("scheduled_time", { ascending: true });

      if (error) {
        console.error("Error fetching today workouts:", error);
        throw error;
      }

      return data ?? [];
    },
    enabled: !!userId,
  });
};
