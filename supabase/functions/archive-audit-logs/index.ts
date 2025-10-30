import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ArchiveResult {
  success: boolean;
  archivedCount: number;
  timestamp: string;
  error?: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client with service role for admin operations
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    console.log('Starting audit log archival process...');

    // Call the secure archival function
    const { data, error } = await supabaseAdmin.rpc('archive_old_audit_logs');

    if (error) {
      console.error('Error archiving audit logs:', error);
      throw error;
    }

    const archivedCount = data || 0;
    console.log(`Successfully archived ${archivedCount} audit logs`);

    // Log the archival event itself
    await supabaseAdmin.from('audit_logs').insert({
      user_id: null, // System action
      action: 'audit_logs_archived',
      details: {
        archived_count: archivedCount,
        timestamp: new Date().toISOString(),
      },
    });

    const result: ArchiveResult = {
      success: true,
      archivedCount,
      timestamp: new Date().toISOString(),
    };

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Fatal error in archive-audit-logs:', error);
    
    const errorResult: ArchiveResult = {
      success: false,
      archivedCount: 0,
      timestamp: new Date().toISOString(),
      error: error.message,
    };

    return new Response(JSON.stringify(errorResult), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
