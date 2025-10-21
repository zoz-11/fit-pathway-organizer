import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { z } from "npm:zod@3.23.4";
const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};
// Helper function for audit logging
async function logAudit(supabaseClient, userId, action, details) {
    try {
        const { error } = await supabaseClient.from("audit_logs").insert([
            {
                user_id: userId,
                action: action,
                details: details,
            },
        ]);
        if (error) {
            console.error("Error inserting audit log:", error);
        }
    }
    catch (e) {
        console.error("Exception while logging audit:", e);
    }
}
const GoalSchema = z.object({
    id: z.string().uuid().optional(), // Optional for creation, required for update/delete
    goal_type: z.union([
        z.literal("weight"),
        z.literal("strength"),
        z.literal("cardio"),
        z.literal("nutrition"),
        z.literal("other"),
    ]),
    target_value: z.number().positive().optional(),
    target_date: z.string().datetime().optional(),
    description: z.string().min(1, "Description cannot be empty"),
    status: z
        .union([
        z.literal("active"),
        z.literal("completed"),
        z.literal("abandoned"),
    ])
        .optional(),
});
const RequestSchema = z.object({
    action: z.union([
        z.literal("create"),
        z.literal("update"),
        z.literal("delete"),
        z.literal("fetch"),
    ]),
    goal: GoalSchema.optional(),
    goalId: z.string().uuid().optional(), // Required for update/delete/fetch single
});
serve(async (req) => {
    if (req.method === "OPTIONS") {
        return new Response(null, { headers: corsHeaders });
    }
    const supabaseClient = createClient(Deno.env.get("SUPABASE_URL") ?? "", Deno.env.get("SUPABASE_ANON_KEY") ?? "", {
        global: {
            headers: { Authorization: req.headers.get("Authorization") },
        },
    });
    try {
        const { data: { user }, } = await supabaseClient.auth.getUser();
        if (!user) {
            await logAudit(supabaseClient, undefined, "Goal Management Failed", {
                reason: "Unauthorized: No active session",
                ipAddress: req.headers.get("x-forwarded-for"),
            });
            return new Response(JSON.stringify({ error: "Unauthorized: No active session" }), {
                status: 401,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }
        const requestBody = await req.json();
        const parsedRequest = RequestSchema.safeParse(requestBody);
        if (!parsedRequest.success) {
            await logAudit(supabaseClient, user.id, "Goal Management Failed", {
                reason: "Invalid request body",
                details: parsedRequest.error.issues,
                ipAddress: req.headers.get("x-forwarded-for"),
            });
            return new Response(JSON.stringify({
                error: "Invalid request body",
                details: parsedRequest.error.issues,
            }), {
                status: 400,
                headers: { "Content-Type": "application/json", ...corsHeaders },
            });
        }
        const { action, goal, goalId } = parsedRequest.data;
        let responseData;
        const status = 200;
        switch (action) {
            case "create": {
                if (!goal) {
                    await logAudit(supabaseClient, user.id, "Goal Creation Failed", {
                        reason: "Missing goal data",
                        ipAddress: req.headers.get("x-forwarded-for"),
                    });
                    return new Response(JSON.stringify({ error: "Missing goal data for creation" }), {
                        status: 400,
                        headers: { "Content-Type": "application/json", ...corsHeaders },
                    });
                }
                const { data: newGoal, error: createError } = await supabaseClient
                    .from("goals")
                    .insert({ ...goal, user_id: user.id })
                    .select()
                    .single();
                if (createError)
                    throw createError;
                responseData = newGoal;
                await logAudit(supabaseClient, user.id, "Goal Created", {
                    goalId: newGoal.id,
                    details: newGoal,
                    ipAddress: req.headers.get("x-forwarded-for"),
                });
                break;
            }
            case "update": {
                if (!goalId || !goal) {
                    await logAudit(supabaseClient, user.id, "Goal Update Failed", {
                        reason: "Missing goal ID or data",
                        ipAddress: req.headers.get("x-forwarded-for"),
                    });
                    return new Response(JSON.stringify({ error: "Missing goal ID or data for update" }), {
                        status: 400,
                        headers: { "Content-Type": "application/json", ...corsHeaders },
                    });
                }
                const { data: updatedGoal, error: updateError } = await supabaseClient
                    .from("goals")
                    .update(goal)
                    .eq("id", goalId)
                    .eq("user_id", user.id) // Ensure user can only update their own goals
                    .select()
                    .single();
                if (updateError)
                    throw updateError;
                responseData = updatedGoal;
                await logAudit(supabaseClient, user.id, "Goal Updated", {
                    goalId: goalId,
                    details: updatedGoal,
                    ipAddress: req.headers.get("x-forwarded-for"),
                });
                break;
            }
            case "delete": {
                if (!goalId) {
                    await logAudit(supabaseClient, user.id, "Goal Deletion Failed", {
                        reason: "Missing goal ID",
                        ipAddress: req.headers.get("x-forwarded-for"),
                    });
                    return new Response(JSON.stringify({ error: "Missing goal ID for deletion" }), {
                        status: 400,
                        headers: { "Content-Type": "application/json", ...corsHeaders },
                    });
                }
                const { error: deleteError } = await supabaseClient
                    .from("goals")
                    .delete()
                    .eq("id", goalId)
                    .eq("user_id", user.id); // Ensure user can only delete their own goals
                if (deleteError)
                    throw deleteError;
                responseData = { message: "Goal deleted successfully" };
                await logAudit(supabaseClient, user.id, "Goal Deleted", {
                    goalId: goalId,
                    ipAddress: req.headers.get("x-forwarded-for"),
                });
                break;
            }
            case "fetch":
                if (goalId) {
                    // Fetch single goal
                    const { data: fetchedGoal, error: fetchSingleError } = await supabaseClient
                        .from("goals")
                        .select("*")
                        .eq("id", goalId)
                        .eq("user_id", user.id) // Ensure user can only fetch their own goals
                        .single();
                    if (fetchSingleError)
                        throw fetchSingleError;
                    responseData = fetchedGoal;
                    await logAudit(supabaseClient, user.id, "Goal Fetched", {
                        goalId: goalId,
                        ipAddress: req.headers.get("x-forwarded-for"),
                    });
                }
                else {
                    // Fetch all goals for the user
                    const { data: fetchedGoals, error: fetchAllError } = await supabaseClient
                        .from("goals")
                        .select("*")
                        .eq("user_id", user.id);
                    if (fetchAllError)
                        throw fetchAllError;
                    responseData = fetchedGoals;
                    await logAudit(supabaseClient, user.id, "All Goals Fetched", {
                        ipAddress: req.headers.get("x-forwarded-for"),
                    });
                }
                break;
            default:
                await logAudit(supabaseClient, user.id, "Goal Management Failed", {
                    reason: "Invalid action",
                    action: action,
                    ipAddress: req.headers.get("x-forwarded-for"),
                });
                return new Response(JSON.stringify({ error: "Invalid action" }), {
                    status: 400,
                    headers: { "Content-Type": "application/json", ...corsHeaders },
                });
        }
        return new Response(JSON.stringify(responseData), {
            status: status,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }
    catch (error) {
        console.error("Error in manage-goals function:", error);
        await logAudit(supabaseClient, user?.id, "Goal Management Failed", {
            error: error.message,
            ipAddress: req.headers.get("x-forwarded-for"),
        });
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { "Content-Type": "application/json", ...corsHeaders },
        });
    }
});
