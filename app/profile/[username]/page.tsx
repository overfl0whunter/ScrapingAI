import { notFound, redirect } from "next/navigation"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import UserProfileView from "@/components/profile/user-profile-view"

export default async function UserProfilePage({ params }: { params: { username: string } }) {
  const supabase = getSupabaseServerClient()
  const { username } = params

  // Check if user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  // Fetch the profile of the requested username
  const { data: profile, error } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("username", username)
    .single()

  if (error || !profile) {
    notFound()
  }

  // Check if this is the current user's profile
  const isOwnProfile = profile.user_id === session.user.id

  // Fetch user's theme preferences
  const { data: themePrefs } = await supabase
    .from("user_theme_preferences")
    .select("*")
    .eq("user_id", profile.user_id)
    .single()

  // Fetch user's posts/activity
  const { data: userActivity } = await supabase
    .from("user_activity")
    .select("*")
    .eq("user_id", profile.user_id)
    .order("created_at", { ascending: false })
    .limit(5)

  return (
    <UserProfileView
      profile={profile}
      isOwnProfile={isOwnProfile}
      currentUserId={session.user.id}
      themePreferences={themePrefs || { color_scheme: "default", dark_mode: false }}
      userActivity={userActivity || []}
    />
  )
}
