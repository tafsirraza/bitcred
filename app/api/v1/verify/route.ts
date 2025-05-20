import { type NextRequest, NextResponse } from "next/server"
import { verifyZkProof } from "@/lib/zk"

export async function POST(request: NextRequest) {
  try {
    // Check for API key
    const apiKey = request.headers.get("x-api-key")
    if (!apiKey) {
      return NextResponse.json({ error: "API key is required" }, { status: 401 })
    }

    // In a real app, you would validate the API key against a database
    // For this demo, we'll use a simple check
    if (apiKey !== process.env.API_KEY) {
      return NextResponse.json({ error: "Invalid API key" }, { status: 401 })
    }

    const { proofValue, wallet, score } = await request.json()

    if (!proofValue || !wallet || score === undefined) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
    }

    // Verify the ZK proof
    const isValid = await verifyZkProof(proofValue, wallet, score)

    return NextResponse.json({ isValid })
  } catch (error) {
    console.error("Error verifying proof:", error)
    return NextResponse.json({ error: "Failed to verify proof" }, { status: 500 })
  }
}
