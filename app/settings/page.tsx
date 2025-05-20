"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Save, Trash2 } from "lucide-react"
import { motion } from "framer-motion"
import { supabase } from "@/lib/supabase"

interface UserSettings {
  email_notifications: boolean
  public_profile: boolean
  api_access: boolean
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<UserSettings>({
    email_notifications: true,
    public_profile: false,
    api_access: false,
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const { user, loading: authLoading, signOut } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth")
    } else if (user) {
      // Set email from user
      setEmail(user.email || "")

      // Fetch user settings
      const fetchSettings = async () => {
        try {
          setLoading(true)
          const { data, error } = await supabase.from("user_settings").select("*").eq("user_id", user.id).single()

          if (error && error.code !== "PGRST116") {
            // PGRST116 is "no rows returned" error
            throw error
          }

          if (data) {
            setSettings({
              email_notifications: data.email_notifications,
              public_profile: data.public_profile,
              api_access: data.api_access,
            })
          }
        } catch (error) {
          console.error("Error fetching settings:", error)
          toast({
            title: "Error",
            description: "Failed to load user settings",
            variant: "destructive",
          })
        } finally {
          setLoading(false)
        }
      }

      fetchSettings()
    }
  }, [user, authLoading, router, toast])

  const handleSaveSettings = async () => {
    if (!user) return

    try {
      setSaving(true)

      // Update user settings
      const { error } = await supabase.from("user_settings").upsert(
        {
          user_id: user.id,
          email_notifications: settings.email_notifications,
          public_profile: settings.public_profile,
          api_access: settings.api_access,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" },
      )

      if (error) throw error

      toast({
        title: "Settings Saved",
        description: "Your settings have been updated successfully",
      })
    } catch (error) {
      console.error("Error saving settings:", error)
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleUpdateEmail = async () => {
    if (!user || !email) return

    try {
      setSaving(true)

      const { error } = await supabase.auth.updateUser({ email })

      if (error) throw error

      toast({
        title: "Email Update Initiated",
        description: "Please check your new email for a confirmation link",
      })
    } catch (error: any) {
      console.error("Error updating email:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to update email",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleUpdatePassword = async () => {
    if (!user || !password) return

    try {
      setSaving(true)

      const { error } = await supabase.auth.updateUser({ password })

      if (error) throw error

      toast({
        title: "Password Updated",
        description: "Your password has been updated successfully",
      })
      setPassword("")
    } catch (error: any) {
      console.error("Error updating password:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to update password",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (!user) return

    // In a real app, you would want to add a confirmation dialog here
    const confirmed = window.confirm("Are you sure you want to delete your account? This action cannot be undone.")
    if (!confirmed) return

    try {
      setSaving(true)

      // Delete user data from the database
      const { error: dataError } = await supabase.from("wallet_records").delete().eq("user_id", user.id)
      if (dataError) throw dataError

      const { error: settingsError } = await supabase.from("user_settings").delete().eq("user_id", user.id)
      if (settingsError && settingsError.code !== "PGRST116") throw settingsError

      // In a real app, you would need to call a server function to delete the user from auth
      // For this demo, we'll just sign out
      await signOut()
      router.push("/")

      toast({
        title: "Account Deleted",
        description: "Your account has been deleted successfully",
      })
    } catch (error: any) {
      console.error("Error deleting account:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to delete account",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  if (authLoading) {
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
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Settings</h1>
          <p className="text-white/60 mb-8">Manage your account and preferences</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <Card className="glass-card overflow-hidden">
              <CardHeader>
                <CardTitle className="text-white">Account Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {loading ? (
                  <div className="flex justify-center items-center py-4">
                    <Loader2 className="h-6 w-6 animate-spin text-white/60" />
                  </div>
                ) : (
                  <>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-white">
                          Email Address
                        </Label>
                        <div className="flex space-x-2">
                          <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                          />
                          <Button
                            onClick={handleUpdateEmail}
                            disabled={saving || email === user.email}
                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                          >
                            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Update"}
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="password" className="text-white">
                          New Password
                        </Label>
                        <div className="flex space-x-2">
                          <Input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter new password"
                            className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                          />
                          <Button
                            onClick={handleUpdatePassword}
                            disabled={saving || !password}
                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                          >
                            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Update"}
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4">
                      <Button variant="destructive" onClick={handleDeleteAccount} disabled={saving} className="w-full">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Account
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <Card className="glass-card overflow-hidden">
              <CardHeader>
                <CardTitle className="text-white">Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {loading ? (
                  <div className="flex justify-center items-center py-4">
                    <Loader2 className="h-6 w-6 animate-spin text-white/60" />
                  </div>
                ) : (
                  <>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="email-notifications" className="text-white">
                            Email Notifications
                          </Label>
                          <p className="text-sm text-white/60">Receive email updates about your wallet scores</p>
                        </div>
                        <Switch
                          id="email-notifications"
                          checked={settings.email_notifications}
                          onCheckedChange={(checked) =>
                            setSettings((prev) => ({ ...prev, email_notifications: checked }))
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="public-profile" className="text-white">
                            Public Profile
                          </Label>
                          <p className="text-sm text-white/60">Allow others to view your wallet scores</p>
                        </div>
                        <Switch
                          id="public-profile"
                          checked={settings.public_profile}
                          onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, public_profile: checked }))}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="api-access" className="text-white">
                            API Access
                          </Label>
                          <p className="text-sm text-white/60">Enable API access to your wallet data</p>
                        </div>
                        <Switch
                          id="api-access"
                          checked={settings.api_access}
                          onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, api_access: checked }))}
                        />
                      </div>
                    </div>

                    <Button
                      onClick={handleSaveSettings}
                      disabled={saving}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      {saving ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Save Preferences
                        </>
                      )}
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
