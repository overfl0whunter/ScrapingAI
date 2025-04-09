import { createClient, SupabaseClient } from "@supabase/supabase-js"

declare global {
  var supabaseClient: SupabaseClient | undefined
}

export function getSupabaseBrowserClient(): SupabaseClient {
  if (typeof window === "undefined") {
    throw new Error("getSupabaseBrowserClient should only be called in the browser")
  }

  if (global.supabaseClient) {
    return global.supabaseClient
  }

  global.supabaseClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: false,
        storageKey: 'v0-supabase-auth',
      },
      db: {
        schema: 'public'
      }
    }
  )

  return global.supabaseClient
}
