// src/pages/AccessDeniedPage.jsx
import { Button } from '@/components/ui/button'
import { UserButton, useUser } from '@clerk/clerk-react'
import { useNavigate } from 'react-router-dom'

export default function AccessDeniedPage() {
  const navigate = useNavigate()
  const { user } = useUser()
  
  const userRole = user?.publicMetadata?.role
  const allowedRoles = ['admin', 'cluster_leader']
  const hasPortalAccess = allowedRoles.includes(userRole)
  
  const getRedirectPath = () => {
    switch (userRole) {
      case 'admin':
        return '/dashboard'
      case 'cluster_leader':
        return '/cluster-members'
      default:
        return '/'
    }
  }
  
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6 text-center">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
          hasPortalAccess ? 'bg-red-100' : 'bg-blue-100'
        }`}>
          <svg className={`w-8 h-8 ${hasPortalAccess ? 'text-red-600' : 'text-blue-600'}`} 
               fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {hasPortalAccess ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            )}
          </svg>
        </div>
        
        {hasPortalAccess ? (
          // For valid users accessing restricted content
          <>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Restricted</h1>
            <p className="text-gray-600 mb-2">
              You don't have permission to access this page.
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Your role: <strong className="capitalize">{userRole}</strong>
            </p>
            
            <div className="space-y-3">
              <Button 
                onClick={() => navigate(getRedirectPath())}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                Go to My Dashboard
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate(-1)}
                className="w-full"
              >
                Go Back
              </Button>
            </div>
            
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700">
                Need different access? Contact your TFT administrator.
              </p>
            </div>
          </>
        ) : (
          // For users without portal access (regular members)
          <>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Portal Access Information</h1>
            <p className="text-gray-600 mb-6">
              The TFT Database portal is for administrators and cluster leaders only. 
              Member information is managed by cluster leaders.
            </p>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-green-800 mb-2">Need to update your information?</h3>
              <p className="text-green-700 text-sm">
                Contact your cluster leader directly for:
              </p>
              <ul className="text-green-700 text-sm mt-2 text-left list-disc list-inside">
                <li>Contact information updates</li>
                <li>Farm details and size</li>
                <li>Crop information</li>
                <li>Contract status</li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-center">
                <UserButton afterSignOutUrl="/" />
              </div>
              <p className="text-xs text-gray-500">
                Sign out to return to the main site
              </p>
            </div>
          </>
        )}
        
        <div className="mt-6 text-xs text-gray-500">
          TFT Database System
        </div>
      </div>
    </div>
  )
}