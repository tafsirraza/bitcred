"use client"

import type React from "react"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { motion } from "framer-motion"
import { verifyZkProof } from "@/lib/zk"
import { CheckCircle, XCircle, Upload, Loader2 } from "lucide-react"

interface VerificationResult {
  isValid: boolean
  wallet: string
  score: number
  timestamp: string
}

export default function VerifyPage() {
  const [vcJson, setVcJson] = useState("")
  const [result, setResult] = useState<VerificationResult | null>(null)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleVerify = async () => {
    if (!vcJson) {
      toast({
        title: "Error",
        description: "Please enter a verifiable credential JSON",
        variant: "destructive",
      })
      return
    }

    try {
      setLoading(true)

      // Parse the VC JSON
      let vc
      try {
        vc = JSON.parse(vcJson)
      } catch (error) {
        throw new Error("Invalid JSON format")
      }

      // Validate the VC structure
      if (
        !vc["@context"] ||
        !vc.type ||
        !vc.type.includes("VerifiableCredential") ||
        !vc.credentialSubject ||
        !vc.proof
      ) {
        throw new Error("Invalid verifiable credential format")
      }

      // Extract the necessary data
      const wallet = vc.credentialSubject.id.replace("bitcoin:", "")
      const score = vc.credentialSubject.creditScore
      const proofValue = vc.proof.proofValue
      const timestamp = vc.issuanceDate

      // Verify the ZK proof
      const isValid = await verifyZkProof(proofValue, wallet, score)

      // Set the verification result
      setResult({
        isValid,
        wallet,
        score,
        timestamp,
      })

      if (isValid) {
        toast({
          title: "Verification Successful",
          description: "The verifiable credential is valid",
        })
      } else {
        toast({
          title: "Verification Failed",
          description: "The verifiable credential could not be verified",
          variant: "destructive",
        })
      }
    } catch (error: any) {
      console.error("Verification error:", error)
      toast({
        title: "Verification Error",
        description: error.message || "Failed to verify credential",
        variant: "destructive",
      })
      setResult(null)
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string
        setVcJson(content)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to read file",
          variant: "destructive",
        })
      }
    }
    reader.readAsText(file)
  }

  // Get score color based on value
  const getScoreColor = (score: number) => {
    if (score >= 700) return "text-green-400"
    if (score >= 500) return "text-yellow-400"
    return "text-red-400"
  }

  return (
    <div className="min-h-screen gradient-bg grid-pattern">
      <Navbar />

      <div className="container mx-auto px-4 pt-24 pb-12">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Verify Credential</h1>
          <p className="text-white/60 mb-8">Verify a BitCred verifiable credential</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <Card className="glass-card overflow-hidden">
              <CardHeader>
                <CardTitle className="text-white">Input Verifiable Credential</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Textarea
                    placeholder="Paste the verifiable credential JSON here"
                    className="min-h-[300px] bg-white/10 border-white/20 text-white placeholder:text-white/50"
                    value={vcJson}
                    onChange={(e) => setVcJson(e.target.value)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="relative">
                    <Input
                      type="file"
                      accept=".json"
                      onChange={handleFileUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                      <Upload className="mr-2 h-4 w-4" />
                      Upload JSON
                    </Button>
                  </div>

                  <Button
                    onClick={handleVerify}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      "Verify Credential"
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <Card className="glass-card overflow-hidden h-full">
              <CardHeader>
                <CardTitle className="text-white">Verification Result</CardTitle>
              </CardHeader>
              <CardContent>
                {result ? (
                  <div className="space-y-6">
                    <div className="flex items-center justify-center">
                      {result.isValid ? (
                        <div className="flex flex-col items-center">
                          <CheckCircle className="h-16 w-16 text-green-400 mb-2" />
                          <p className="text-xl font-bold text-white">Credential Verified</p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <XCircle className="h-16 w-16 text-red-400 mb-2" />
                          <p className="text-xl font-bold text-white">Verification Failed</p>
                        </div>
                      )}
                    </div>

                    {result.isValid && (
                      <div className="space-y-4 mt-4">
                        <div className="flex justify-between items-center p-4 bg-white/5 rounded-lg">
                          <span className="text-white/60">Credit Score</span>
                          <span className={`text-2xl font-bold ${getScoreColor(result.score)}`}>{result.score}</span>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between p-2">
                            <span className="text-white/60">Wallet Address</span>
                            <span className="font-mono text-sm text-white truncate max-w-[200px]">{result.wallet}</span>
                          </div>

                          <div className="flex justify-between p-2">
                            <span className="text-white/60">Issued Date</span>
                            <span className="text-white">{new Date(result.timestamp).toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-[300px] text-white/60">
                    <p>No verification result yet</p>
                    <p className="text-sm mt-2">Upload or paste a verifiable credential to verify</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
