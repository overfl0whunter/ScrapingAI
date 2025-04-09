"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Loader2, ArrowLeft, Save, Github, Twitter, Globe, Key } from "lucide-react"
import Link from "next/link"
import type { User } from "@supabase/supabase-js"

interface UserProfileProps {
  user: User
  profile: any | null
}

export default function UserProfile({ user, profile }: UserProfileProps) {
  const [firstName, setFirstName] = useState(profile?.first_name || "")
  const [lastName, setLastName] = useState(profile?.last_name || "")
  const [username, setUsername] = useState(profile?.username || "")
  const [bio, setBio] = useState(profile?.bio || "")
  const [website, setWebsite] = useState(profile?.website || "")
  const [githubUrl, setGithubUrl] = useState(profile?.github_url || "")
  const [twitterUrl, setTwitterUrl] = useState(profile?.twitter_url || "")
  const [serviceName, setServiceName] = useState("")
  const [apiKey, setApiKey] = useState("")
  const [apiKeys, setApiKeys] = useState<any[]>([])
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const router = useRouter()
  const supabase = getSupabaseBrowserClient()

  useEffect(() => {
    const loadApiKeys = async () => {
      const { data, error } = await supabase
        .from("user_api_keys")
        .select("*")
        .eq("user_id", user.id)
        .order("service_name", { ascending: true })

      if (!error && data) {
        setApiKeys(data)
      }
    }

    loadApiKeys()
  }, [supabase, user.id])

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage(null)

    try {
      // Check if username is already taken (if changed)
      if (username !== profile?.username) {
        const { data: existingUser, error: checkError } = await supabase
          .from("user_profiles")
          .select("username")
          .eq("username", username.trim())
          .not("user_id", "eq", user.id)
          .single()

        if (existingUser) {
          setMessage({ type: "error", text: "Username is already taken" })
          setSaving(false)
          return
        }
      }

      if (profile) {
        // Update existing profile
        const { error } = await supabase
          .from("user_profiles")
          .update({
            first_name: firstName,
            last_name: lastName,
            username: username.trim(),
            bio,
            website,
            github_url: githubUrl,
            twitter_url: twitterUrl,
            updated_at: new Date().toISOString(),
          })
          .eq("user_id", user.id)

        if (error) throw error
      } else {
        // Create new profile
        const { error } = await supabase.from("user_profiles").insert({
          user_id: user.id,
          first_name: firstName,
          last_name: lastName,
          username: username.trim(),
          bio,
          website,
          github_url: githubUrl,
          twitter_url: twitterUrl,
        })

        if (error) throw error
      }

      setMessage({ type: "success", text: "Profile saved successfully!" })
      router.refresh()
    } catch (error: any) {
      console.error("Error saving profile:", error)
      setMessage({ type: "error", text: error.message || "Failed to save profile" })
    } finally {
      setSaving(false)
    }
  }

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
          user_id: user.id,
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

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link href="/" className="flex items-center text-blue-500 hover:text-blue-700">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Link>
      </div>

      <div className="flex items-center mb-8">
        <Avatar className="h-20 w-20 mr-6">
          <AvatarImage src={profile?.avatar_url} alt={profile?.username} />
          <AvatarFallback className="text-lg">
            {firstName?.[0]}
            {lastName?.[0]}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-3xl font-bold">
            {firstName} {lastName}
          </h1>
          <p className="text-gray-500">@{username}</p>
        </div>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="api-keys">API Keys</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal information and public profile</CardDescription>
            </CardHeader>

            <form onSubmit={handleSaveProfile}>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="John"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="johndoe"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={user.email || ""} disabled className="bg-gray-50" />
                  <p className="text-xs text-gray-500">Email cannot be changed</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <textarea
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell us about yourself"
                    className="w-full min-h-[100px] p-2 border rounded-md"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">
                    <Globe className="h-4 w-4 inline mr-2" />
                    Website
                  </Label>
                  <Input
                    id="website"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://yourwebsite.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="github">
                    <Github className="h-4 w-4 inline mr-2" />
                    GitHub
                  </Label>
                  <Input
                    id="github"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    placeholder="https://github.com/username"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="twitter">
                    <Twitter className="h-4 w-4 inline mr-2" />
                    Twitter
                  </Label>
                  <Input
                    id="twitter"
                    value={twitterUrl}
                    onChange={(e) => setTwitterUrl(e.target.value)}
                    placeholder="https://twitter.com/username"
                  />
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
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  {saving ? "Saving..." : "Save Profile"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="api-keys">
          <Card>
            <CardHeader>
              <CardTitle>API Keys</CardTitle>
              <CardDescription>Manage your API keys for external services</CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <form onSubmit={handleAddApiKey} className="space-y-4">
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

                <Button type="submit" disabled={saving} className="flex items-center gap-2">
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Key className="h-4 w-4" />}
                  {saving ? "Adding..." : "Add API Key"}
                </Button>
              </form>

              <div className="border-t pt-4">
                <h3 className="font-medium mb-4">Your API Keys</h3>
                {apiKeys.length === 0 ? (
                  <p className="text-gray-500">No API keys added yet</p>
                ) : (
                  <div className="space-y-2">
                    {apiKeys.map((key) => (
                      <div key={key.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                        <div>
                          <p className="font-medium">{key.service_name}</p>
                          <p className="text-sm text-gray-500">••••••••••••{key.api_key.slice(-4)}</p>
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteApiKey(key.id)}
                          className="h-8"
                        >
                          Delete
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
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
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
