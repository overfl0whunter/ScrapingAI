import { redirect } from "next/navigation"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import UserDiscovery from "@/components/user-discovery"

export default async function DiscoverPage() {
  const supabase = getSupabaseServerClient()

  // Check if user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  // Fetch users to discover (excluding current user)
  const { data: users } = await supabase
    .from("user_profiles")
    .select("*")
    .neq("user_id", session.user.id)
    .order("username", { ascending: true })

  // Fetch users that the current user is following
  const { data: following } = await supabase
    .from("user_follows")
    .select("following_id")
    .eq("follower_id", session.user.id)

  // Create a set of following IDs for easy lookup
  const followingIds = new Set((following || []).map((f) => f.following_id))

  return (
    <main className="container mx-auto px-4 py-8">
      <UserDiscovery users={users || []} followingIds={followingIds} currentUserId={session.user.id} />
    </main>
  )
}
