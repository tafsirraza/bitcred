import { type NextRequest, NextResponse } from "next/server"
import { env } from "@/lib/env"

// Define the response type for wallet data
interface WalletData {
  address: string
  txCount: number
  txVolume: number // in BTC
  walletAge: number // in days
  firstTxDate: string
  lastTxDate: string
}

export async function POST(request: NextRequest) {
  try {
    const { wallet } = await request.json()

    if (!wallet) {
      return NextResponse.json({ error: "Wallet address is required" }, { status: 400 })
    }

    // Validate Bitcoin wallet address format
    const bitcoinAddressRegex = /^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,39}$/
    if (!bitcoinAddressRegex.test(wallet)) {
      return NextResponse.json({ error: "Invalid Bitcoin wallet address" }, { status: 400 })
    }

    // Get the API key from environment variables
    const apiKey = env.REBAR_API_KEY

    if (!apiKey) {
      console.warn("REBAR_API_KEY is not set. Using simulated data.")
    }

    // In a real implementation, this would call the actual Rebar Labs API
    // For now, we'll simulate a response based on the wallet address

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Generate deterministic but random-looking data based on wallet address
    const hash = Array.from(wallet).reduce((acc, char) => acc + char.charCodeAt(0), 0)
    const txCount = 50 + (hash % 950) // Between 50 and 1000
    const txVolume = 0.5 + (hash % 100) / 10 // Between 0.5 and 10.5 BTC

    // Calculate wallet age (between 30 days and 5 years)
    const maxAge = 5 * 365 // 5 years in days
    const walletAge = 30 + (hash % (maxAge - 30))

    // Calculate first transaction date
    const now = new Date()
    const firstTxDate = new Date(now.getTime() - walletAge * 24 * 60 * 60 * 1000)

    // Calculate last transaction date (between 1 day ago and wallet age)
    const lastTxDaysAgo = 1 + (hash % 30) // Between 1 and 30 days ago
    const lastTxDate = new Date(now.getTime() - lastTxDaysAgo * 24 * 60 * 60 * 1000)

    const walletData: WalletData = {
      address: wallet,
      txCount,
      txVolume,
      walletAge,
      firstTxDate: firstTxDate.toISOString(),
      lastTxDate: lastTxDate.toISOString(),
    }

    return NextResponse.json(walletData)
  } catch (error) {
    console.error("Error processing request:", error)
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 })
  }
}
