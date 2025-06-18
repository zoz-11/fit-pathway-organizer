
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface NotificationEmailRequest {
  to: string;
  type: 'workout_reminder' | 'progress_update' | 'welcome' | 'assignment';
  data: any;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to, type, data }: NotificationEmailRequest = await req.json();

    let subject = '';
    let html = '';

    switch (type) {
      case 'workout_reminder':
        subject = '🏋️ Time for your workout!';
        html = `
          <h1>Workout Reminder</h1>
          <p>Hi there!</p>
          <p>Don't forget about your scheduled workout: <strong>${data.workoutName}</strong></p>
          <p>Scheduled for: ${new Date(data.scheduledTime).toLocaleString()}</p>
          <p>Keep up the great work!</p>
        `;
        break;
      case 'progress_update':
        subject = '📈 Your fitness progress update';
        html = `
          <h1>Progress Update</h1>
          <p>Great job on your fitness journey!</p>
          <p>Workouts completed this week: ${data.workoutsCompleted}</p>
          <p>Total exercise time: ${data.totalTime} minutes</p>
          <p>Keep pushing forward!</p>
        `;
        break;
      case 'welcome':
        subject = '🎉 Welcome to FitPathway!';
        html = `
          <h1>Welcome to FitPathway!</h1>
          <p>Hi ${data.name}!</p>
          <p>We're excited to have you join our fitness community as a ${data.role}.</p>
          <p>Get started by exploring your dashboard and setting up your first workout!</p>
        `;
        break;
      case 'assignment':
        subject = '💪 New workout assignment';
        html = `
          <h1>New Workout Assignment</h1>
          <p>Your trainer has assigned you a new workout!</p>
          <p><strong>${data.workoutName}</strong></p>
          <p>Description: ${data.description}</p>
          <p>Log in to view the full details and start your workout.</p>
        `;
        break;
      default:
        throw new Error('Invalid email type');
    }

    const emailResponse = await resend.emails.send({
      from: "FitPathway <onboarding@resend.dev>",
      to: [to],
      subject,
      html,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-notification-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
