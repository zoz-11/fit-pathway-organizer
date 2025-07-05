import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    const { code } = await req.json();

    if (!code) {
      return new Response(JSON.stringify({ error: "Authorization code is missing." }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    const googleClientId = Deno.env.get("GOOGLE_CLIENT_ID");
    const googleClientSecret = Deno.env.get("GOOGLE_CLIENT_SECRET");
    const redirectUri = Deno.env.get("GOOGLE_REDIRECT_URI");

    if (!googleClientId || !googleClientSecret || !redirectUri) {
      return new Response(JSON.stringify({ error: "Google API credentials or redirect URI are not configured." }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        code: code,
        client_id: googleClientId,
        client_secret: googleClientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }).toString(),
    });

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      console.error("Error exchanging code for tokens:", tokenData.error_description || tokenData.error);
      return new Response(JSON.stringify({ error: tokenData.error_description || tokenData.error }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    const { access_token, refresh_token, expires_in } = tokenData;

    // Get the user ID from the Supabase auth context
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();

    if (userError || !user) {
      console.error("Error fetching user:", userError?.message);
      return new Response(JSON.stringify({ error: "User not authenticated." }), {
        status: 401,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    // Store the refresh token in the user's profile or a dedicated table
    const { error: updateError } = await supabaseClient
      .from('profiles') // Assuming 'profiles' table has a column for google_refresh_token
      .update({ google_refresh_token: refresh_token })
      .eq('id', user.id);

    if (updateError) {
      console.error("Error storing refresh token:", updateError);
      return new Response(JSON.stringify({ error: "Failed to store refresh token." }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    return new Response(JSON.stringify({ message: "Successfully exchanged code and stored refresh token." }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  } catch (error) {
    console.error("Error in exchange-google-token function:", error);
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
});
