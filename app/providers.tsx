"use client"

import { SessionProvider } from "next-auth/react"

// This component wraps the app with NextAuth session provider
// It must be a client component because SessionProvider uses React context
export function Providers({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>
}
