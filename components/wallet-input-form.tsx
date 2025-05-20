"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { motion } from "framer-motion"
import { Loader2 } from "lucide-react"
import { calculateScore, generateZkProof } from "@/lib/zk"
import { createWalletRecord } from "@/lib/supabase-client"

interface WalletInputFormProps {
  onAnalysisComplete?: (result: AnalysisResult) => void
}

export interface AnalysisResult {
  wallet: string
  score: number
  zkProof: string
  txCount: number
  txVolume: number
  walletAge: number
  firstTxDate: string
  lastTxDate: string
  timestamp: string
}

export function WalletInputForm({ onAnalysisComplete }: WalletInputFormProps) {
  const [wallet, setWallet] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const { user } = useAuth()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!wallet) {
      toast({
        title: "Error",
        description: "Please enter a Bitcoin wallet address",
        variant: "destructive",
      })
      return
    }

    // Validate Bitcoin wallet address format
    const bitcoinAddressRegex = /^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,39}$/
    if (!bitcoinAddressRegex.test(wallet)) {
      toast({
        title: "Invalid Wallet",
        description: "Please enter a valid Bitcoin wallet address",
        variant: "destructive",
      })
      return
    }

    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to analyze wallet addresses",
        variant: "destructive",
      })
      return
    }

    try {
      setIsAnalyzing(true)

      // Call the Rebar API via our secure endpoint
      const response = await fetch("/api/rebar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ wallet }),
      })

      if (!response.ok) {
        throw new Error("Failed to fetch wallet data")
      }

      const walletData = await response.json()

      // Calculate the credit score
      const score = calculateScore(walletData.txCount, walletData.txVolume, walletData.walletAge)

      // Generate ZK proof
      const zkProof = await generateZkProof(
        wallet,
        score,
        walletData.txCount,
        walletData.txVolume,
        walletData.walletAge,
      )

      // Save record to Supabase
      await createWalletRecord(user.id, wallet, score, zkProof)

      // Prepare result
      const result: AnalysisResult = {
        wallet,
        score,
        zkProof,
        txCount: walletData.txCount,
        txVolume: walletData.txVolume,
        walletAge: walletData.walletAge,
        firstTxDate: walletData.firstTxDate,
        lastTxDate: walletData.lastTxDate,
        timestamp: new Date().toISOString(),
      }

      // Call the callback with the result if provided
      if (onAnalysisComplete) {
        onAnalysisComplete(result)
      }

      // Reset form
      setWallet("")
    } catch (error) {
      console.error("Error analyzing wallet:", error)
      toast({
        title: "Analysis Failed",
        description: "Failed to analyze wallet. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      id="wallet-input"
    >
      <Card className="glass-card overflow-hidden">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-2xl font-bold text-white mb-4">Analyze Bitcoin Wallet</h2>
            <div className="space-y-2">
              <Input
                type="text"
                placeholder="Enter Bitcoin wallet address"
                value={wallet}
                onChange={(e) => setWallet(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                disabled={isAnalyzing}
              />
              <p className="text-xs text-white/60">Example: bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh</p>
            </div>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              disabled={isAnalyzing}
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                "Analyze Wallet"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  )
}
