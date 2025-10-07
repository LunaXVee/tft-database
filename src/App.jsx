// src/App.jsx - Complete with all pages
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { ClerkProvider } from '@clerk/clerk-react'

// Authentication Pages
import SignInPage from "./pages/SignInPage"
import SignUpPage from "./pages/SignUpPage"
import AccessDeniedPage from "./pages/AccessDeniedPage"  // Use the combined access denied page

// Protected Components
import ProtectedRoute from "./components/ProtectedRoute"
import DashboardLayout from "./components/DashboardLayout"

// All Page Components
import DashboardPage from "./pages/DashboardPage"
import MembersPage from "./pages/MembersPage"
import AnalyticsPage from "./pages/AnalyticsPage"
import CalendarPage from "./pages/CalendarPage"
import AddMemberPage from "./pages/AddMemberPage"
import MemberDetailsPage from "./pages/MemberDetailsPage"
import EditMemberPage from "./pages/EditMemberPage"
import ClusterLeadersPage from "./pages/ClusterLeadersPage"
import ClusterMembersPage from "./pages/ClusterMembersPage"
import AddClusterLeaderPage from "./pages/AddClusterLeaderPage"
import EditClusterLeaderPage from "./pages/EditClusterLeaderPage"
import ClusterLeaderDetailsPage from "./pages/ClusterLeaderDetailsPage"
import ExportPage from "./pages/ExportPage"
import AddSoilSamplePage from "./pages/AddSoilSamplePage"

// Get Clerk publishable key
const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!clerkPubKey) {
  throw new Error("Missing Clerk Publishable Key")
}

function App() {
  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      <BrowserRouter>
        <Routes>
          {/* Public Authentication Routes */}
          <Route path="/sign-in/*" element={<SignInPage />} />
          <Route path="/sign-up/*" element={<SignUpPage />} />
          <Route path="/access-denied" element={<AccessDeniedPage />} />
          <Route path="/unauthorized" element={<AccessDeniedPage />} />
          <Route path="/no-portal-access" element={<AccessDeniedPage />} />
          <Route path="/add-soil-sample" element={<AddSoilSamplePage />} />  {/* Add this */}


          {/* Protected Routes - All wrapped in DashboardLayout */}
          <Route path="/" element={
            <ProtectedRoute>
              <DashboardLayout>
                <DashboardPage />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <DashboardLayout>
                <DashboardPage />
              </DashboardLayout>
            </ProtectedRoute>
          } />

          {/* Members Management */}
          <Route path="/members" element={
            <ProtectedRoute>
              <DashboardLayout>
                <MembersPage />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/add-member" element={
            <ProtectedRoute>
              <DashboardLayout>
                <AddMemberPage />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/member/:id" element={
            <ProtectedRoute>
              <DashboardLayout>
                <MemberDetailsPage />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/member/:id/edit" element={
            <ProtectedRoute>
              <DashboardLayout>
                <EditMemberPage />
              </DashboardLayout>
            </ProtectedRoute>
          } />

          {/* Cluster Leaders Management (Admin Only) */}
          <Route path="/cluster-leaders" element={
            <ProtectedRoute requiredRole="admin">
              <DashboardLayout>
                <ClusterLeadersPage />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/add-cluster-leader" element={
            <ProtectedRoute requiredRole="admin">
              <DashboardLayout>
                <AddClusterLeaderPage />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/cluster-leader/:id" element={
            <ProtectedRoute requiredRole="admin">
              <DashboardLayout>
                <ClusterLeaderDetailsPage />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/cluster-leader/:id/edit" element={
            <ProtectedRoute requiredRole="admin">
              <DashboardLayout>
                <EditClusterLeaderPage />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          
          {/* Cluster Members (for cluster leaders) */}
          <Route path="/cluster-members" element={
            <ProtectedRoute>
              <DashboardLayout>
                <ClusterMembersPage />
              </DashboardLayout>
            </ProtectedRoute>
          } />

          {/* Analytics */}
          <Route path="/analytics" element={
            <ProtectedRoute>
              <DashboardLayout>
                <AnalyticsPage />
              </DashboardLayout>
            </ProtectedRoute>
          } />

          {/* Calendar */}
          <Route path="/calendar" element={
            <ProtectedRoute>
              <DashboardLayout>
                <CalendarPage />
              </DashboardLayout>
            </ProtectedRoute>
          } />

          {/* Export (Admin Only) */}
          <Route path="/export" element={
            <ProtectedRoute requiredRole="admin">
              <DashboardLayout>
                <ExportPage />
              </DashboardLayout>
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </ClerkProvider>
  )
}

export default App