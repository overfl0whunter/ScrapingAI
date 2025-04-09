"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { Loader2, Key, Save } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { User } from "@supabase/supabase-js"

interface AccountSettingsFormProps {
  user: User
  apiKeys: any[]
}

export default function AccountSettingsForm({ user, apiKeys }: AccountSettingsFormProps) {
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [serviceName, setServiceName] = useState("")
  const [apiKey, setApiKey] = useState("")
  const [apiKeysList, setApiKeysList] = useState(apiKeys)
  const [saving, setSaving] = useState(false)
  const [savingApiKey, setSavingApiKey] = useState(false)
  const { toast } = useToast()
  const supabase = getSupabaseBrowserClient()

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      if (newPassword !== confirmPassword) {
        toast({
          title: "Passwords don't match",
          description: "New password and confirmation must match",
          variant: "destructive",
        })
        return
      }

      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      })

      if (error) throw error

      toast({
        title: "Password updated",
        description: "Your password has been changed successfully.",
      })

      // Clear form
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } catch (error: any) {
      console.error("Error changing password:", error)
      toast({
        title: "Error changing password",
        description: error.message || "Failed to change password",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleAddApiKey = async (e: React.FormEvent) => {
    e.preventDefault()
    setSavingApiKey(true)

    try {
      if (!serviceName.trim() || !apiKey.trim()) {
        toast({
          title: "Missing information",
          description: "Service name and API key are required",
          variant: "destructive",
        })
        return
      }

      // Add new API key
      const { data, error } = await supabase
        .from("user_api_keys")
        .insert({
          user_id: user.id,
          service_name: serviceName.trim(),
          api_key: apiKey.trim(),
        })
        .select()
        .single()

      if (error) throw error

      setApiKeysList([...apiKeysList, data])
      setServiceName("")
      setApiKey("")

      toast({
        title: "API key added",
        description: "Your API key has been added successfully.",
      })
    } catch (error: any) {
      console.error("Error adding API key:", error)
      toast({
        title: "Error adding API key",
        description: error.message || "Failed to add API key",
        variant: "destructive",
      })
    } finally {
      setSavingApiKey(false)
    }
  }

  const handleDeleteApiKey = async (id: string) => {
    try {
      const { error } = await supabase.from("user_api_keys").delete().eq("id", id)

      if (error) throw error

      setApiKeysList(apiKeysList.filter((key) => key.id !== id))

      toast({
        title: "API key deleted",
        description: "Your API key has been deleted successfully.",
      })
    } catch (error: any) {
      console.error("Error deleting API key:", error)
      toast({
        title: "Error deleting API key",
        description: error.message || "Failed to delete API key",
        variant: "destructive",
      })
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Account Settings</h2>

      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-medium mb-4">Change Password</h3>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" disabled={saving} className="flex items-center gap-2">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {saving ? "Updating..." : "Update Password"}
            </Button>
          </form>
        </div>

        <div className="border-t pt-6">
          <h3 className="text-lg font-medium mb-4">API Keys</h3>
          <form onSubmit={handleAddApiKey} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="serviceName">Service Name</Label>
                <Input
                  id="serviceName"
                  value={serviceName}
                  onChange={(e) => setServiceName(e.target.value)}
                  placeholder="OpenAI, Anthropic, etc."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="apiKey">API Key</Label>
                <Input
                  id="apiKey"
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="sk-..."
                />
              </div>
            </div>
            <Button type="submit" disabled={savingApiKey} className="flex items-center gap-2">
              {savingApiKey ? <Loader2 className="h-4 w-4 animate-spin" /> : <Key className="h-4 w-4" />}
              {savingApiKey ? "Adding..." : "Add API Key"}
            </Button>
          </form>

          <div className="mt-6">
            <h4 className="font-medium mb-3">Your API Keys</h4>
            {apiKeysList.length === 0 ? (
              <p className="text-gray-500">No API keys added yet</p>
            ) : (
              <div className="space-y-2">
                {apiKeysList.map((key) => (
                  <div
                    key={key.id}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-md"
                  >
                    <div>
                      <p className="font-medium">{key.service_name}</p>
                      <p className="text-sm text-gray-500">••••••••••••{key.api_key.slice(-4)}</p>
                    </div>
                    <Button variant="destructive" size="sm" onClick={() => handleDeleteApiKey(key.id)}>
                      Delete
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
