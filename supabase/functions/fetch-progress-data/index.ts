import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import {
  createClient,
  SupabaseClient,
} from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { z } from "npm:zod@3.23.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Helper function for audit logging
async function logAudit(
  supabaseClient: SupabaseClient,
  userId: string | undefined,
  action: string,
  details: Record<string, unknown>,
) {
  try {
    const { error } = await supabaseClient
      .from("audit_logs")
      .insert([
        {
          user_id: userId,
          action: action,
          details: details,
        },
      ]);

    if (error) {
      console.error("Error inserting audit log:", error);
    }
  } catch (e) {
    console.error("Exception while logging audit:", e);
  }
}

// Request body schema
const RequestBodySchema = z.object({
  traineeId: z.string().uuid(),
});

type RequestBody = z.infer<typeof RequestBodySchema>;

interface ProgressData {
  id: string;
  trainee_id: string;
  program_id: string;
  week: number;
  day: number;
  exercise_name: string;
  sets: number;
  reps: number;
  weight: number;
  notes?: string;
  created_at: string;
}

interface TraineeProfile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

interface ResponseData {
  trainee: TraineeProfile;
  progressData: ProgressData[];
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }

  try {
    // Parse and validate request body
    const body: RequestBody = RequestBodySchema.parse(await req.json());
    const { traineeId } = body;

    // Get Supabase client
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      },
    );

    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser();

    if (userError || !user) {
      await logAudit(
        supabaseClient,
        undefined,
        "FETCH_PROGRESS_AUTH_FAILED",
        { error: userError?.message || "No user found" },
      );
      return new Response(
        JSON.stringify({ error: "Authentication failed" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Check if user is a trainer using user_roles table
    const { data: userRole, error: roleError } = await supabaseClient
      .from("user_roles")
      .select("*")
      .eq("user_id", user.id)
      .eq("role", "trainer")
      .single();

    if (roleError || !userRole) {
      await logAudit(
        supabaseClient,
        user.id,
        "FETCH_PROGRESS_UNAUTHORIZED",
        { traineeId, error: "Not a trainer" },
      );
      return new Response(
        JSON.stringify({ error: "Unauthorized: Trainer role required" }),
        {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Get trainee profile
    const { data: traineeProfile, error: traineeError } = await supabaseClient
      .from("profiles")
      .select("id, first_name, last_name, email")
      .eq("id", traineeId)
      .single();

    if (traineeError || !traineeProfile) {
      await logAudit(
        supabaseClient,
        user.id,
        "FETCH_PROGRESS_TRAINEE_NOT_FOUND",
        { traineeId, error: traineeError?.message },
      );
      return new Response(
        JSON.stringify({ error: "Trainee not found" }),
        {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Get progress data
    const { data: progressData, error: progressError } = await supabaseClient
      .from("progress_tracking")
      .select("*")
      .eq("trainee_id", traineeId)
      .order("created_at", { ascending: false });

    if (progressError) {
      await logAudit(
        supabaseClient,
        user.id,
        "FETCH_PROGRESS_DATA_ERROR",
        { traineeId, error: progressError.message },
      );
      return new Response(
        JSON.stringify({ error: "Failed to fetch progress data" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Log successful fetch
    await logAudit(
      supabaseClient,
      user.id,
      "FETCH_PROGRESS_SUCCESS",
      {
        traineeId,
        recordCount: progressData?.length || 0,
      },
    );

    const responseData: ResponseData = {
      trainee: traineeProfile as TraineeProfile,
      progressData: (progressData || []) as ProgressData[],
    };

    return new Response(
      JSON.stringify(responseData),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("Unexpected error:", error);

    return new Response(
      JSON.stringify({
        error: "Internal server error",
        message: error instanceof Error ? error.message : String(error),
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
