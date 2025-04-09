import { redirect } from "next/navigation"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import PrivacySettingsForm from "@/components/settings/privacy-settings-form"

export default async function PrivacySettingsPage() {
  const supabase = getSupabaseServerClient()

  // Check if user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  // Fetch user's privacy settings
  const { data: privacySettings } = await supabase
    .from("user_privacy_settings")
    .select("*")
    .eq("user_id", session.user.id)
    .single()

  return (
    <main className="container mx-auto px-4 py-8">
      <PrivacySettingsForm 
        user={session.user} 
        privacySettings={privacySettings || {
          profile_visibility: "public",
          activity_visibility: "followers",
          searchable: true,
          user_id: session.user.id
        }} 
      />
    </main>
  )
}
