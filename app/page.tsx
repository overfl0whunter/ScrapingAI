import { redirect } from "next/navigation"
import { createServerComponentClient } from './supabase-server'
import Dashboard from "@/components/dashboard"

export default async function Home() {
  const supabase = await createServerComponentClient()

  // Check if user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  // Fetch chat sessions
  const { data: sessions } = await supabase.from("chat_sessions").select("*").order("updated_at", { ascending: false })

  return (
    <main className="container mx-auto px-4 py-8">
      <Dashboard initialSessions={sessions || []} userId={session.user.id} />
    </main>
  )
}
