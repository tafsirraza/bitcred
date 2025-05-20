"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Navbar } from "@/components/navbar"
import { DashboardTable } from "@/components/dashboard-table"
import { motion } from "framer-motion"

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen gradient-bg grid-pattern">
      <Navbar />

      <div className="container mx-auto px-4 pt-24 pb-12">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Your Dashboard</h1>
          <p className="text-white/60 mb-8">View and manage your wallet analysis records</p>
        </motion.div>

        <DashboardTable />
      </div>
    </div>
  )
}
