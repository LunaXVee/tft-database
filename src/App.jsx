import { BrowserRouter, Routes, Route } from "react-router-dom"
import HomePage from "./pages/HomePage"
import AddMemberPage from "./pages/AddMemberPage"
import MembersPage from "./pages/MembersPage"
import ExportPage from "./pages/ExportPage"
import MemberDetailsPage from "./pages/MemberDetailsPage"  // Add this import
import EditMemberPage from "./pages/EditMemberPage"
import DashboardPage from "./pages/DashboardPage"



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/dashboard/members" element={<MembersPage />} />
        <Route path="/dashboard/add-member" element={<AddMemberPage />} />
        <Route path="/dashboard/export" element={<ExportPage />} />

        <Route path="/add-member" element={<AddMemberPage />} />
        <Route path="/members" element={<MembersPage />} />
        <Route path="/export" element={<ExportPage />} />
        <Route path="/member/:id" element={<MemberDetailsPage />} />  {/* Add this route */}
        <Route path="/member/:id/edit" element={<EditMemberPage />} />


      </Routes>
    </BrowserRouter>
  )
}

export default App