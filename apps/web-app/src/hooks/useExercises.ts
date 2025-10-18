import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type ExerciseCategory = Database["public"]["Enums"]["exercise_category"];

export const useExercises = () => {
  return useQuery({
    queryKey: ["exercises"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("exercises")
        .select("*")
        .eq("is_public", true)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching exercises:", error);
        throw error;
      }

      return data;
    },
  });
};

export const useExercisesByCategory = (category?: ExerciseCategory) => {
  return useQuery({
    queryKey: ["exercises", "category", category],
    queryFn: async () => {
      if (!category) return [];

      const { data, error } = await supabase
        .from("exercises")
        .select("*")
        .eq("is_public", true)
        .eq("category", category)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching exercises by category:", error);
        throw error;
      }

      return data;
    },
    enabled: !!category,
  });
};
