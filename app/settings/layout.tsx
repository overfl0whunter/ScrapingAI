import type React from "react"
import { redirect } from "next/navigation"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import SettingsLayout from "@/components/settings/settings-layout"

export default async function SettingsRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = getSupabaseServerClient()

  // Check if user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  return <SettingsLayout>{children}</SettingsLayout>
}
