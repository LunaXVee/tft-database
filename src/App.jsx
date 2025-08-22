import { BrowserRouter, Routes, Route } from "react-router-dom"
import HomePage from "./pages/HomePage"
import AddMemberPage from "./pages/AddMemberPage"
import MembersPage from "./pages/MembersPage"
import ExportPage from "./pages/ExportPage"
import MemberDetailsPage from "./pages/MemberDetailsPage"  // Add this import
import EditMemberPage from "./pages/EditMemberPage"
import DashboardPage from "./pages/DashboardPage"
import ClusterLeadersPage from "./pages/ClusterLeadersPage"
import ClusterLeaderDetailsPage from "./pages/ClusterLeaderDetailsPage"
import AddClusterLeaderPage from "./pages/AddClusterLeaderPage"
import EditClusterLeaderPage from "./pages/EditClusterLeaderPage"
import ClusterMembersPage from "./pages/ClusterMembersPage"
import CalendarPage from "./pages/CalendarPage" // Add calendar import
import AnalyticsPage from "./pages/AnalyticsPage"


function App() {
  return (
    <BrowserRouter>
     <Routes>
              {/* Dashboard Routes */}

          <Route path="/" element={<DashboardPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />

                  {/* Calendar Routes */}
          <Route path="/dashboard/calendar" element={<CalendarPage />} />

        {/* Cluster Leader Routes */}

          <Route path="/dashboard/cluster-leaders" element={<ClusterLeadersPage />} />
          <Route path="/dashboard/add-cluster-leader" element={<AddClusterLeaderPage />} />
          <Route path="/dashboard/cluster-leader/:id" element={<ClusterLeaderDetailsPage />} />
          <Route path="/dashboard/cluster-leader/:id/edit" element={<EditClusterLeaderPage />} />

        {/* Cluster Members Routes */}

          <Route path="/dashboard/cluster/:clusterName/members" element={<ClusterMembersPage />} />

        {/* Member Routes */}

          <Route path="/dashboard/members" element={<MembersPage />} />
          <Route path="/dashboard/add-member" element={<AddMemberPage />} />
          <Route path="/dashboard/export" element={<ExportPage />} />

                  {/* Legacy Routes (for backward compatibility) */}

          <Route path="/add-member" element={<AddMemberPage />} />
          <Route path="/members" element={<MembersPage />} />
          <Route path="/export" element={<ExportPage />} />
          <Route path="/member/:id" element={<MemberDetailsPage />} />
          <Route path="/member/:id/edit" element={<EditMemberPage />} />

          <Route path="/dashboard/analytics" element={<AnalyticsPage />} />

</Routes>

    </BrowserRouter>
  )
}

export default App