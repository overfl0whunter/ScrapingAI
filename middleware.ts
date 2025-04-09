import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function middleware(request: NextRequest) {
  // Create a Supabase client configured to use cookies
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.SUPABASE_SERVICE_ROLE_KEY as string,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
      },
    },
  )

  // Refresh session if expired
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // If user is not signed in and the current path is not /login,
  // redirect the user to /login
  if (!session && !request.nextUrl.pathname.startsWith("/login")) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = "/login"
    return NextResponse.redirect(redirectUrl)
  }

  // If user is signed in and the current path is /login,
  // redirect the user to /
  if (session && request.nextUrl.pathname.startsWith("/login")) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = "/"
    return NextResponse.redirect(redirectUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
