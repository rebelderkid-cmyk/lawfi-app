import NextAuth from "next-auth"

// Extend the built-in session types to include user ID
declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
    }
  }
}
