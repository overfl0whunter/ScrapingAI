"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Code2, Users, User } from "lucide-react"

export function MainNav() {
  const pathname = usePathname()

  return (
    <div className="mr-4 flex">
      <Link href="/" className="mr-6 flex items-center space-x-2">
        <Code2 className="h-6 w-6" />
        <span className="hidden font-bold sm:inline-block">AI Code Assistant</span>
      </Link>
      <nav className="flex items-center space-x-2">
        <Link href="/" passHref>
          <Button
            variant="ghost"
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              pathname === "/" ? "text-foreground" : "text-muted-foreground",
            )}
          >
            Dashboard
          </Button>
        </Link>
        <Link href="/discover" passHref>
          <Button
            variant="ghost"
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              pathname === "/discover" ? "text-foreground" : "text-muted-foreground",
            )}
          >
            <Users className="mr-2 h-4 w-4" />
            Discover
          </Button>
        </Link>
        <Link href="/profile" passHref>
          <Button
            variant="ghost"
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              pathname === "/profile" ? "text-foreground" : "text-muted-foreground",
            )}
          >
            <User className="mr-2 h-4 w-4" />
            Profile
          </Button>
        </Link>
      </nav>
    </div>
  )
}
