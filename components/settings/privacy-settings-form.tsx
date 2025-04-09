"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { Loader2, Save } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { User } from "@supabase/supabase-js"

interface PrivacySettingsFormProps {
  user: User
  privacySettings: {
    profile_visibility: string
    activity_visibility: string
    searchable: boolean
    user_id: string
  }
}

export default function PrivacySettingsForm({ user, privacySettings }: PrivacySettingsFormProps) {
  const [profileVisibility, setProfileVisibility] = useState(privacySettings?.profile_visibility || "public")
  const [activityVisibility, setActivityVisibility] = useState(privacySettings?.activity_visibility || "followers")
  const [searchable, setSearchable] = useState(privacySettings?.searchable !== false)
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()
  const supabase = getSupabaseBrowserClient()

  const handleSavePrivacy = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const { error } = await supabase.from("user_privacy_settings").upsert({
        user_id: user.id,
        profile_visibility: profileVisibility,
        activity_visibility: activityVisibility,
        searchable,
        updated_at: new Date().toISOString(),
      })

      if (error) throw error

      toast({
        title: "Privacy settings saved",
        description: "Your privacy settings have been updated successfully.",
      })
    } catch (error: any) {
      console.error("Error saving privacy settings:", error)
      toast({
        title: "Error saving privacy settings",
        description: error.message || "Failed to save privacy settings",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Privacy Settings</h2>

      <form onSubmit={handleSavePrivacy} className="space-y-8">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Profile Visibility</h3>
          <p className="text-gray-500 text-sm">Control who can see your profile information</p>

          <RadioGroup value={profileVisibility} onValueChange={setProfileVisibility} className="space-y-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="public" id="profile-public" />
              <Label htmlFor="profile-public">Public - Anyone can view your profile</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="followers" id="profile-followers" />
              <Label htmlFor="profile-followers">
                Followers Only - Only people who follow you can view your profile
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="private" id="profile-private" />
              <Label htmlFor="profile-private">Private - Only you can view your profile</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Activity Visibility</h3>
          <p className="text-gray-500 text-sm">Control who can see your activity and posts</p>

          <RadioGroup value={activityVisibility} onValueChange={setActivityVisibility} className="space-y-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="public" id="activity-public" />
              <Label htmlFor="activity-public">Public - Anyone can view your activity</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="followers" id="activity-followers" />
              <Label htmlFor="activity-followers">
                Followers Only - Only people who follow you can view your activity
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="private" id="activity-private" />
              <Label htmlFor="activity-private">Private - Only you can view your activity</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Search Visibility</h3>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="searchable" className="block">
                Allow others to find you in search
              </Label>
              <p className="text-gray-500 text-sm">If disabled, your profile won't appear in search results</p>
            </div>
            <Switch id="searchable" checked={searchable} onCheckedChange={setSearchable} />
          </div>
        </div>

        <Button type="submit" disabled={saving} className="flex items-center gap-2">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {saving ? "Saving..." : "Save Privacy Settings"}
        </Button>
      </form>
    </div>
  )
}
