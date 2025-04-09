"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { UserPlus, UserMinus, Settings, Calendar, MapPin, LinkIcon, Twitter, Github } from "lucide-react"
import ProfileHeader from "./profile-header"
import ActivityFeed from "./activity-feed"
import { formatDistanceToNow } from "date-fns"

interface UserProfileViewProps {
  profile: any
  isOwnProfile: boolean
  currentUserId: string
  themePreferences: {
    color_scheme: string
    dark_mode: boolean
  }
  userActivity: any[]
}

export default function UserProfileView({
  profile,
  isOwnProfile,
  currentUserId,
  themePreferences,
  userActivity,
}: UserProfileViewProps) {
  const [isFollowing, setIsFollowing] = useState(profile.is_following || false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = getSupabaseBrowserClient()

  const handleFollow = async () => {
    setIsLoading(true)

    try {
      if (isFollowing) {
        // Unfollow
        const { error } = await supabase
          .from("user_follows")
          .delete()
          .eq("follower_id", currentUserId)
          .eq("following_id", profile.user_id)

        if (error) throw error
        setIsFollowing(false)
      } else {
        // Follow
        const { error } = await supabase.from("user_follows").insert({
          follower_id: currentUserId,
          following_id: profile.user_id,
        })

        if (error) throw error
        setIsFollowing(true)
      }
    } catch (error) {
      console.error("Error following/unfollowing user:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={`min-h-screen ${getColorSchemeClass(themePreferences.color_scheme)}`}>
      <ProfileHeader
        bannerUrl={profile.banner_url}
        profileUrl={profile.avatar_url}
        isOwnProfile={isOwnProfile}
        username={profile.username}
        fullName={`${profile.first_name || ""} ${profile.last_name || ""}`.trim()}
      />

      <div className="container mx-auto px-4 -mt-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left sidebar - Profile info */}
          <div className="md:col-span-1">
            <Card className="p-6">
              <div className="flex flex-col items-center md:items-start">
                <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
                  <AvatarImage src={profile.avatar_url} alt={profile.username} />
                  <AvatarFallback className="text-2xl">
                    {profile.first_name?.[0]}
                    {profile.last_name?.[0]}
                  </AvatarFallback>
                </Avatar>

                <h1 className="text-2xl font-bold mt-4">
                  {profile.first_name} {profile.last_name}
                </h1>
                <p className="text-gray-500 dark:text-gray-400">@{profile.username}</p>

                {isOwnProfile ? (
                  <Button variant="outline" className="mt-4 w-full" onClick={() => router.push("/settings/profile")}>
                    <Settings className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                ) : (
                  <Button
                    variant={isFollowing ? "outline" : "default"}
                    className="mt-4 w-full"
                    onClick={handleFollow}
                    disabled={isLoading}
                  >
                    {isFollowing ? (
                      <>
                        <UserMinus className="h-4 w-4 mr-2" />
                        Unfollow
                      </>
                    ) : (
                      <>
                        <UserPlus className="h-4 w-4 mr-2" />
                        Follow
                      </>
                    )}
                  </Button>
                )}
              </div>

              {profile.bio && (
                <div className="mt-6">
                  <h3 className="font-medium text-lg mb-2">Bio</h3>
                  <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap">{profile.bio}</p>
                </div>
              )}

              <div className="mt-6 space-y-3">
                {profile.location && (
                  <div className="flex items-center text-gray-600 dark:text-gray-300">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>{profile.location}</span>
                  </div>
                )}

                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>Joined {formatDistanceToNow(new Date(profile.created_at), { addSuffix: true })}</span>
                </div>

                {profile.website && (
                  <div className="flex items-center text-gray-600 dark:text-gray-300">
                    <LinkIcon className="h-4 w-4 mr-2" />
                    <a
                      href={profile.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      {profile.website.replace(/^https?:\/\//, "")}
                    </a>
                  </div>
                )}

                {profile.twitter_url && (
                  <div className="flex items-center text-gray-600 dark:text-gray-300">
                    <Twitter className="h-4 w-4 mr-2" />
                    <a
                      href={profile.twitter_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      {profile.twitter_url.split("/").pop()}
                    </a>
                  </div>
                )}

                {profile.github_url && (
                  <div className="flex items-center text-gray-600 dark:text-gray-300">
                    <Github className="h-4 w-4 mr-2" />
                    <a
                      href={profile.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      {profile.github_url.split("/").pop()}
                    </a>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Main content area */}
          <div className="md:col-span-2">
            <Tabs defaultValue="activity" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="activity">Activity</TabsTrigger>
                <TabsTrigger value="projects">Projects</TabsTrigger>
                <TabsTrigger value="followers">Followers</TabsTrigger>
              </TabsList>

              <TabsContent value="activity">
                <ActivityFeed activities={userActivity} />
              </TabsContent>

              <TabsContent value="projects">
                <Card className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Projects</h3>
                  {/* Projects content would go here */}
                  <p className="text-gray-500">No projects to display yet.</p>
                </Card>
              </TabsContent>

              <TabsContent value="followers">
                <Card className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Followers</h3>
                  {/* Followers content would go here */}
                  <p className="text-gray-500">No followers to display yet.</p>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}

// Helper function to get the CSS class for the selected color scheme
function getColorSchemeClass(colorScheme: string): string {
  switch (colorScheme) {
    case "purple":
      return "bg-purple-50 dark:bg-purple-950"
    case "green":
      return "bg-green-50 dark:bg-green-950"
    case "orange":
      return "bg-orange-50 dark:bg-orange-950"
    default: // Default blue
      return "bg-blue-50 dark:bg-blue-950"
  }
}
