"use client"

import { useState } from "react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { motion } from "framer-motion"

export function Navbar() {
  const { user, signOut } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-lg border-b border-white/10"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <motion.div
            className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-white font-bold">B</span>
          </motion.div>
          <span className="text-xl font-bold text-white">BitCred</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <Link href="/#wallet-input" className="text-white/80 hover:text-white transition-colors">
            Analyze Wallet
          </Link>
          {user && (
            <Link href="/dashboard" className="text-white/80 hover:text-white transition-colors">
              Dashboard
            </Link>
          )}
          {user ? (
            <Button variant="outline" onClick={() => signOut()}>
              Sign Out
            </Button>
          ) : (
            <Link href="/auth">
              <Button>Sign In</Button>
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-white" onClick={toggleMenu}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <motion.div
          className="md:hidden bg-black/90 backdrop-blur-lg"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            <Link
              href="/#wallet-input"
              className="text-white/80 hover:text-white transition-colors py-2"
              onClick={toggleMenu}
            >
              Analyze Wallet
            </Link>
            {user && (
              <Link
                href="/dashboard"
                className="text-white/80 hover:text-white transition-colors py-2"
                onClick={toggleMenu}
              >
                Dashboard
              </Link>
            )}
            {user ? (
              <Button
                variant="outline"
                onClick={() => {
                  signOut()
                  toggleMenu()
                }}
              >
                Sign Out
              </Button>
            ) : (
              <Link href="/auth" onClick={toggleMenu}>
                <Button className="w-full">Sign In</Button>
              </Link>
            )}
          </div>
        </motion.div>
      )}
    </motion.nav>
  )
}
