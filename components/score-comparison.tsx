"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getUserRecords } from "@/lib/supabase"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"
import { motion } from "framer-motion"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  type TooltipProps,
  Cell,
} from "recharts"

interface WalletRecord {
  id: string
  user_id: string
  wallet: string
  score: number
  zk_proof: string
  created_at: string
}

interface ComparisonData {
  category: string
  score: number
  benchmark: number
}

const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-black/80 p-3 rounded-md border border-white/10 text-white text-sm">
        <p className="font-bold">{label}</p>
        <p>Your Score: {payload[0].value}</p>
        <p>Average: {payload[1].value}</p>
      </div>
    )
  }

  return null
}

export function ScoreComparison() {
  const [comparisonData, setComparisonData] = useState<ComparisonData[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return

      try {
        setLoading(true)
        const { data, error } = await getUserRecords(user.id)

        if (error) {
          throw error
        }

        if (data && data.length > 0) {
          // Get the latest score
          const latestRecord = data.sort(
            (a: WalletRecord, b: WalletRecord) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
          )[0]

          // Create comparison data with benchmark values
          // In a real app, these would come from an API
          const comparisonData: ComparisonData[] = [
            {
              category: "Overall",
              score: latestRecord.score,
              benchmark: 650, // Average overall score
            },
            {
              category: "Transaction Volume",
              score: Math.min(Math.floor(latestRecord.score * 1.1), 850), // Simulated component score
              benchmark: 620, // Average transaction volume score
            },
            {
              category: "Wallet Age",
              score: Math.min(Math.floor(latestRecord.score * 0.9), 850), // Simulated component score
              benchmark: 680, // Average wallet age score
            },
            {
              category: "Activity",
              score: Math.min(Math.floor(latestRecord.score * 1.05), 850), // Simulated component score
              benchmark: 600, // Average activity score
            },
          ]

          setComparisonData(comparisonData)
        }
      } catch (error) {
        console.error("Error fetching data:", error)
        toast({
          title: "Error",
          description: "Failed to load comparison data",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user, toast])

  // Get color based on score
  const getScoreColor = (score: number) => {
    if (score >= 700) return "#10b981" // Green
    if (score >= 500) return "#f59e0b" // Yellow
    return "#ef4444" // Red
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="glass-card overflow-hidden">
        <CardHeader>
          <CardTitle className="text-white">Score Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-white/60" />
            </div>
          ) : comparisonData.length === 0 ? (
            <div className="text-center py-8 text-white/60">
              <p>No comparison data available. Analyze a wallet to get started.</p>
            </div>
          ) : (
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={comparisonData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  barGap={0}
                  barCategoryGap={30}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="category" stroke="rgba(255,255,255,0.5)" tick={{ fill: "rgba(255,255,255,0.7)" }} />
                  <YAxis domain={[0, 850]} stroke="rgba(255,255,255,0.5)" tick={{ fill: "rgba(255,255,255,0.7)" }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="score" name="Your Score" radius={[4, 4, 0, 0]}>
                    {comparisonData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={getScoreColor(entry.score)} />
                    ))}
                  </Bar>
                  <Bar dataKey="benchmark" name="Average" fill="rgba(255,255,255,0.3)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
