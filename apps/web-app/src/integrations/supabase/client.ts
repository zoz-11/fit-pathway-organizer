import { createClient } from "@supabase/supabase-js";

/**
 * Supabase client factory.
 *
 * For Vite, environment variables must start with VITE_ to be exposed to the client.
 * Ensure you configure these in your deployment environment / .env file.
 *
 * Example variables:
 *   VITE_SUPABASE_URL=https://xxxx.supabase.co
 *   VITE_SUPABASE_ANON_KEY=public-anon-key
 */

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  // Throwing here ensures devs notice immediately instead of accidentally shipping an app with empty keys.
  throw new Error(
    "Supabase environment variables are missing. Ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set."
  );
}

export const supabase = createClient(String(SUPABASE_URL), String(SUPABASE_ANON_KEY));
export default supabase;