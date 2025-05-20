import { createClient } from "@supabase/supabase-js"

// For client-side usage, we need to use the NEXT_PUBLIC_ prefixed variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Check if we're in a browser environment
const isBrowser = typeof window !== "undefined"

// Log environment variable status (for debugging)
if (isBrowser) {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error(
      "Missing Supabase environment variables. Make sure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in your .env.local file.",
    )
  }
}

// Hardcode the values from your environment for development
// IMPORTANT: Replace these with your actual Supabase URL and anon key
// In production, you should use environment variables
const fallbackUrl = "https://pudbugnfcoqjnnnoyaql.supabase.co"
const fallbackKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB1ZGJ1Z25mY29xam5ubm95YXFsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY2MTAwMzQsImV4cCI6MjA2MjE4NjAzNH0.qLNZKJ1GV60OZmqES2vE0N_2NbN54rnv-jQkhBnhOt8"

// Create the Supabase client with fallbacks
export const supabase = createClient(supabaseUrl || fallbackUrl, supabaseAnonKey || fallbackKey)

export async function createWalletRecord(userId: string, wallet: string, score: number, zkProof: string) {
  return await supabase.from("wallet_records").insert([
    {
      user_id: userId,
      wallet,
      score,
      zk_proof: zkProof,
      created_at: new Date().toISOString(),
    },
  ])
}

export async function getUserRecords(userId: string) {
  return await supabase
    .from("wallet_records")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
}

export async function getRecordById(id: string) {
  return await supabase.from("wallet_records").select("*").eq("id", id).single()
}
