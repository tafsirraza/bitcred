"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { WalletInputForm, type AnalysisResult } from "@/components/wallet-input-form"
import { ResultCard } from "@/components/result-card"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { FileText, BarChart3, Shield } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  const [result, setResult] = useState<AnalysisResult | null>(null)

  const handleAnalysisComplete = (analysisResult: AnalysisResult) => {
    setResult(analysisResult)

    // Scroll to result section
    setTimeout(() => {
      document.getElementById("result")?.scrollIntoView({ behavior: "smooth" })
    }, 100)
  }

  return (
    <div className="min-h-screen gradient-bg grid-pattern">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-24 pb-16 md:pt-32 md:pb-24">
        <div className="container mx-auto px-4">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                Decentralized Credit Scores
              </span>{" "}
              for the Web3 Economy
            </h1>
            <p className="text-xl text-white/80 mb-8">
              BitCred analyzes Bitcoin wallet activity to generate verifiable credit scores with zero-knowledge proofs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <a href="#wallet-input">Analyze Wallet</a>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                <Link href="/dashboard">View Dashboard</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-black/30">
        <div className="container mx-auto px-4">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="p-6 rounded-xl bg-white/5 border border-white/10">
              <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Privacy-Preserving</h3>
              <p className="text-white/70">
                Zero-knowledge proofs allow verification without revealing sensitive wallet data.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-white/5 border border-white/10">
              <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center mb-4">
                <FileText className="h-6 w-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Verifiable Credentials</h3>
              <p className="text-white/70">
                Download and share standardized verifiable credentials with third parties.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-white/5 border border-white/10">
              <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
                <BarChart3 className="h-6 w-6 text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Real-Time Analysis</h3>
              <p className="text-white/70">
                Get instant credit scores based on transaction history, volume, and wallet age.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Wallet Analysis Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            className="max-w-xl mx-auto mb-12 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold text-white mb-4">Analyze Your Bitcoin Wallet</h2>
            <p className="text-white/70">
              Enter your Bitcoin wallet address to generate a credit score based on your transaction history.
            </p>
          </motion.div>

          <div className="max-w-xl mx-auto">
            <WalletInputForm onAnalysisComplete={handleAnalysisComplete} />
            <ResultCard result={result} />
          </div>
        </div>
      </section>

      {/* Verification Section */}
      <section className="py-16 bg-black/30">
        <div className="container mx-auto px-4">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold text-white mb-4">Verify Credentials</h2>
            <p className="text-xl text-white/70 mb-8">
              Need to verify a BitCred score? Our verification tool allows anyone to validate the authenticity of a
              BitCred verifiable credential.
            </p>
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Link href="/verify">Verify a Credential</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-white/10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center mr-2">
                <span className="text-white font-bold">B</span>
              </div>
              <span className="text-xl font-bold text-white">BitCred</span>
            </div>
            <div className="flex space-x-6 mb-4 md:mb-0">
              <Link href="/dashboard" className="text-white/60 hover:text-white transition-colors">
                Dashboard
              </Link>
              <Link href="/verify" className="text-white/60 hover:text-white transition-colors">
                Verify
              </Link>
              <Link href="/settings" className="text-white/60 hover:text-white transition-colors">
                Settings
              </Link>
            </div>
            <div className="text-white/60 text-sm">&copy; {new Date().getFullYear()} BitCred. All rights reserved.</div>
          </div>
        </div>
      </footer>
    </div>
  )
}
