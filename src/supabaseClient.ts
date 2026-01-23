import { createClient } from "@supabase/supabase-js";

/**
 * Supabase Client
 * - Cloudflare Pages ready
 * - Google / Facebook Auth ready
 * - Session persist + auto refresh enabled
 */

/* ================= ENV ================= */

const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL ||
  "https://bhmojnzgcinuglohzabq.supabase.co";

const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJobW9qbnpnY2ludWdsb2h6YWJxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg4MTY4ODAsImV4cCI6MjA4NDM5Mjg4MH0.xalJA4GAt0DZ9LFfH6abWeCxhm8PoGmVgoV3BWGVxXk";

/* ================= CLIENT ================= */

export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: true,       // refresh ke baad bhi login rahe
      autoRefreshToken: true,     // token auto refresh
      detectSessionInUrl: true,   // OAuth redirect ke baad session detect
    },
  }
);
