// Trigger CI: trivial change for workflow - Oct 27, 2025
import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Validate environment variables
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('Supabase environment variables are not configured properly');
  throw new Error('Missing Supabase configuration');
}

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

// Custom fetch with longer timeout for Edge Functions
const customFetch = (url: RequestInfo | URL, options?: RequestInit) => {
  const timeout = 30000; // 30 seconds timeout
  return Promise.race([
    fetch(url, options),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Request timed out")), timeout),
    ),
  ]) as Promise<Response>;
};

export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
    global: {
      fetch: customFetch,
      headers: {
        "x-client-info": "fit-pathway-organizer",
      },
    },
  },
);

export default supabase;
