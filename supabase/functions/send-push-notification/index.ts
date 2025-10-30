import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { z } from "npm:zod@3.23.4";
import { initializeApp, cert } from "npm:firebase-admin@12.0.0/app";
import { getMessaging } from "npm:firebase-admin@12.0.0/messaging";

// Initialize Firebase Admin SDK
const firebaseAdminConfig = {
  projectId: Deno.env.get("FIREBASE_ADMIN_PROJECT_ID"),
  clientEmail: Deno.env.get("FIREBASE_ADMIN_CLIENT_EMAIL"),
  privateKey: Deno.env.get("FIREBASE_ADMIN_PRIVATE_KEY")?.replace(/\n/g, "\n"),
};

// Check if Firebase app is already initialized to avoid re-initialization errors
let firebaseAdminApp;
try {
  firebaseAdminApp = initializeApp(cert(firebaseAdminConfig));
} catch (error) {
  // If already initialized, retrieve the existing app
  if (error.code === "app/duplicate-app") {
    firebaseAdminApp = initializeApp(cert(firebaseAdminConfig), "[DEFAULT]");
  } else {
    console.error("Error initializing Firebase Admin SDK:", error);
  }
}

const messagingAdmin = getMessaging(firebaseAdminApp);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

import {
  checkRateLimit,
  logAudit,
  logSecurityEvent,
  sanitizeHtml,
} from "../_shared/security-utils.ts";

const SendPushNotificationSchema = z.object({
  userId: z.string().uuid(),
  title: z.string().min(1, "Title cannot be empty"),
  body: z.string().min(1, "Body cannot be empty"),
  data: z.record(z.string(), z.any()).optional(), // Optional data payload
});

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "", // Use service role key for backend operations
    { auth: { persistSession: false } },
  );

  try {
    // Get authenticated user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      await logSecurityEvent(
        supabaseClient,
        undefined,
        "push_notification_unauthorized",
        { ipAddress: req.headers.get("x-forwarded-for") },
        "medium",
      );
      return new Response(
        JSON.stringify({ error: "Authorization required" }),
        {
          status: 401,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        },
      );
    }

    const token = authHeader.replace("Bearer ", "");
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser(token);

    if (userError || !user) {
      await logSecurityEvent(
        supabaseClient,
        undefined,
        "push_notification_invalid_token",
        { ipAddress: req.headers.get("x-forwarded-for") },
        "medium",
      );
      return new Response(
        JSON.stringify({ error: "Invalid authentication token" }),
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
        "push_notification_rate_limit_exceeded",
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

    const requestBody = await req.json();
    const parsedRequest = SendPushNotificationSchema.safeParse(requestBody);

    if (!parsedRequest.success) {
      await logAudit(
        supabaseClient,
        user.id,
        "push_notification_validation_failed",
        {
          errors: parsedRequest.error.issues,
          ipAddress: req.headers.get("x-forwarded-for"),
        },
      );
      return new Response(
        JSON.stringify({
          error: "Invalid request body",
          details: parsedRequest.error.issues,
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        },
      );
    }

    const { userId, title, body, data } = parsedRequest.data;

    // Sanitize title and body
    const sanitizedTitle = sanitizeHtml(title);
    const sanitizedBody = sanitizeHtml(body);

    // Fetch device tokens for the user
    const { data: deviceTokens, error: fetchError } = await supabaseClient
      .from("device_tokens")
      .select("token")
      .eq("user_id", userId);

    if (fetchError) {
      console.error("Error fetching device tokens:", fetchError);
      await logAudit(supabaseClient, userId, "Send Push Notification Failed", {
        reason: "Failed to fetch device tokens",
        error: fetchError.message,
        ipAddress: req.headers.get("x-forwarded-for"),
      });
      return new Response(
        JSON.stringify({ error: "Failed to fetch device tokens" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        },
      );
    }

    if (!deviceTokens || deviceTokens.length === 0) {
      await logAudit(supabaseClient, userId, "Push Notification Skipped", {
        reason: "No device tokens",
        targetUserId: userId,
        title: title,
        ipAddress: req.headers.get("x-forwarded-for"),
      });
      return new Response(
        JSON.stringify({
          message: "No device tokens found for user, notification skipped",
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Extract tokens
    const tokens = deviceTokens.map((dt) => dt.token);

    const messages = tokens.map((token) => ({
      notification: { title: sanitizedTitle, body: sanitizedBody },
      data: data,
      token: token,
    }));

    const sendPromises = messages.map((message) =>
      messagingAdmin.send(message),
    );
    const results = await Promise.allSettled(sendPromises);

    let successCount = 0;
    let failureCount = 0;
    results.forEach((result, index) => {
      if (result.status === "fulfilled") {
        successCount++;
      } else {
        failureCount++;
        console.error(
          `Failed to send message to token ${tokens[index]}:`,
          result.reason,
        );
      }
    });

    if (failureCount > 0) {
      await logAudit(
        supabaseClient,
        userId,
        "Push Notification Partial Failure",
        {
          targetUserId: userId,
          title: title,
          successCount,
          failureCount,
          ipAddress: req.headers.get("x-forwarded-for"),
        },
      );
      return new Response(
        JSON.stringify({
          message: `Push notifications sent with ${successCount} successes and ${failureCount} failures.`,
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    await logAudit(supabaseClient, user.id, "push_notification_sent", {
      targetUserId: userId,
      title: sanitizedTitle,
      successCount,
      ipAddress: req.headers.get("x-forwarded-for"),
    });

    return new Response(
      JSON.stringify({ message: "Push notification simulated successfully" }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("Error in send-push-notification function:", error);
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});
