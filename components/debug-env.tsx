"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function DebugEnv() {
  const [showDebug, setShowDebug] = useState(false)

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button variant="outline" size="sm" onClick={() => setShowDebug(!showDebug)}>
        {showDebug ? "Hide Debug" : "Debug"}
      </Button>

      {showDebug && (
        <Card className="absolute bottom-12 right-0 w-96 bg-black/90 border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Environment Debug</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-xs">
            <div>
              <p className="text-white/60">NEXT_PUBLIC_SUPABASE_URL:</p>
              <p className="font-mono text-white/90 break-all">{process.env.NEXT_PUBLIC_SUPABASE_URL || "(not set)"}</p>
            </div>
            <div>
              <p className="text-white/60">NEXT_PUBLIC_SUPABASE_ANON_KEY:</p>
              <p className="font-mono text-white/90 break-all">
                {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
                  ? `${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.substring(0, 10)}...`
                  : "(not set)"}
              </p>
            </div>
            <div className="pt-2 border-t border-white/10">
              <p className="text-white/60">
                Using fallback values: {process.env.NEXT_PUBLIC_SUPABASE_URL ? "No" : "Yes"}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
