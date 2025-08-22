import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { supabase } from "@/lib/supabase"

function MembersPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchTerm, setSearchTerm] = useState("")
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)

  // Check if we're in dashboard mode
  const isDashboardMode = location.pathname.startsWith('/dashboard')

  // Fetch members from database
  useEffect(() => {
    fetchMembers()
  }, [])

  const fetchMembers = async () => {
    try {
      console.log("📥 Fetching members from database...")
      
      const { data, error } = await supabase
        .from('members')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error("❌ Error fetching members:", error)
        return
      }

      console.log("✅ Members fetched successfully:", data)
      setMembers(data || [])
      
    } catch (err) {
      console.error("❌ Fetch error:", err)
    } finally {
      setLoading(false)
    }
  }

  // Delete member function
  const handleDeleteMember = async (memberId, memberName) => {
    const isConfirmed = window.confirm(
      `Are you sure you want to delete ${memberName}? This action cannot be undone.`
    )
    
    if (!isConfirmed) {
      return
    }
    
    try {
      console.log("🗑️ Deleting member:", memberId)
      
      const { error } = await supabase
        .from('members')
        .delete()
        .eq('id', memberId)
      
      if (error) {
        console.error("❌ Delete failed:", error)
        alert("Failed to delete member. Check console for details.")
        return
      }
      
      console.log("✅ Member deleted successfully!")
      alert("Member deleted successfully!")
      
      fetchMembers()
      
    } catch (err) {
      console.error("❌ Delete error:", err)
      alert("Delete error. Check console for details.")
    }
  }
  
  // Filter members based on search term
  const filteredMembers = members.filter(member =>
    member.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.province?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Loading component
  const LoadingState = () => (
    <div className="text-center py-12">
      <h2 className="text-2xl font-bold text-green-700">Loading members...</h2>
      <p className="text-gray-600 mt-2">Fetching member data from database...</p>
    </div>
  )

  // Members content component
  const MembersContent = () => (
    <div className="space-y-6">
      {/* Action Bar */}
      <div className="bg-white p-4 lg:p-6 rounded-lg shadow-md">
  <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0 gap-4">
    {/* Search */}
    <div className="flex-1 max-w-full lg:max-w-md">
      <Input
        placeholder="Search members..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full"
      />
    </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
      <Button 
        onClick={() => navigate(isDashboardMode ? '/dashboard/add-member' : '/add-member')}
        className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto"
      >
        <span className="lg:hidden">➕ Add Member</span>
        <span className="hidden lg:inline">➕ Add New Member</span>
      </Button>
      <Button 
        variant="outline"
        onClick={() => navigate(isDashboardMode ? '/dashboard/export' : '/export')}
        className="border-blue-500 text-blue-600 hover:bg-blue-50 w-full sm:w-auto"
      >
        📄 Export Data
      </Button>
          </div>
        </div>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-200">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-800">{members.length}</div>
            <div className="text-sm text-gray-600">Total Members</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {members.filter(m => m.contract_status === 'Active').length}
            </div>
            <div className="text-sm text-gray-600">Active Contracts</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{filteredMembers.length}</div>
            <div className="text-sm text-gray-600">Filtered Results</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {new Set(members.map(m => m.province)).size}
            </div>
            <div className="text-sm text-gray-600">Provinces</div>
          </div>
        </div>
      </div>

      {/* Members Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 lg:p-6 border-b border-gray-200">
          <h3 className="text-base lg:text-lg font-semibold text-gray-800">Member Directory</h3>
          <p className="text-gray-600 mt-1 text-sm lg:text-base">Manage and view all registered farmers</p>
        </div>
        
        <div className="overflow-x-auto min-w-full">
          <Table className="min-w-[800px]"> {/* Ensure minimum width for mobile scroll */}
            <TableHeader>
            <TableRow className="bg-gray-100 border-b-2 border-gray-200">
            <TableHead className="font-semibold">Member Details</TableHead>
                <TableHead className="font-semibold">Location</TableHead>
                <TableHead className="font-semibold">Farm Info</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMembers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12">
                    <div className="text-gray-500">
                      {searchTerm ? (
                        <div>
                          <div className="text-lg mb-2">🔍 No matches found</div>
                          <div>No members found matching "{searchTerm}"</div>
                          <Button 
                            variant="outline" 
                            onClick={() => setSearchTerm("")}
                            className="mt-3"
                          >
                            Clear Search
                          </Button>
                        </div>
                      ) : (
                        <div>
                          <div className="text-lg mb-2">📋 No members yet</div>
                          <div>Start by adding your first farmer</div>
                          <Button 
                            onClick={() => navigate(isDashboardMode ? '/dashboard/add-member' : '/add-member')}
                            className="mt-3"
                          >
                            Add First Member
                          </Button>
                        </div>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredMembers.map((member) => (
                  <TableRow key={member.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div className="space-y-1">
                        <button 
                          onClick={() => navigate(`/member/${member.id}`)}
                          className="font-medium text-green-600 hover:text-green-800 hover:underline text-left"
                        >
                          {member.first_name} {member.last_name}
                        </button>
                        <div className="text-sm text-gray-500">
                          📱 {member.mobile_phone_1}
                        </div>
                        <div className="text-sm text-gray-500">
                          {member.email_address ? `📧 ${member.email_address}` : '📧 No email'}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium capitalize">{member.province}</div>
                        <div className="text-sm text-gray-500">{member.district}</div>
                        {member.cluster && (
                          <div className="text-xs bg-gray-100 px-2 py-1 rounded">
                            Cluster {member.cluster}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium capitalize">
                          {member.farm_type?.replace('_', ' ')}
                        </div>
                        <div className="text-sm text-gray-500">
                          {member.farm_size ? `${member.farm_size} hectares` : 'Size not specified'}
                        </div>
                        <div className="text-xs text-gray-500">
                          Since {member.year_joined}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        member.contract_status === 'Active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {member.contract_status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => navigate(`/member/${member.id}/edit`)}
                          className="text-blue-600 border-blue-200 hover:bg-blue-50"
                        >
                          ✏️ Edit
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDeleteMember(member.id, `${member.first_name} ${member.last_name}`)}
                          className="text-red-600 border-red-200 hover:bg-red-50"
                        >
                          🗑️ Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        
        {/* Table Footer */}
        {filteredMembers.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <div>
                Showing {filteredMembers.length} of {members.length} members
                {searchTerm && ` (filtered by "${searchTerm}")`}
              </div>
              <div className="flex items-center gap-4">
                <span>🚜 Total Farm Area: {
                  members.reduce((sum, m) => sum + (parseFloat(m.farm_size) || 0), 0).toFixed(1)
                } hectares</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )

  // Render different layouts based on dashboard mode
  if (isDashboardMode) {
    return (
      <DashboardLayout>
        {loading ? <LoadingState /> : <MembersContent />}
      </DashboardLayout>
    )
  }

  // Legacy standalone page (for backward compatibility)
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <Button 
            variant="outline" 
            onClick={() => navigate('/')}
            className="mb-4"
          >
            ← Back to Home
          </Button>
          <h1 className="text-3xl font-bold text-green-700">
            Members Directory
          </h1>
          <p className="text-gray-600 mt-2">
            Manage farm members
          </p>
        </div>
        
        {loading ? <LoadingState /> : <MembersContent />}
      </div>
    </div>
  )
}

export default MembersPage