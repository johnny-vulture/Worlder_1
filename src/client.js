import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://btjeqdhlmoeybllfeqnk.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ0amVxZGhsbW9leWJsbGZlcW5rIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTc3MDU2NTUsImV4cCI6MjAxMzI4MTY1NX0.LcetyHZkYJwvEy5_EnDMmY1an6GxaRCyLuPLUHl1W7U";
export const supabase = createClient(supabaseUrl, supabaseKey);
