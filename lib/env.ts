// Helper to safely access environment variables
export const env = {
  // Supabase
  SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || "https://pudbugnfcoqjnnnoyaql.supabase.co",
  SUPABASE_ANON_KEY:
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB1ZGJ1Z25mY29xam5ubm95YXFsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY2MTAwMzQsImV4cCI6MjA2MjE4NjAzNH0.qLNZKJ1GV60OZmqES2vE0N_2NbN54rnv-jQkhBnhOt8",

  // API Keys (server-side only)
  REBAR_API_KEY: process.env.REBAR_API_KEY || "",
  API_KEY: process.env.API_KEY || "",
}
