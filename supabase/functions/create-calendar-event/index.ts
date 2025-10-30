import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { z } from "npm:zod@3.23.4";
import {
  checkRateLimit,
  logAudit,
  logSecurityEvent,
  sanitizeHtml,
} from "../_shared/security-utils.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Helper function to refresh Google access token
async function refreshGoogleAccessToken(
  refreshToken: string,
): Promise<{ accessToken: string; expiresIn: number } | null> {
  const googleClientId = Deno.env.get("GOOGLE_CLIENT_ID");
  const googleClientSecret = Deno.env.get("GOOGLE_CLIENT_SECRET");

  if (!googleClientId || !googleClientSecret) {
    console.error("Google API credentials are not configured.");
    return null;
  }

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: googleClientId,
      client_secret: googleClientSecret,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }).toString(),
  });

  const data = await response.json();

  if (data.error) {
    console.error(
      "Error refreshing access token:",
      data.error_description || data.error,
    );
    return null;
  }

  return { accessToken: data.access_token, expiresIn: data.expires_in };
}

const CreateCalendarEventSchema = z.object({
  summary: z.string().min(1, "Summary cannot be empty"),
  description: z.string().optional(),
  start: z.object({
    dateTime: z.string().datetime(),
    timeZone: z.string().optional(),
  }),
  end: z.object({
    dateTime: z.string().datetime(),
    timeZone: z.string().optional(),
  }),
  // Add other event properties as needed
});

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } },
  );

  try {
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser();

    if (userError || !user) {
      await logSecurityEvent(
        supabaseClient,
        undefined,
        "calendar_event_unauthorized",
        { ipAddress: req.headers.get("x-forwarded-for") },
        "low",
      );
      return new Response(
        JSON.stringify({ error: "User not authenticated." }),
        {
          status: 401,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        },
      );
    }

    // Rate limiting check
    if (checkRateLimit(user.id, 10)) {
      await logSecurityEvent(
        supabaseClient,
        user.id,
        "calendar_event_rate_limit_exceeded",
        { ipAddress: req.headers.get("x-forwarded-for") },
        "medium",
      );
      return new Response(
        JSON.stringify({ error: "Too Many Requests: Please try again later." }),
        {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const { data: profile, error: profileError } = await supabaseClient
      .from("profiles")
      .select("google_refresh_token")
      .eq("id", user.id)
      .single();

    if (profileError || !profile?.google_refresh_token) {
      return new Response(
        JSON.stringify({ error: "Google refresh token not found for user." }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        },
      );
    }

    const { accessToken } = await refreshGoogleAccessToken(
      profile.google_refresh_token,
    );

    if (!accessToken) {
      return new Response(
        JSON.stringify({ error: "Failed to obtain Google access token." }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        },
      );
    }

    const requestBody = await req.json();
    const parsedEvent = CreateCalendarEventSchema.safeParse(requestBody);

    if (!parsedEvent.success) {
      await logAudit(supabaseClient, user.id, "calendar_event_validation_failed", {
        errors: parsedEvent.error.issues,
        ipAddress: req.headers.get("x-forwarded-for"),
      });
      return new Response(
        JSON.stringify({
          error: "Invalid event data",
          details: parsedEvent.error.issues,
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        },
      );
    }

    const event = {
      ...parsedEvent.data,
      summary: sanitizeHtml(parsedEvent.data.summary),
      description: parsedEvent.data.description
        ? sanitizeHtml(parsedEvent.data.description)
        : undefined,
    };

    const calendarResponse = await fetch(
      "https://www.googleapis.com/calendar/v3/calendars/primary/events",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(event),
      },
    );

    const calendarData = await calendarResponse.json();

    if (calendarData.error) {
      console.error("Error creating calendar event:", calendarData.error);
      await logAudit(supabaseClient, user.id, "calendar_event_creation_failed", {
        error: calendarData.error.message,
        ipAddress: req.headers.get("x-forwarded-for"),
      });
      return new Response(
        JSON.stringify({
          error:
            calendarData.error.message || "Failed to create calendar event.",
        }),
        {
          status: calendarData.error.code || 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        },
      );
    }

    await logAudit(supabaseClient, user.id, "calendar_event_created", {
      eventId: calendarData.id,
      summary: event.summary,
      ipAddress: req.headers.get("x-forwarded-for"),
    });

    return new Response(
      JSON.stringify({
        message: "Calendar event created successfully",
        event: calendarData,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      },
    );
  } catch (error) {
    console.error("Error in create-calendar-event function:", error);
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});
