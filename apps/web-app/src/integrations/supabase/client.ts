import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

const SUPABASE_URL = "https://yfgenblmkkxisidvdbkc.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlmZ2VuYmxta2t4aXNpZHZkYmtjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjk3MjQzOTUsImV4cCI6MjA0NTMwMDM5NX0.8Uf0KVGf_n0rxlRN6P_wFUJFjHCRWuR2gd-p0hZL2zU";

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
