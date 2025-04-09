"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { MainNav } from "@/components/main-nav"
import { User, Settings, Key, CreditCard, ArrowLeft } from "lucide-react"

interface SettingsLayoutProps {
  children: React.ReactNode
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  const pathname = usePathname()

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4">
          <MainNav />
        </div>
      </header>
      <div className="container grid flex-1 gap-12 md:grid-cols-[200px_1fr] lg:grid-cols-[250px_1fr] py-8">
        <aside className="hidden w-[200px] flex-col md:flex lg:w-[250px]">
          <div className="mb-4">
            <Link href="/" className="flex items-center text-sm font-medium text-muted-foreground">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </div>
          <div className="space-y-1">
            <h2 className="px-2 text-lg font-semibold tracking-tight">Settings</h2>
            <nav className="flex flex-col space-y-1">
              <Link href="/settings/profile" passHref>
                <Button
                  variant={pathname === "/settings/profile" ? "secondary" : "ghost"}
                  className="w-full justify-start"
                >
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Button>
              </Link>
              <Link href="/settings/account" passHref>
                <Button
                  variant={pathname === "/settings/account" ? "secondary" : "ghost"}
                  className="w-full justify-start"
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Account
                </Button>
              </Link>
              <Link href="/settings/api-keys" passHref>
                <Button
                  variant={pathname === "/settings/api-keys" ? "secondary" : "ghost"}
                  className="w-full justify-start"
                >
                  <Key className="mr-2 h-4 w-4" />
                  API Keys
                </Button>
              </Link>
              <Link href="/settings/billing" passHref>
                <Button
                  variant={pathname === "/settings/billing" ? "secondary" : "ghost"}
                  className="w-full justify-start"
                >
                  <CreditCard className="mr-2 h-4 w-4" />
                  Billing
                </Button>
              </Link>
            </nav>
          </div>
        </aside>
        <main className="flex w-full flex-1 flex-col overflow-hidden">{children}</main>
      </div>
    </div>
  )
}
