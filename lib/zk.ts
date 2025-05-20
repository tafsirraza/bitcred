import { buildPoseidon } from "circomlibjs"

// Cache the poseidon instance
let poseidonInstance: any = null

async function getPoseidon() {
  if (!poseidonInstance) {
    poseidonInstance = await buildPoseidon()
  }
  return poseidonInstance
}

export async function generateZkProof(
  wallet: string,
  score: number,
  txCount: number,
  txVolume: number,
  walletAge: number,
): Promise<string> {
  try {
    const poseidon = await getPoseidon()

    // Convert inputs to field elements (big integers)
    const walletHash = Buffer.from(wallet).toString("hex")
    const scoreInt = Math.floor(score * 100) // Convert to integer (2 decimal places)

    // Create inputs for the hash function
    const inputs = [
      BigInt("0x" + walletHash.slice(0, 16)),
      BigInt(scoreInt),
      BigInt(txCount),
      BigInt(Math.floor(txVolume)),
      BigInt(walletAge),
    ]

    // Generate the hash using Poseidon
    const hash = poseidon.F.toString(poseidon(inputs))

    // Return a shortened version of the hash as the "proof"
    // In a real implementation, this would be a proper zk-SNARK proof
    return `0x${hash.slice(0, 40)}`
  } catch (error) {
    console.error("Error generating ZK proof:", error)
    throw new Error("Failed to generate zero-knowledge proof")
  }
}

// Function to verify the proof (simplified for demo)
export async function verifyZkProof(proof: string, wallet: string, score: number): Promise<boolean> {
  // In a real implementation, this would verify the zk-SNARK proof
  // For now, we'll just return true
  return true
}

// Calculate credit score based on wallet data
export function calculateScore(txCount: number, txVolume: number, walletAge: number): number {
  // Normalize inputs
  const normalizedTxCount = Math.min(txCount, 1000) / 1000
  const normalizedTxVolume = Math.min(txVolume, 100000) / 100000
  const normalizedWalletAge = Math.min(walletAge, 3650) / 3650 // Max 10 years

  // Calculate score using the provided formula
  const score = normalizedTxCount * 0.4 + normalizedTxVolume * 0.4 + normalizedWalletAge * 0.2

  // Scale to 0-850 (similar to traditional credit scores)
  return Math.floor(score * 850)
}
