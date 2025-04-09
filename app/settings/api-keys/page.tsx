"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/components/auth/auth-provider"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { Loader2, Plus, Trash2 } from "lucide-react"

export default function ApiKeysSettingsPage() {
  const { user } = useAuth()
  const [serviceName, setServiceName] = useState("")
  const [apiKey, setApiKey] = useState("")
  const [apiKeys, setApiKeys] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const supabase = getSupabaseBrowserClient()

  useEffect(() => {
    const loadApiKeys = async () => {
      if (!user) return

      const { data, error } = await supabase
        .from("user_api_keys")
        .select("*")
        .eq("user_id", user.id)
        .order("service_name", { ascending: true })

      if (!error && data) {
        setApiKeys(data)
      }

      setLoading(false)
    }

    loadApiKeys()
  }, [user, supabase])

  const handleAddApiKey = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage(null)

    try {
      if (!serviceName.trim() || !apiKey.trim()) {
        setMessage({ type: "error", text: "Service name and API key are required" })
        setSaving(false)
        return
      }

      // Add new API key
      const { data, error } = await supabase
        .from("user_api_keys")
        .insert({
          user_id: user?.id,
          service_name: serviceName.trim(),
          api_key: apiKey.trim(),
        })
        .select()
        .single()

      if (error) throw error

      setApiKeys([...apiKeys, data])
      setServiceName("")
      setApiKey("")
      setMessage({ type: "success", text: "API key added successfully!" })
    } catch (error: any) {
      console.error("Error adding API key:", error)
      setMessage({ type: "error", text: error.message || "Failed to add API key" })
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteApiKey = async (id: string) => {
    try {
      const { error } = await supabase.from("user_api_keys").delete().eq("id", id)

      if (error) throw error

      setApiKeys(apiKeys.filter((key) => key.id !== id))
      setMessage({ type: "success", text: "API key deleted successfully!" })
    } catch (error: any) {
      console.error("Error deleting API key:", error)
      setMessage({ type: "error", text: error.message || "Failed to delete API key" })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">API Keys</h3>
        <p className="text-sm text-muted-foreground">
          Manage your API keys for external services like OpenAI, Anthropic, etc.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add New API Key</CardTitle>
          <CardDescription>Add API keys for AI services you want to use</CardDescription>
        </CardHeader>
        <form onSubmit={handleAddApiKey}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="serviceName">Service Name</Label>
                <Input
                  id="serviceName"
                  value={serviceName}
                  onChange={(e) => setServiceName(e.target.value)}
                  placeholder="OpenAI, Anthropic, etc."
                  required
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
                  required
                />
              </div>
            </div>

            {message && (
              <div
                className={`p-3 rounded-md ${
                  message.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                }`}
              >
                {message.text}
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={saving} className="flex items-center gap-2">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              {saving ? "Adding..." : "Add API Key"}
            </Button>
          </CardFooter>
        </form>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your API Keys</CardTitle>
          <CardDescription>Manage your existing API keys</CardDescription>
        </CardHeader>
        <CardContent>
          {apiKeys.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">No API keys added yet</p>
          ) : (
            <div className="space-y-2">
              {apiKeys.map((key) => (
                <div key={key.id} className="flex items-center justify-between p-3 bg-muted rounded-md">
                  <div>
                    <p className="font-medium">{key.service_name}</p>
                    <p className="text-sm text-muted-foreground">••••••••••••{key.api_key.slice(-4)}</p>
                  </div>
                  <Button variant="destructive" size="sm" onClick={() => handleDeleteApiKey(key.id)} className="h-8">
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
