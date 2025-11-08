"use client"

import { signIn } from "next-auth/react"
import { useSearchParams, useRouter } from "next/navigation"
import { Suspense } from "react"

// Separate component that uses useSearchParams
function LoginForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const callbackUrl = searchParams.get("callbackUrl") || "/"

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
        {/* Logo and Title */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">LawFI</h1>
          <p className="text-gray-600">Your AI Legal Consultant</p>
        </div>

        {/* Legal Disclaimer */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-xs text-yellow-800">
            <strong>Important:</strong> This platform provides general legal information only.
            It is not a substitute for professional legal advice. Consult a licensed attorney
            for your specific legal needs.
          </p>
        </div>

        {/* Sign In Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-center text-gray-800">
            Sign in to continue
          </h2>

          {/* Google Sign-In Button */}
          <button
            onClick={() => signIn("google", { callbackUrl })}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-white hover:bg-gray-50 transition-colors duration-200"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span className="text-gray-700 font-medium">Continue with Google</span>
          </button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">OR</span>
            </div>
          </div>

          {/* Guest Login Button */}
          <button
            onClick={() => router.push("/chat")}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-gray-300 rounded-lg shadow-sm bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="text-gray-700 font-medium">Continue as Guest</span>
          </button>

          {/* Guest Notice */}
          <p className="text-xs text-gray-500 text-center">
            <strong>Guest mode:</strong> Your chat history will not be saved
          </p>

          {/* Terms */}
          <p className="text-xs text-gray-500 text-center">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  )
}

// Main page component with Suspense boundary
export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}
