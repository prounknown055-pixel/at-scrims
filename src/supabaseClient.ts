import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  "https://bhmojnzgcinuglohzabq.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJobW9qbnpnY2ludWdsb2h6YWJxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg4MTY4ODAsImV4cCI6MjA4NDM5Mjg4MH0.xalJA4GAt0DZ9LFfH6abWeCxhm8PoGmVgoV3BWGVxXk"
);
