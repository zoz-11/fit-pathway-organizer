
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { z } from "npm:zod@3.23.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Helper function for audit logging
import { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

// Helper function for audit logging
async function logAudit(supabaseClient: SupabaseClient, userId: string | undefined, action: string, details: Record<string, unknown>) {
  try {
    const { error } = await supabaseClient
      .from('audit_logs')
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

const FetchActivityFeedSchema = z.object({
  limit: z.number().int().min(1).max(100).default(10),
  offset: z.number().int().min(0).default(0),
});

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? "",
    {
      global: {
        headers: { Authorization: req.headers.get('Authorization')! },
      },
    }
  );

  try {
    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) {
      await logAudit(supabaseClient, undefined, 'Fetch Activity Feed Failed', { reason: 'Unauthorized: No active session', ipAddress: req.headers.get('x-forwarded-for') });
      return new Response(JSON.stringify({ error: 'Unauthorized: No active session' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const requestBody = await req.json();
    const parsedRequest = FetchActivityFeedSchema.safeParse(requestBody);

    if (!parsedRequest.success) {
      await logAudit(supabaseClient, user.id, 'Fetch Activity Feed Failed', { reason: 'Invalid request body', details: parsedRequest.error.issues, ipAddress: req.headers.get('x-forwarded-for') });
      return new Response(JSON.stringify({ error: 'Invalid request body', details: parsedRequest.error.issues }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    const { limit, offset } = parsedRequest.data;

    // Fetch recent completed workout assignments for the user
    const { data: completedWorkouts, error: workoutsError } = await supabaseClient
      .from('workout_assignments')
      .select(`
        id,
        status,
        completed_at,
        workout:workouts(name),
        athlete:profiles!athlete_id(full_name)
      `)
      .eq('athlete_id', user.id)
      .eq('status', 'completed')
      .order('completed_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (workoutsError) {
      await logAudit(supabaseClient, user.id, 'Fetch Activity Feed Failed', { reason: 'Database error fetching workouts', details: workoutsError.message, ipAddress: req.headers.get('x-forwarded-for') });
      throw workoutsError;
    }

    // Format activities
    const activities = completedWorkouts.map(wa => ({
      type: 'workout_completed',
      id: wa.id,
      description: `${wa.athlete.full_name} completed workout "${wa.workout.name}"`, // Assuming athlete is the current user
      timestamp: wa.completed_at,
    }));

    await logAudit(supabaseClient, user.id, 'Fetch Activity Feed Success', { recordCount: activities.length, ipAddress: req.headers.get('x-forwarded-for') });

    return new Response(JSON.stringify(activities), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Error in fetch-activity-feed function:", error);
    await logAudit(supabaseClient, undefined, 'Fetch Activity Feed Failed', { error: (error as Error).message, ipAddress: req.headers.get('x-forwarded-for') });
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
});
