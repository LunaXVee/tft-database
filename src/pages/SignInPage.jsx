// src/pages/SignInPage.jsx
import { SignIn } from '@clerk/clerk-react'

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* TFT Logo and Header */}

        <div className="text-center mb-8">
        <div className="mx-auto h-16 w-16 bg-green-600 rounded-full flex items-center justify-center mb-4 p-3">
  <img src="/leaf.svg" alt="TFT Logo" className="h-full w-full" />
</div>
          
          <h2 className="text-3xl font-bold text-gray-900">
            TFT Database
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            The Farmers Talk Management Portal
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
              },
              layout: {
                showOptionalFields: true,
                termsPageUrl: undefined,
                privacyPageUrl: undefined
              }
            }}
            signUpUrl="/sign-up"
            forceRedirectUrl="/dashboard"
            fallbackRedirectUrl="/dashboard"
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