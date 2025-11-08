import NextAuth from "next-auth"
import { authOptions } from "@/lib/auth"

// This creates the NextAuth API route handler
// It handles all authentication requests like /api/auth/signin, /api/auth/signout, etc.
const handler = NextAuth(authOptions)

// Export for both GET and POST requests
export { handler as GET, handler as POST }
