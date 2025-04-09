import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Lista dei percorsi pubblici che non richiedono autenticazione
const publicPaths = ["/login", "/auth/callback"]

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  // Check if the path is public
  const isPublicPath = publicPaths.some((path) => req.nextUrl.pathname.startsWith(path))

  if (isPublicPath) {
    return res
  }

  try {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    // If no session and not on a public path, redirect to login with the original URL as a parameter
    if (!session) {
      const redirectUrl = new URL("/login", req.url)
      redirectUrl.searchParams.set("redirectedFrom", req.nextUrl.pathname)
      return NextResponse.redirect(redirectUrl)
    }

    return res
  } catch (error) {
    console.error("Error in middleware:", error)
    const redirectUrl = new URL("/login", req.url)
    return NextResponse.redirect(redirectUrl)
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
}
