// src/components/ProtectedRoute.jsx
import { useAuth, useUser } from '@clerk/clerk-react'
import { Navigate } from 'react-router-dom'
import LoadingSpinner from './LoadingSpinner'

export default function ProtectedRoute({ children, requiredRole = null }) {
  const { isSignedIn, isLoaded: authLoaded } = useAuth()
  const { user, isLoaded: userLoaded } = useUser()

  // Show loading while auth is loading
  if (!authLoaded || !userLoaded) {
    return <LoadingSpinner />
  }

  // Redirect to sign-in if not authenticated
  if (!isSignedIn) {
    return <Navigate to="/sign-in" replace />
  }

  // Get user role from metadata
  const userRole = user?.publicMetadata?.role

  // Check if user has portal access (admin or cluster_leader)
  const allowedRoles = ['admin', 'cluster_leader']
  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/no-portal-access" replace />
  }

  // Check specific role requirement if provided
  if (requiredRole) {
    const roleHierarchy = { admin: 2, cluster_leader: 1 }
    const userLevel = roleHierarchy[userRole] || 0
    const requiredLevel = roleHierarchy[requiredRole] || 0
    
    if (userLevel < requiredLevel) {
      return <Navigate to="/unauthorized" replace />
    }
  }

  // If all checks pass, render the protected content
  return children
}