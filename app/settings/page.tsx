import { redirect } from "next/navigation"

export default function SettingsIndexPage() {
  // Redirect to profile settings by default
  redirect("/settings/profile")
}
