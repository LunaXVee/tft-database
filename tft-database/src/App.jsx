import { BrowserRouter, Routes, Route } from "react-router-dom"
import HomePage from "./pages/HomePage"
import AddMemberPage from "./pages/AddMemberPage"
import MembersPage from "./pages/MembersPage"
import ExportPage from "./pages/ExportPage"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/add-member" element={<AddMemberPage />} />
        <Route path="/members" element={<MembersPage />} />
        <Route path="/export" element={<ExportPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App