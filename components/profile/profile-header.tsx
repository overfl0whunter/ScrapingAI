"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { Camera, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ProfileHeaderProps {
  bannerUrl: string | null
  profileUrl: string | null
  isOwnProfile: boolean
  username: string
  fullName: string
}

export default function ProfileHeader({ bannerUrl, profileUrl, isOwnProfile, username, fullName }: ProfileHeaderProps) {
  const [uploading, setUploading] = useState<"banner" | "profile" | null>(null)
  const { toast } = useToast()
  const supabase = getSupabaseBrowserClient()

  const defaultBannerUrl = "/placeholder.svg?height=300&width=1200"

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, type: "banner" | "profile") => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploading(type)

    try {
      // Upload file to Supabase storage
      const fileExt = file.name.split(".").pop()
      const fileName = `${type}_${Date.now()}.${fileExt}`
      const filePath = `${type === "banner" ? "banners" : "avatars"}/${fileName}`

      const { error: uploadError } = await supabase.storage.from("profiles").upload(filePath, file)

      if (uploadError) throw uploadError

      // Get public URL
      const { data: urlData } = supabase.storage.from("profiles").getPublicUrl(filePath)

      // Update user profile
      const { error: updateError } = await supabase
        .from("user_profiles")
        .update({
          [type === "banner" ? "banner_url" : "avatar_url"]: urlData.publicUrl,
        })
        .eq("username", username)

      if (updateError) throw updateError

      toast({
        title: "Upload successful",
        description: `Your ${type} image has been updated.`,
      })

      // Force refresh to show the new image
      window.location.reload()
    } catch (error) {
      console.error(`Error uploading ${type}:`, error)
      toast({
        title: "Upload failed",
        description: `There was an error uploading your ${type} image.`,
        variant: "destructive",
      })
    } finally {
      setUploading(null)
    }
  }

  return (
    <div className="relative">
      {/* Banner Image */}
      <div
        className="w-full h-64 bg-cover bg-center relative"
        style={{ backgroundImage: `url(${bannerUrl || defaultBannerUrl})` }}
      >
        {isOwnProfile && (
          <div className="absolute bottom-4 right-4">
            <label htmlFor="banner-upload">
              <Button variant="secondary" size="sm" className="cursor-pointer" disabled={!!uploading}>
                {uploading === "banner" ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Camera className="h-4 w-4 mr-2" />
                    Change Banner
                  </>
                )}
              </Button>
            </label>
            <input
              id="banner-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFileUpload(e, "banner")}
              disabled={!!uploading}
            />
          </div>
        )}
      </div>

      {/* Profile Picture Upload Button (only shown for own profile) */}
      {isOwnProfile && (
        <div className="absolute left-8 bottom-0 transform translate-y-1/2">
          <label htmlFor="profile-upload" className="cursor-pointer">
            <div className="relative">
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 hover:opacity-100 transition-opacity">
                <Camera className="h-6 w-6 text-white" />
              </div>
            </div>
          </label>
          <input
            id="profile-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFileUpload(e, "profile")}
            disabled={!!uploading}
          />
        </div>
      )}
    </div>
  )
}
