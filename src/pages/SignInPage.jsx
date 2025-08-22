// src/pages/SignInPage.jsx
import { SignIn } from '@clerk/clerk-react'

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* TFT Logo and Header */}
        <div className="text-center mb-8">
          <div className="mx-auto h-16 w-16 bg-green-600 rounded-full flex items-center justify-center mb-4">
            <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            TFT Database
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Tobacco Farmers Trust Management Portal
          </p>
          <p className="mt-1 text-xs text-gray-500">
            For Administrators and Cluster Leaders Only
          </p>
        </div>

        {/* Clerk SignIn Component */}
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <SignIn 
            routing="path"
            path="/sign-in"
            redirectUrl="/dashboard"
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "shadow-none border-0 bg-transparent",
                headerTitle: "text-2xl font-bold text-gray-900",
                headerSubtitle: "text-gray-600",
                socialButtonsBlockButton: "border border-gray-300 hover:bg-gray-50",
                formButtonPrimary: "bg-green-600 hover:bg-green-700 text-white",
                footerActionLink: "text-green-600 hover:text-green-700",
                identityPreviewText: "text-gray-700",
                formFieldInput: "border-gray-300 focus:border-green-500 focus:ring-green-500"
              }
            }}
          />
        </div>

        {/* Contact Information */}
        <div className="mt-8 text-center">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-blue-800 mb-2">Need Access?</h3>
            <p className="text-xs text-blue-700">
              Contact TFT Administration for account setup
            </p>
            <p className="text-xs text-blue-600 mt-1">
              📧 admin@tft.co.zw | ☎️ +263 4 XXX XXXX
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}