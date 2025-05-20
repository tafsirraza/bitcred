import { createClient } from "@supabase/supabase-js"
import { env } from "./env"

// Create the Supabase client
export const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY)

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
