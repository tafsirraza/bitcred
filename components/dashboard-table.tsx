"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { getUserRecords } from "@/lib/supabase-client"
import { Loader2, Eye, Download } from "lucide-react"
import { motion } from "framer-motion"
import { RecordModal } from "./record-modal"

interface WalletRecord {
  id: string
  user_id: string
  wallet: string
  score: number
  zk_proof: string
  created_at: string
}

export function DashboardTable() {
  const [records, setRecords] = useState<WalletRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedRecord, setSelectedRecord] = useState<WalletRecord | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const { user } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    const fetchRecords = async () => {
      if (!user) return

      try {
        setLoading(true)
        const { data, error } = await getUserRecords(user.id)

        if (error) {
          throw error
        }

        setRecords(data || [])
      } catch (error) {
        console.error("Error fetching records:", error)
        toast({
          title: "Error",
          description: "Failed to load wallet records",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchRecords()
  }, [user, toast])

  const handleViewRecord = (record: WalletRecord) => {
    setSelectedRecord(record)
    setModalOpen(true)
  }

  const downloadVC = (record: WalletRecord) => {
    const vc = {
      "@context": ["https://www.w3.org/2018/credentials/v1", "https://www.w3.org/2018/credentials/examples/v1"],
      id: `urn:uuid:${crypto.randomUUID()}`,
      type: ["VerifiableCredential", "BitCredScore"],
      issuer: "https://bitcred.example.com",
      issuanceDate: record.created_at,
      credentialSubject: {
        id: `bitcoin:${record.wallet}`,
        creditScore: record.score,
      },
      proof: {
        type: "ZkProof2023",
        created: record.created_at,
        proofValue: record.zk_proof,
        proofPurpose: "assertionMethod",
        verificationMethod: "https://bitcred.example.com/keys/1",
      },
    }

    const blob = new Blob([JSON.stringify(vc, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `bitcred-vc-${record.wallet.substring(0, 8)}.json`
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
    <>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card className="glass-card overflow-hidden">
          <CardHeader>
            <CardTitle className="text-white">Your Wallet Records</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-white/60" />
              </div>
            ) : records.length === 0 ? (
              <div className="text-center py-8 text-white/60">
                <p>No wallet records found. Analyze a wallet to get started.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="px-4 py-3 text-left text-sm font-medium text-white/60">Wallet</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-white/60">Score</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-white/60">Date</th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-white/60">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {records.map((record) => (
                      <tr key={record.id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                        <td className="px-4 py-3 text-sm text-white font-mono">{formatWallet(record.wallet)}</td>
                        <td className="px-4 py-3 text-sm">
                          <span className={`font-bold ${getScoreColor(record.score)}`}>{record.score}</span>
                        </td>
                        <td className="px-4 py-3 text-sm text-white/80">
                          {new Date(record.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 text-sm text-right">
                          <div className="flex justify-end space-x-2">
                            <Button variant="ghost" size="sm" onClick={() => handleViewRecord(record)}>
                              <Eye className="h-4 w-4" />
                              <span className="sr-only">View</span>
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => downloadVC(record)}>
                              <Download className="h-4 w-4" />
                              <span className="sr-only">Download</span>
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      <RecordModal record={selectedRecord} open={modalOpen} onOpenChange={setModalOpen} />
    </>
  )
}
