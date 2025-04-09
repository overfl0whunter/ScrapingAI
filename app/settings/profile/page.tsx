"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/components/auth/auth-provider"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { Loader2, Save, Github, Twitter, Globe } from "lucide-react"

export default function ProfileSettingsPage() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<any>(null)
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [username, setUsername] = useState("")
  const [bio, setBio] = useState("")
  const [website, setWebsite] = useState("")
  const [githubUrl, setGithubUrl] = useState("")
  const [twitterUrl, setTwitterUrl] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const supabase = getSupabaseBrowserClient()

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return

      const { data, error } = await supabase.from("user_profiles").select("*").eq("user_id", user.id).single()

      if (!error && data) {
        setProfile(data)
        setFirstName(data.first_name || "")
        setLastName(data.last_name || "")
        setUsername(data.username || "")
        setBio(data.bio || "")
        setWebsite(data.website || "")
        setGithubUrl(data.github_url || "")
        setTwitterUrl(data.twitter_url || "")
      }

      setLoading(false)
    }

    fetchProfile()
  }, [user, supabase])

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
          .not("user_id", "eq", user?.id || "")
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
          .eq("user_id", user?.id)

        if (error) throw error
      } else {
        // Create new profile
        const { error } = await supabase.from("user_profiles").insert({
          user_id: user?.id,
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
    } catch (error: any) {
      console.error("Error saving profile:", error)
      setMessage({ type: "error", text: error.message || "Failed to save profile" })
    } finally {
      setSaving(false)
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
        <h3 className="text-lg font-medium">Profile Settings</h3>
        <p className="text-sm text-muted-foreground">Update your profile information visible to other users.</p>
      </div>

      <Card>
        <form onSubmit={handleSaveProfile}>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Update your personal information and public profile</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={profile?.avatar_url} alt={profile?.username} />
                <AvatarFallback className="text-lg">
                  {firstName?.[0]}
                  {lastName?.[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <Button variant="outline" size="sm" type="button">
                  Change Avatar
                </Button>
              </div>
            </div>

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
                <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Doe" />
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
    </div>
  )
}
