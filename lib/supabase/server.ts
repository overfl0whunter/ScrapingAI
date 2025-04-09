import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"
import type { SupabaseClient } from "@supabase/supabase-js"

export async function getSupabaseServerClient(): Promise<SupabaseClient> {
  const cookieStore = await cookies()
  
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: true,
      },
      global: {
        fetch: fetch,
        headers: {
          'x-application-name': 'scrapingai',
        }
      }
    }
  )
}
