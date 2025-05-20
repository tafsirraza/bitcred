import type React from "react"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/lib/auth-context"
import { Toaster } from "@/components/ui/toaster"
import { DebugEnv } from "@/components/debug-env"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "BitCred",
  description: "Analyze Bitcoin wallets and generate verifiable credit scores with zero-knowledge proofs",
    generator: 'BitCred Community'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <AuthProvider>
            {children}
            <Toaster />
           {/* <DebugEnv /> */}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
