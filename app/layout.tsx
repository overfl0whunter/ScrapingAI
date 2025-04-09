'use client'

import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import dynamic from 'next/dynamic'

const inter = Inter({ subsets: ["latin"] })

// Importa il AuthProvider dinamicamente per evitare SSR
const AuthProvider = dynamic(
  () => import("@/components/auth/auth-provider").then(mod => mod.AuthProvider),
  { ssr: false }
)

export const metadata: Metadata = {
  title: "ScrapingAI - AI-Powered Code Assistant",
  description: "Generate, analyze, and optimize code with AI assistance",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}


import './globals.css'