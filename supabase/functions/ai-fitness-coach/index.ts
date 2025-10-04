import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient, SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.43.2";
import { z } from "npm:zod@3.23.4";

// Multi-provider AI configuration with fallbacks
const aiProviders = {
  // Primary: Lovable AI (free tier until Oct 6)
  lovable: {
    apiKey: Deno.env.get('LOVABLE_API_KEY'),
    endpoint: 'https://api.lovable.dev/v1/chat/completions',
    model: 'google/gemini-2.0-flash-exp',
    maxTokens: 800
  },
  // Primary: Groq (Most generous free tier - 14,400 requests/day)
  groq: {
    apiKey: Deno.env.get('GROQ_API_KEY'),
    endpoint: 'https://api.groq.com/openai/v1/chat/completions',
    model: 'llama-3.1-8b-instant', // Fast and free
    maxTokens: 800
  },
  // Fallback: OpenRouter with free models
  openrouter: {
    apiKey: Deno.env.get('OPENROUTER_API_KEY'),
    endpoint: 'https://openrouter.ai/api/v1/chat/completions',
    model: 'meta-llama/llama-3.2-3b-instruct:free', // Free model
    maxTokens: 500
  }
  }
};

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 15;
const requestCounts = new Map<string, { count: number; lastReset: number }>();

async function logAudit(supabaseClient: SupabaseClient, userId: string | undefined, action: string, details: Record<string, unknown>) {
  try {
    const { error } = await supabaseClient
      .from('audit_logs')
      .insert([{ user_id: userId, action: action, details: details }]);
    if (error) console.error("Error inserting audit log:", error);
  } catch (e) {
    console.error("Exception while logging audit:", e);
  }
}

async function callAIProvider(provider: string, config: any, messages: any[]) {
  const headers: Record<string, string> = {
    'Authorization': `Bearer ${config.apiKey}`,
    'Content-Type': 'application/json',
  };

  // Provider-specific headers
  if (provider === 'openrouter') {
    headers['HTTP-Referer'] = 'https://fitpathway.app';
    headers['X-Title'] = 'FitPathway AI Coach';
  } else if (provider === 'lovable') {
    headers['X-App-Name'] = 'FitPathway Organizer';
  }

  const response = await fetch(config.endpoint, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      model: config.model,
      messages,
      max_tokens: config.maxTokens,
      temperature: 0.7,
    }),
  });

  return response;
}

const AICoachRequestSchema = z.object({
  message: z.string().min(1).max(1000),
  userProfile: z.object({
    id: z.string().uuid(),
    role: z.string().optional(),
    fitness_level: z.string().optional(),
    goals: z.string().optional(),
  }).passthrough().optional(),
  workoutHistory: z.array(z.object({
    workout_name: z.string(),
    date: z.string().datetime(),
    duration_minutes: z.number().int().positive().optional(),
  }).passthrough()).optional(),
});

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const requestBody = await req.json();
    const validationResult = AICoachRequestSchema.safeParse(requestBody);
    if (!validationResult.success) {
      return new Response(JSON.stringify({ 
        error: 'Invalid request format',
        details: validationResult.error.issues 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { message, userProfile, workoutHistory } = validationResult.data;

    // Rate limiting
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
      return new Response(JSON.stringify({ error: 'Too Many Requests: Please try again later.' }), {
        status: 429,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (userProfile && userProfile.id && userProfile.id !== user.id) {
      return new Response(JSON.stringify({ error: 'Unauthorized: User ID mismatch' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const systemPrompt = `You are FitPathway AI, an expert fitness coach and nutritionist. You provide personalized advice based on:
    - User's role: ${userProfile?.role || 'athlete'}
    - Fitness level: ${userProfile?.fitness_level || 'beginner'}
    - Goals: ${userProfile?.goals || 'general fitness'}
    
    Recent workout history: ${workoutHistory ? JSON.stringify(workoutHistory) : 'No recent workouts'}

    Provide encouraging, specific, and actionable fitness advice. Keep responses concise but helpful. Focus on:
    - Proper form and technique
    - Progressive overload principles

    Note for backend routing: prefer providers in this order — ['groq', 'openrouter']; remove the 'lovable' provider from consideration. This prompt assumes Groq is prioritized, then OpenRouter, and that the 'lovable' provider should not be used for handling requests.
    - Nutrition guidance
    - Recovery and rest importance
    - Motivation and mindset
    
    Always be supportive and adapt your advice to the user's fitness level and goals.`;

    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: message }
    ];

    // Try providers in order of preference
    const providerOrder = ['lovable', 'groq', 'openrouter'];
    let lastError = null;
    let usedProvider = null;

    for (const providerName of providerOrder) {
      const config = aiProviders[providerName];
      
      if (!config.apiKey) {
        console.log(`${providerName} API key not configured, skipping...`);
        continue;
      }

      try {
        console.log(`Trying ${providerName} provider...`);
        const response = await callAIProvider(providerName, config, messages);

        if (response.ok) {
          const data = await response.json();
          const aiResponse = data.choices[0].message.content;
          usedProvider = providerName;

          await logAudit(supabaseClient, userId, 'ai_coach_interaction', {
            message_length: message.length,
            response_length: aiResponse.length,
            provider: providerName,
            model: config.model,
            user_role: userProfile?.role || 'unknown'
          });

          return new Response(JSON.stringify({ 
            response: aiResponse,
            provider: providerName,
            model: config.model
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        } else {
          const errorText = await response.text();
          lastError = `${providerName}: ${response.status} - ${errorText}`;
          console.error(`${providerName} failed:`, lastError);
          
          // Don't retry on rate limits, move to next provider
          if (response.status === 429 || response.status === 402) {
            continue;
          }
        }
      } catch (error) {
        lastError = `${providerName}: ${error.message}`;
        console.error(`${providerName} error:`, error);
        continue;
      }
    }

    // All providers failed
    return new Response(JSON.stringify({ 
      error: 'All AI providers are currently unavailable',
      details: lastError,
      fallback: 'I apologize, but I\'m temporarily unable to provide AI coaching. Please try again in a few minutes, or contact support if the issue persists.'
    }), {
      status: 503,
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