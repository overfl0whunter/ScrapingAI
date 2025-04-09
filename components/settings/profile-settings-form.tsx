"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { Loader2, Save } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { User } from "@supabase/supabase-js"
import ThemePreview from "./theme-preview"

interface ProfileSettingsFormProps {
  user: User
  profile: any | null
  themePreferences: {
    color_scheme: string
    dark_mode: boolean
  }
}

export default function ProfileSettingsForm({ user, profile, themePreferences }: ProfileSettingsFormProps) {
  const [firstName, setFirstName] = useState(profile?.first_name || "")
  const [lastName, setLastName] = useState(profile?.last_name || "")
  const [username, setUsername] = useState(profile?.username || "")
  const [bio, setBio] = useState(profile?.bio || "")
  const [website, setWebsite] = useState(profile?.website || "")
  const [location, setLocation] = useState(profile?.location || "")
  const [githubUrl, setGithubUrl] = useState(profile?.github_url || "")
  const [twitterUrl, setTwitterUrl] = useState(profile?.twitter_url || "")
  const [colorScheme, setColorScheme] = useState(themePreferences?.color_scheme || "default")
  const [saving, setSaving] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const supabase = getSupabaseBrowserClient()

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

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
          toast({
            title: "Username already taken",
            description: "Please choose a different username",
            variant: "destructive",
          })
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
            location,
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
          location,
          github_url: githubUrl,
          twitter_url: twitterUrl,
        })

        if (error) throw error
      }

      // Update theme preferences
      const { error: themeError } = await supabase.from("user_theme_preferences").upsert({
        user_id: user.id,
        color_scheme: colorScheme,
        updated_at: new Date().toISOString(),
      })

      if (themeError) throw themeError

      toast({
        title: "Profile saved",
        description: "Your profile has been updated successfully.",
      })

      router.refresh()
    } catch (error: any) {
      console.error("Error saving profile:", error)
      toast({
        title: "Error saving profile",
        description: error.message || "Failed to save profile",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Profile Settings</h2>

      <form onSubmit={handleSaveProfile} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="John" />
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
          <p className="text-xs text-gray-500">This will be used for your profile URL: /profile/username</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell us about yourself"
            className="min-h-[100px]"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="San Francisco, CA"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="website">Website</Label>
          <Input
            id="website"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            placeholder="https://yourwebsite.com"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="github">GitHub URL</Label>
            <Input
              id="github"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              placeholder="https://github.com/username"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="twitter">Twitter URL</Label>
            <Input
              id="twitter"
              value={twitterUrl}
              onChange={(e) => setTwitterUrl(e.target.value)}
              placeholder="https://twitter.com/username"
            />
          </div>
        </div>

        <div className="space-y-4">
          <Label>Theme Color</Label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <RadioGroup value={colorScheme} onValueChange={setColorScheme} className="flex flex-col space-y-1">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="default" id="default" />
                <Label htmlFor="default" className="cursor-pointer">
                  Default (Blue)
                </Label>
              </div>
              <ThemePreview colorScheme="default" />

              <div className="flex items-center space-x-2 mt-4">
                <RadioGroupItem value="purple" id="purple" />
                <Label htmlFor="purple" className="cursor-pointer">
                  Purple
                </Label>
              </div>
              <ThemePreview colorScheme="purple" />

              <div className="flex items-center space-x-2 mt-4">
                <RadioGroupItem value="green" id="green" />
                <Label htmlFor="green" className="cursor-pointer">
                  Green
                </Label>
              </div>
              <ThemePreview colorScheme="green" />

              <div className="flex items-center space-x-2 mt-4">
                <RadioGroupItem value="orange" id="orange" />
                <Label htmlFor="orange" className="cursor-pointer">
                  Orange
                </Label>
              </div>
              <ThemePreview colorScheme="orange" />
            </RadioGroup>
          </div>
        </div>

        <Button type="submit" disabled={saving} className="flex items-center gap-2">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {saving ? "Saving..." : "Save Profile"}
        </Button>
      </form>
    </div>
  )
}
