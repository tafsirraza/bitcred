"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Copy, Download, Check } from "lucide-react"
import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"

interface WalletRecord {
  id: string
  user_id: string
  wallet: string
  score: number
  zk_proof: string
  created_at: string
}

interface RecordModalProps {
  record: WalletRecord | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function RecordModal({ record, open, onOpenChange }: RecordModalProps) {
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

  if (!record) return null

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

  // Get score color based on value
  const getScoreColor = (score: number) => {
    if (score >= 700) return "text-green-400"
    if (score >= 500) return "text-yellow-400"
    return "text-red-400"
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-card border-white/10 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl">Wallet Record Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex justify-between items-center">
            <span className="text-white/60">Credit Score</span>
            <span className={`text-2xl font-bold ${getScoreColor(record.score)}`}>{record.score}</span>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-white/60">Wallet Address</span>
              <span className="font-mono text-sm">{record.wallet}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-white/60">ZK Proof</span>
              <div className="flex items-center">
                <span className="font-mono text-sm mr-2 truncate max-w-[200px]">{record.zk_proof}</span>
                <button onClick={() => copyToClipboard(record.zk_proof)} className="text-white/60 hover:text-white">
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                </button>
              </div>
            </div>

            <div className="flex justify-between">
              <span className="text-white/60">Date</span>
              <span>{new Date(record.created_at).toLocaleString()}</span>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={downloadVC}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Download className="mr-2 h-4 w-4" />
            Download Verifiable Credential
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
