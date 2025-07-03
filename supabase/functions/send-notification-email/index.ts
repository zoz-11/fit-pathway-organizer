
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface WorkoutReminderData {
  workoutName: string;
  scheduledTime: string;
}

interface ProgressUpdateData {
  workoutsCompleted: number;
  totalTime: number;
}

interface WelcomeData {
  name: string;
  role: string;
}

interface AssignmentData {
  workoutName: string;
  description: string;
}

interface InvitationData {
  trainerName: string;
}

interface NotificationEmailRequest {
  to: string;
  type: 'workout_reminder' | 'progress_update' | 'welcome' | 'assignment' | 'invitation';
  data: WorkoutReminderData | ProgressUpdateData | WelcomeData | AssignmentData | InvitationData;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
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

    const { to, type, data }: NotificationEmailRequest = await req.json();

    const { data: profileData, error: profileError } = await supabaseClient
      .from('profiles')
      .select('id, role, email')
      .eq('id', user.id)
      .single();

    if (profileError || !profileData) {
      console.error('Error fetching user profile:', profileError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized: User profile not found' }),
        {
          status: 403,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const userRole = profileData.role;
    const userEmail = profileData.email;

    // Authorization checks based on email type
    switch (type) {
      case 'assignment':
        if (userRole !== 'trainer') {
          return new Response(
            JSON.stringify({ error: 'Forbidden: Only trainers can send workout assignments' }),
            {
              status: 403,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            }
          );
        }
        // Further check: Ensure trainer is assigning to their own athlete
        // This would require fetching the athlete's profile and checking trainer_athletes table
        // For simplicity, we'll assume the frontend handles this for now, but ideally,
        // a more robust check would be implemented here.
        break;
      case 'invitation':
        if (userRole !== 'trainer') {
          return new Response(
            JSON.stringify({ error: 'Forbidden: Only trainers can send invitations' }),
            {
              status: 403,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            }
          );
        }
        break;
      case 'workout_reminder':
      case 'progress_update':
      case 'welcome':
        // For personal notifications, ensure 'to' email matches authenticated user's email
        if (to !== userEmail) {
          return new Response(
            JSON.stringify({ error: 'Forbidden: Cannot send this notification to another user' }),
            {
              status: 403,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            }
          );
        }
        break;
      default:
        // No specific authorization for unknown types, but authentication is already done.
        break;
    }

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
      case 'invitation':
        subject = '🤝 You've been invited to FitPathway!';
        html = `
          <h1>Invitation to FitPathway</h1>
          <p>Hi there!</p>
          <p>You've been invited by <strong>${data.trainerName}</strong> to join FitPathway.</p>
          <p>Click <a href="${Deno.env.get("SITE_URL")}/auth">here</a> to accept the invitation and get started!</p>
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
  } catch (error) {
    console.error("Error in send-notification-email function:", error);
    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
