// src/pages/SignUpPage.jsx
import { SignUp } from '@clerk/clerk-react'

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* TFT Logo and Header */}
        <div className="text-center mb-8">
          <div className="mx-auto h-16 w-16 bg-green-600 rounded-full flex items-center justify-center mb-4">
            <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            Create TFT Account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Account Registration for TFT Staff
          </p>
        </div>

        {/* Warning Notice */}
        <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex">
            <svg className="h-5 w-5 text-yellow-400 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <div>
              <h3 className="text-sm font-medium text-yellow-800">
                Authorized Personnel Only
              </h3>
              <p className="text-xs text-yellow-700 mt-1">
                Account creation is restricted to TFT administrators and authorized cluster leaders only.
              </p>
            </div>
          </div>
        </div>

        {/* Clerk SignUp Component */}
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <SignUp 
            routing="path"
            path="/sign-up"
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
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-green-800 mb-2">After Registration</h3>
            <p className="text-xs text-green-700">
              Contact your administrator to assign your role and cluster permissions
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}