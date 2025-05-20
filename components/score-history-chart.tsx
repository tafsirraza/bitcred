"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getUserRecords } from "@/lib/supabase"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"
import { motion } from "framer-motion"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, type TooltipProps } from "recharts"

interface WalletRecord {
  id: string
  user_id: string
  wallet: string
  score: number
  zk_proof: string
  created_at: string
}

interface ChartData {
  date: string
  score: number
  wallet: string
}

const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-black/80 p-3 rounded-md border border-white/10 text-white text-sm">
        <p className="font-bold">{label}</p>
        <p>Score: {payload[0].value}</p>
        <p className="text-xs text-white/60 truncate max-w-[200px]">Wallet: {payload[0].payload.wallet}</p>
      </div>
    )
  }

  return null
}

export function ScoreHistoryChart() {
  const [chartData, setChartData] = useState<ChartData[]>([])
  const [loading, setLoading] = useState(true)
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

        if (data) {
          // Transform the data for the chart
          const formattedData: ChartData[] = data.map((record: WalletRecord) => ({
            date: new Date(record.created_at).toLocaleDateString(),
            score: record.score,
            wallet: record.wallet,
          }))

          // Sort by date
          formattedData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

          setChartData(formattedData)
        }
      } catch (error) {
        console.error("Error fetching records:", error)
        toast({
          title: "Error",
          description: "Failed to load score history",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchRecords()
  }, [user, toast])

  // Get gradient colors for the chart
  const getGradientColors = () => {
    if (chartData.length === 0) return ["#3b82f6", "#8b5cf6"]

    const lastScore = chartData[chartData.length - 1].score
    if (lastScore >= 700) return ["#34d399", "#10b981"] // Green
    if (lastScore >= 500) return ["#fbbf24", "#f59e0b"] // Yellow
    return ["#f87171", "#ef4444"] // Red
  }

  const [startColor, endColor] = getGradientColors()

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="glass-card overflow-hidden">
        <CardHeader>
          <CardTitle className="text-white">Score History</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-white/60" />
            </div>
          ) : chartData.length === 0 ? (
            <div className="text-center py-8 text-white/60">
              <p>No score history available. Analyze a wallet to get started.</p>
            </div>
          ) : (
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <defs>
                    <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={startColor} stopOpacity={0.8} />
                      <stop offset="95%" stopColor={endColor} stopOpacity={0.2} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="date" stroke="rgba(255,255,255,0.5)" tick={{ fill: "rgba(255,255,255,0.7)" }} />
                  <YAxis domain={[0, 850]} stroke="rgba(255,255,255,0.5)" tick={{ fill: "rgba(255,255,255,0.7)" }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="url(#scoreGradient)"
                    strokeWidth={3}
                    dot={{ fill: "#fff", strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, fill: "#fff" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
