import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from "./prisma"

// NextAuth configuration
// This sets up Google Sign-In and connects to our database
export const authOptions: NextAuthOptions = {
  // Use Prisma adapter to store user data in our database
  adapter: PrismaAdapter(prisma),

  // Configure authentication providers (just Google for now)
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  // Custom pages
  pages: {
    signIn: "/login", // Custom login page
  },

  // Callbacks allow us to control what happens during authentication
  callbacks: {
    // This runs when creating/updating a session
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id
      }
      return session
    },
  },

  // Session configuration
  session: {
    strategy: "database", // Store sessions in database
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  // Enable debug messages in development
  debug: process.env.NODE_ENV === "development",
}
