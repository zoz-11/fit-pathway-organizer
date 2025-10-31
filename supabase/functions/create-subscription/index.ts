
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { z } from "npm:zod@3.23.4";

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

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const CreateSubscriptionSchema = z.object({
  planType: z.union([z.literal("basic"), z.literal("premium"), z.literal("enterprise")]),
});

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? ""
  );

  try {
    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data } = await supabaseClient.auth.getUser(token);
    const user = data.user;
    if (!user?.email) {
      await logAudit(supabaseClient, undefined, 'Subscription Creation Failed', { reason: 'Unauthorized: No user email', ipAddress: req.headers.get('x-forwarded-for') });
      throw new Error("User not authenticated");
    }

    await logAudit(supabaseClient, user.id, 'Subscription Creation Attempt', { email: user.email, ipAddress: req.headers.get('x-forwarded-for') });

    let planType: "basic" | "premium" | "enterprise";
    try {
      const parsedBody = await CreateSubscriptionSchema.parseAsync(await req.json());
      planType = parsedBody.planType;
    } catch (error) {
      return new Response(
        JSON.stringify({ error: 'Invalid request body', details: error.issues }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        }
      );
    }

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", { 
      apiVersion: "2023-10-16" 
    });

    // Check for existing customer
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
    }

    // Define subscription plans
    const plans = {
      basic: { amount: 999, name: "Basic Plan" }, // $9.99
      premium: { amount: 1999, name: "Premium Plan" }, // $19.99
      enterprise: { amount: 4999, name: "Enterprise Plan" } // $49.99
    };

    const selectedPlan = plans[planType as keyof typeof plans];
    if (!selectedPlan) throw new Error("Invalid plan type");

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : user.email,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: selectedPlan.name },
            unit_amount: selectedPlan.amount,
            recurring: { interval: "month" },
          },
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${req.headers.get("origin")}/subscription-success`,
      cancel_url: `${req.headers.get("origin")}/subscription-cancel`,
    });

    await logAudit(supabaseClient, user.id, 'Subscription Checkout Session Created', { email: user.email, planType: planType, sessionId: session.id });
    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error creating subscription:", error);
    await logAudit(supabaseClient, user?.id, 'Subscription Creation Failed', { error: error.message, email: user?.email, planType: planType });
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
