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



function App() {
  return (
    <BrowserRouter>
     <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/dashboard/cluster-leaders" element={<ClusterLeadersPage />} />
          <Route path="/dashboard/add-cluster-leader" element={<AddClusterLeaderPage />} />
          <Route path="/dashboard/cluster-leader/:id" element={<ClusterLeaderDetailsPage />} />
          <Route path="/dashboard/cluster-leader/:id/edit" element={<EditClusterLeaderPage />} />
          
          <Route path="/dashboard/members" element={<MembersPage />} />
          <Route path="/dashboard/add-member" element={<AddMemberPage />} />
          <Route path="/dashboard/export" element={<ExportPage />} />
          <Route path="/add-member" element={<AddMemberPage />} />
          <Route path="/members" element={<MembersPage />} />
          <Route path="/export" element={<ExportPage />} />
          <Route path="/member/:id" element={<MemberDetailsPage />} />
          <Route path="/member/:id/edit" element={<EditMemberPage />} />
</Routes>

    </BrowserRouter>
  )
}

export default App