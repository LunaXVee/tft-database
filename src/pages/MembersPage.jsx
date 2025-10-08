import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { supabase } from "@/lib/supabase"
import { 
  User, 
  Phone, 
  MapPin, 
  Mail,
  Search,
  UserPlus,
  Download,
  Users,
  CheckCircle,
  Filter,
  Globe,
  Edit,
  Trash2,
  Tractor
} from "lucide-react"

function MembersPage() {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState("")
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)

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

  const handleDeleteMember = async (memberId, memberName) => {
    const isConfirmed = window.confirm(
      `Are you sure you want to delete ${memberName}? This action cannot be undone.`
    )
    
    if (!isConfirmed) return
    
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
  
  const filteredMembers = members.filter(member =>
    member.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.province?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl md:text-2xl font-bold text-green-700">Loading members...</h2>
        <p className="text-gray-600 mt-2">Fetching member data from database...</p>
      </div>
    )
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Action Bar - Mobile Optimized */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="space-y-4">
          {/* Search */}
          <div className="w-full relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10"
            />
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              onClick={() => navigate('/add-member')}
              className="bg-green-600 hover:bg-green-700 text-white flex-1 sm:flex-none flex items-center justify-center gap-2"
            >
              <UserPlus className="h-4 w-4" />
              Add Member
            </Button>
            <Button 
              variant="outline"
              onClick={() => navigate('/export')}
              className="border-blue-500 text-blue-600 hover:bg-blue-50 flex-1 sm:flex-none flex items-center justify-center gap-2"
            >
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
        
        {/* Quick Stats - Mobile Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-4 pt-4 border-t border-gray-200">
          <div className="text-center bg-gray-50 p-3 rounded">
            <div className="flex items-center justify-center mb-1">
              <Users className="h-5 w-5 text-gray-600" />
            </div>
            <div className="text-lg md:text-2xl font-bold text-gray-800">{members.length}</div>
            <div className="text-xs md:text-sm text-gray-600">Total</div>
          </div>
          <div className="text-center bg-green-50 p-3 rounded">
            <div className="flex items-center justify-center mb-1">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div className="text-lg md:text-2xl font-bold text-green-600">
              {members.filter(m => m.contract_status === 'Active').length}
            </div>
            <div className="text-xs md:text-sm text-gray-600">Active</div>
          </div>
          <div className="text-center bg-blue-50 p-3 rounded">
            <div className="flex items-center justify-center mb-1">
              <Filter className="h-5 w-5 text-blue-600" />
            </div>
            <div className="text-lg md:text-2xl font-bold text-blue-600">{filteredMembers.length}</div>
            <div className="text-xs md:text-sm text-gray-600">Results</div>
          </div>
          <div className="text-center bg-purple-50 p-3 rounded">
            <div className="flex items-center justify-center mb-1">
              <Globe className="h-5 w-5 text-purple-600" />
            </div>
            <div className="text-lg md:text-2xl font-bold text-purple-600">
              {new Set(members.map(m => m.province)).size}
            </div>
            <div className="text-xs md:text-sm text-gray-600">Provinces</div>
          </div>
        </div>
      </div>

      {/* Members List - Mobile Cards / Desktop Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">Member Directory</h3>
          <p className="text-gray-600 mt-1 text-sm">Manage and view all registered farmers</p>
        </div>
        
        {filteredMembers.length === 0 ? (
          <div className="text-center py-12 px-4">
            <div className="text-gray-500">
              {searchTerm ? (
                <div>
                  <Search className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                  <div className="text-lg mb-2">No matches found</div>
                  <div className="mb-3">No members found matching "{searchTerm}"</div>
                  <Button 
                    variant="outline" 
                    onClick={() => setSearchTerm("")}
                  >
                    Clear Search
                  </Button>
                </div>
              ) : (
                <div>
                  <Users className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                  <div className="text-lg mb-2">No members yet</div>
                  <div className="mb-3">Start by adding your first farmer</div>
                  <Button 
                    onClick={() => navigate('/add-member')}
                    className="flex items-center gap-2"
                  >
                    <UserPlus className="h-4 w-4" />
                    Add First Member
                  </Button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <>
            {/* Mobile Card View - Hidden on Desktop */}
            <div className="block md:hidden">
              {filteredMembers.map((member) => (
                <div key={member.id} className="border-b border-gray-200 p-4">
                  <div className="space-y-3">
                    {/* Member Name */}
                    <div>
                      <button 
                        onClick={() => navigate(`/member/${member.id}`)}
                        className="font-medium text-green-600 hover:text-green-800 text-lg"
                      >
                        {member.first_name} {member.last_name}
                      </button>
                      <div className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {member.mobile_phone_1}
                      </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-gray-500 flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          Location:
                        </span>
                        <div className="font-medium capitalize">{member.province}</div>
                        {member.cluster && (
                          <div className="text-xs bg-gray-100 px-2 py-1 rounded mt-1 inline-block">
                            Cluster {member.cluster}
                          </div>
                        )}
                      </div>
                      <div>
                        <span className="text-gray-500 flex items-center gap-1">
                          <Tractor className="h-3 w-3" />
                          Farm:
                        </span>
                        <div className="font-medium capitalize">
                          {member.farm_type?.replace('_', ' ')}
                        </div>
                        <div className="text-xs text-gray-500">
                          {member.farm_size ? `${member.farm_size} ha` : 'Size not specified'}
                        </div>
                      </div>
                    </div>

                    {/* Status and Actions */}
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        member.contract_status === 'Active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {member.contract_status}
                      </span>
                      
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => navigate(`/member/${member.id}/edit`)}
                          className="text-blue-600 border-blue-200 hover:bg-blue-50 text-xs px-2 py-1 flex items-center gap-1"
                        >
                          <Edit className="h-3 w-3" />
                          Edit
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDeleteMember(member.id, `${member.first_name} ${member.last_name}`)}
                          className="text-red-600 border-red-200 hover:bg-red-50 text-xs px-2 py-1 flex items-center gap-1"
                        >
                          <Trash2 className="h-3 w-3" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View - Hidden on Mobile */}
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Member Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Farm Info
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredMembers.map((member) => (
                    <tr key={member.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="space-y-1">
                          <button 
                            onClick={() => navigate(`/member/${member.id}`)}
                            className="font-medium text-green-600 hover:text-green-800 hover:underline text-left"
                          >
                            {member.first_name} {member.last_name}
                          </button>
                          <div className="text-sm text-gray-500 flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {member.mobile_phone_1}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {member.email_address || 'No email'}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="space-y-1">
                          <div className="font-medium capitalize flex items-center gap-1">
                            <MapPin className="h-3 w-3 text-gray-400" />
                            {member.province}
                          </div>
                          <div className="text-sm text-gray-500">{member.district}</div>
                          {member.cluster && (
                            <div className="text-xs bg-gray-100 px-2 py-1 rounded inline-block">
                              Cluster {member.cluster}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="space-y-1">
                          <div className="font-medium capitalize flex items-center gap-1">
                            <Tractor className="h-3 w-3 text-gray-400" />
                            {member.farm_type?.replace('_', ' ')}
                          </div>
                          <div className="text-sm text-gray-500">
                            {member.farm_size ? `${member.farm_size} hectares` : 'Size not specified'}
                          </div>
                          <div className="text-xs text-gray-500">
                            Since {member.year_joined}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          member.contract_status === 'Active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {member.contract_status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => navigate(`/member/${member.id}/edit`)}
                            className="text-blue-600 border-blue-200 hover:bg-blue-50 flex items-center gap-1"
                          >
                            <Edit className="h-4 w-4" />
                            Edit
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDeleteMember(member.id, `${member.first_name} ${member.last_name}`)}
                            className="text-red-600 border-red-200 hover:bg-red-50 flex items-center gap-1"
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
        
        {/* Footer */}
        {filteredMembers.length > 0 && (
          <div className="px-4 md:px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm text-gray-600 space-y-2 sm:space-y-0">
              <div>
                Showing {filteredMembers.length} of {members.length} members
                {searchTerm && ` (filtered by "${searchTerm}")`}
              </div>
              <div className="text-xs sm:text-sm flex items-center gap-1">
                <Tractor className="h-4 w-4" />
                Total Farm Area: {
                  members.reduce((sum, m) => sum + (parseFloat(m.farm_size) || 0), 0).toFixed(1)
                } hectares
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default MembersPage