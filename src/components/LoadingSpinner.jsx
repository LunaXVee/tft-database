// src/components/LoadingSpinner.jsx
export default function LoadingSpinner({ message = "Loading..." }) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          {/* TFT Logo Spinner */}
          <div className="mx-auto h-16 w-16 bg-green-600 rounded-full flex items-center justify-center mb-4 animate-pulse">
            <svg className="h-8 w-8 text-white animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
          
          {/* Loading Text */}
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            TFT Database
          </h2>
          <p className="text-gray-600 animate-pulse">
            {message}
          </p>
          
          {/* Progress Bar */}
          <div className="mt-4 w-48 mx-auto">
            <div className="bg-gray-200 rounded-full h-2">
              <div className="bg-green-600 h-2 rounded-full animate-pulse" style={{width: '60%'}}></div>
            </div>
          </div>
        </div>
      </div>
    )
  }