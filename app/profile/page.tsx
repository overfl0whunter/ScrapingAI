import { redirect } from "next/navigation"
import { getSupabaseServerClient } from "@/lib/supabase/server"

export default async function ProfileRedirectPage() {
  const supabase = getSupabaseServerClient()

  // Check if user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  // Fetch the user's profile to get their username
  const { data: profile } = await supabase
    .from("user_profiles")
    .select("username")
    .eq("user_id", session.user.id)
    .single()

  if (profile?.username) {
    // Redirect to the user's profile page
    redirect(`/profile/${profile.username}`)
  } else {
    // If no username is set, redirect to settings to complete profile
    redirect("/settings/profile")
  }
}
