"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"

export default function AuthCallbackPage() {
  const router = useRouter()
  const supabase = getSupabaseBrowserClient()

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error("Error getting session:", error)
          router.push("/login")
          return
        }

        if (session) {
          router.push("/")
        } else {
          router.push("/login")
        }
      } catch (error) {
        console.error("Error in auth callback:", error)
        router.push("/login")
      }
    }

    handleCallback()
  }, [router, supabase])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Processing authentication...</h1>
        <p className="text-gray-600">Please wait while we complete your login.</p>
      </div>
    </div>
  )
} 