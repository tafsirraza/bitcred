"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { motion } from "framer-motion"
import { Download, Check, Copy } from "lucide-react"
import type { AnalysisResult } from "./wallet-input-form"

interface ResultCardProps {
  result: AnalysisResult | null
}

export function ResultCard({ result }: ResultCardProps) {
  const { toast } = useToast()
  const [copied, setCopied] = useState(false)

  if (!result) return null

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      toast({
        title: "Copied!",
        description: "Proof hash copied to clipboard",
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Could not copy to clipboard",
        variant: "destructive",
      })
    }
  }

  const downloadVC = () => {
    const vc = {
      "@context": ["https://www.w3.org/2018/credentials/v1", "https://www.w3.org/2018/credentials/examples/v1"],
      id: `urn:uuid:${crypto.randomUUID()}`,
      type: ["VerifiableCredential", "BitCredScore"],
      issuer: "https://bitcred.example.com",
      issuanceDate: result.timestamp,
      credentialSubject: {
        id: `bitcoin:${result.wallet}`,
        creditScore: result.score,
        txCount: result.txCount,
        txVolume: result.txVolume,
        walletAge: result.walletAge,
        firstTransaction: result.firstTxDate,
        lastTransaction: result.lastTxDate,
      },
      proof: {
        type: "ZkProof2023",
        created: result.timestamp,
        proofValue: result.zkProof,
        proofPurpose: "assertionMethod",
        verificationMethod: "https://bitcred.example.com/keys/1",
      },
    }

    const blob = new Blob([JSON.stringify(vc, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `bitcred-vc-${result.wallet.substring(0, 8)}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Downloaded!",
      description: "Verifiable Credential downloaded successfully",
    })
  }

  // Format wallet address for display
  const formatWallet = (wallet: string) => {
    if (wallet.length <= 16) return wallet
    return `${wallet.substring(0, 8)}...${wallet.substring(wallet.length - 8)}`
  }

  // Get score color based on value
  const getScoreColor = (score: number) => {
    if (score >= 700) return "text-green-400"
    if (score >= 500) return "text-yellow-400"
    return "text-red-400"
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      id="result"
      className="mt-8"
    >
      <Card className="glass-card overflow-hidden border-t-2 border-t-blue-500 glow">
        <CardContent className="p-6">
          <div className="space-y-6">
            <div className="flex justify-between items-start">
              <h2 className="text-2xl font-bold text-white">Wallet Analysis</h2>
              <motion.div
                className="text-5xl font-bold glow-text"
                initial={{ scale: 1.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <span className={getScoreColor(result.score)}>{result.score}</span>
              </motion.div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-white/60">Wallet Address</p>
                  <p className="text-white font-mono">{formatWallet(result.wallet)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-white/60">ZK Proof</p>
                  <div className="flex items-center">
                    <p className="text-white font-mono truncate mr-2">{result.zkProof.substring(0, 16)}...</p>
                    <button onClick={() => copyToClipboard(result.zkProof)} className="text-white/60 hover:text-white">
                      {copied ? <Check size={16} /> : <Copy size={16} />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-white/60">Transactions</p>
                  <p className="text-white">{result.txCount.toLocaleString()}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-white/60">Volume</p>
                  <p className="text-white">{result.txVolume.toFixed(2)} BTC</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-white/60">Age</p>
                  <p className="text-white">{result.walletAge} days</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-white/60">Last Activity</p>
                  <p className="text-white">{new Date(result.lastTxDate).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            <Button
              onClick={downloadVC}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Download className="mr-2 h-4 w-4" />
              Download Verifiable Credential
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
