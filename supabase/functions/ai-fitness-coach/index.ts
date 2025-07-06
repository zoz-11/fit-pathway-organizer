import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient, SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.43.2";
import { z } from "npm:zod@3.23.4";

const openRouterApiKey = Deno.env.get('OPENROUTER_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 5; // 5 requests per minute

const requestCounts = new Map<string, { count: number; lastReset: number }>();

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

const UserProfileSchema = z.object({
  id: z.string().uuid(),
  role: z.string().optional(),
  fitness_level: z.string().optional(),
  goals: z.string().optional(),
}).passthrough(); // Allow other properties not explicitly defined

const WorkoutHistoryItemSchema = z.object({
  workout_name: z.string(),
  date: z.string().datetime(),
  duration_minutes: z.number().int().positive().optional(),
}).passthrough();

const AICoachRequestSchema = z.object({
  message: z.string().min(1, "Message cannot be empty"),
  userProfile: UserProfileSchema.optional(),
  workoutHistory: z.array(WorkoutHistoryItemSchema).optional(),
});

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    let message: string;
    let userProfile: z.infer<typeof UserProfileSchema> | undefined;
    let workoutHistory: z.infer<typeof WorkoutHistoryItemSchema>[] | undefined;

    try {
      const parsedBody = await AICoachRequestSchema.parseAsync(await req.json());
      message = parsedBody.message;
      userProfile = parsedBody.userProfile;
      workoutHistory = parsedBody.workoutHistory;
    } catch (error) {
      return new Response(
        JSON.stringify({ error: 'Invalid request body', details: error.issues }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        }
      );
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const {
      data: { user },
    } = await supabaseClient.auth.getUser();

    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized: No active session' }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Basic Rate Limiting
    const userId = user.id;
    const now = Date.now();
    const userRequest = requestCounts.get(userId) || { count: 0, lastReset: now };

    if (now - userRequest.lastReset > RATE_LIMIT_WINDOW_MS) {
      userRequest.count = 1;
      userRequest.lastReset = now;
    } else {
      userRequest.count++;
    }
    requestCounts.set(userId, userRequest);

    if (userRequest.count > MAX_REQUESTS_PER_WINDOW) {
      return new Response(
        JSON.stringify({ error: 'Too Many Requests: Please try again later.' }),
        {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Optional: Verify that the userProfile.id matches the authenticated user.id
    // This adds an extra layer of security to ensure users are only querying for their own data.
    if (userProfile && userProfile.id && userProfile.id !== user.id) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized: User ID mismatch' }),
        {
          status: 403,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    console.log('Received request:', { message, userProfile });

    if (!openRouterApiKey) {
      console.error('OpenRouter API key not found');
      return new Response(JSON.stringify({ error: 'OpenRouter API key not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const systemPrompt = `You are FitPathway AI, an expert fitness coach and nutritionist. You provide personalized advice based on:
    - User's role: ${userProfile?.role || 'athlete'}
    - Fitness level: ${userProfile?.fitness_level || 'beginner'}
    - Goals: ${userProfile?.goals || 'general fitness'}
    
    Recent workout history: ${workoutHistory ? JSON.stringify(workoutHistory) : 'No recent workouts'}
    
    Provide encouraging, specific, and actionable fitness advice. Keep responses concise but helpful.`;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openRouterApiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://fitpathway.app',
        'X-Title': 'FitPathway AI Coach',
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-3.1-8b-instruct',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenRouter API error:', response.status, errorData);
      return new Response(JSON.stringify({ 
        error: `OpenRouter API error: ${response.status}`,
        details: errorData 
      }), {
        status: response.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    
    const aiResponse = data.choices[0].message.content;

    return new Response(JSON.stringify({ response: aiResponse }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in ai-fitness-coach function:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
