import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Hardcoded credentials - DO NOT USE ENVIRONMENT VARIABLES
const SUPABASE_URL = "https://yfgenblmkkxisidvdbkc.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlmZ2VuYmxta2t4aXNpZHZkYmtjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAwMjMzNzMsImV4cCI6MjA2NTU5OTM3M30.re4Phxrp7RRcvvCVFYgGuc0Kk1PUmDiv9THWUqAbtmc";

// Custom fetch with timeout
const customFetch = (url: RequestInfo | URL, options?: RequestInit) => {
  const timeout = 30000;
  return Promise.race([
    fetch(url, options),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Request timed out")), timeout)
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
      storage: localStorage
    },
    global: {
      fetch: customFetch,
      headers: {
        "X-Client-Info": "fit-pathway-organizer",
      },
    },
  }
);
