import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
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
import DashboardLayout from "@/components/DashboardLayout"
import {
  Users,
  UserPlus,
  MapPin,
  Phone,
  Mail,
  Search,
  Eye,
  Edit,
  CheckCircle,
  Tractor,
  BarChart3,
  Grid3x3,
  ArrowLeft
} from "lucide-react"

function ClusterMembersPage() {
  const { clusterName } = useParams() // Get cluster name from URL
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState("")
  const [members, setMembers] = useState([])
  const [clusterInfo, setClusterInfo] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchClusterData()
  }, [clusterName])

  const fetchClusterData = async () => {
    try {
      console.log("📥 Fetching cluster data for:", clusterName)
      
      // Fetch cluster leader information
      const { data: clusterData, error: clusterError } = await supabase
        .from('cluster_leaders')
        .select('*')
        .eq('cluster_name', decodeURIComponent(clusterName))
        .eq('status', 'Active')
        .single()

      if (clusterError) {
        console.error("❌ Error fetching cluster info:", clusterError)
      } else {
        setClusterInfo(clusterData)
      }

      // Fetch members in this cluster
      const { data: membersData, error: membersError } = await supabase
        .from('members')
        .select('*')
        .eq('cluster', decodeURIComponent(clusterName))
        .order('created_at', { ascending: false })

      if (membersError) {
        console.error("❌ Error fetching cluster members:", membersError)
        return
      }

      console.log("✅ Cluster members fetched successfully:", membersData)
      setMembers(membersData || [])
      
    } catch (err) {
      console.error("❌ Fetch error:", err)
    } finally {
      setLoading(false)
    }
  }

  // Filter members based on search term
  const filteredMembers = members.filter(member =>
    member.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.mobile_phone_1?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-green-700">Loading cluster members...</h2>
          <p className="text-gray-600 mt-2">Fetching member data...</p>
        </div>
    )
  }

  return (
      <div className="space-y-6">
        {/* Cluster Header */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">
                {decodeURIComponent(clusterName)}
              </h1>
              {clusterInfo && (
                <div className="mt-2 space-y-1">
                  <p className="text-lg text-blue-600 font-medium flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Led by {clusterInfo.first_name} {clusterInfo.last_name}
                  </p>
                  <p className="text-gray-600 flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {clusterInfo.province}, {clusterInfo.district}
                  </p>
                  <div className="flex items-center gap-4">
                    <p className="text-gray-600 flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      {clusterInfo.phone}
                    </p>
                    <p className="text-gray-600 flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      {clusterInfo.email || 'No email'}
                    </p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                onClick={() => navigate('/dashboard/add-member')}
                className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
              >
                <UserPlus className="h-4 w-4" />
                Add Member to Cluster
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate("/cluster-leaders")}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Clusters
              </Button>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <div className="bg-white p-4 lg:p-6 rounded-lg shadow-md text-center">
            <div className="flex items-center justify-center mb-2">
              <Users className="h-6 w-6 text-gray-600" />
            </div>
            <div className="text-2xl lg:text-3xl font-bold text-gray-800">{members.length}</div>
            <div className="text-sm lg:text-base text-gray-600 mt-1">Total Members</div>
          </div>
          <div className="bg-white p-4 lg:p-6 rounded-lg shadow-md text-center">
            <div className="flex items-center justify-center mb-2">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="text-2xl lg:text-3xl font-bold text-green-600">
              {members.filter(m => m.contract_status === 'Active').length}
            </div>
            <div className="text-sm lg:text-base text-gray-600 mt-1">Active Contracts</div>
          </div>
          <div className="bg-white p-4 lg:p-6 rounded-lg shadow-md text-center">
            <div className="flex items-center justify-center mb-2">
              <BarChart3 className="h-6 w-6 text-blue-600" />
            </div>
            <div className="text-2xl lg:text-3xl font-bold text-blue-600">
              {Math.round(members.reduce((sum, m) => sum + (parseFloat(m.farm_size) || 0), 0) * 10) / 10}
            </div>
            <div className="text-sm lg:text-base text-gray-600 mt-1">Total Hectares</div>
          </div>
          <div className="bg-white p-4 lg:p-6 rounded-lg shadow-md text-center">
            <div className="flex items-center justify-center mb-2">
              <Grid3x3 className="h-6 w-6 text-purple-600" />
            </div>
            <div className="text-2xl lg:text-3xl font-bold text-purple-600">
              {new Set(members.map(m => m.farm_type)).size}
            </div>
            <div className="text-sm lg:text-base text-gray-600 mt-1">Farm Types</div>
          </div>
        </div>

        {/* Members List */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4 lg:p-6 border-b border-gray-200">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Cluster Members</h3>
                <p className="text-gray-600 mt-1">Members registered under this cluster</p>
              </div>
              <div className="flex-1 max-w-md relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search members..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10"
                />
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <Table className="min-w-[800px]">
              <TableHeader>
                <TableRow className="bg-gray-100 border-b-2 border-gray-200">
                  <TableHead className="font-bold text-gray-900 py-4">Member Name</TableHead>
                  <TableHead className="font-bold text-gray-900 py-4">Contact</TableHead>
                  <TableHead className="font-bold text-gray-900 py-4">Farm Details</TableHead>
                  <TableHead className="font-bold text-gray-900 py-4">Status</TableHead>
                  <TableHead className="font-bold text-gray-900 py-4">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMembers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-12">
                      <div className="text-gray-500">
                        {searchTerm ? (
                          <div>
                            <Search className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                            <div className="text-lg mb-2">No matches found</div>
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
                            <Users className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                            <div className="text-lg mb-2">No members in this cluster yet</div>
                            <div>Start by adding members to {decodeURIComponent(clusterName)}</div>
                            <Button 
                              onClick={() => navigate('/dashboard/add-member')}
                              className="mt-3 bg-green-600 hover:bg-green-700 text-white flex items-center gap-2 mx-auto"
                            >
                              <UserPlus className="h-4 w-4" />
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
                            ID: {member.id_number || 'Not provided'}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-sm font-medium flex items-center gap-1">
                            <Phone className="h-3 w-3 text-gray-400" />
                            {member.mobile_phone_1}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center gap-1">
                            <Mail className="h-3 w-3 text-gray-400" />
                            {member.email_address || 'No email'}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium capitalize flex items-center gap-1">
                            <Tractor className="h-3 w-3 text-gray-400" />
                            {member.farm_type?.replace('_', ' ')}
                          </div>
                          <div className="text-sm text-gray-500">
                            {member.farm_size ? `${member.farm_size} hectares` : 'Size not specified'}
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
                            onClick={() => navigate(`/member/${member.id}`)}
                            className="text-blue-600 border-blue-200 hover:bg-blue-50 flex items-center gap-1"
                          >
                            <Eye className="h-4 w-4" />
                            View
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => navigate(`/member/${member.id}/edit`)}
                            className="text-green-600 border-green-200 hover:bg-green-50 flex items-center gap-1"
                          >
                            <Edit className="h-4 w-4" />
                            Edit
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
            <div className="px-4 lg:px-6 py-4 border-t border-gray-200 bg-gray-50">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between text-sm text-gray-600 gap-2">
                <div>
                  Showing {filteredMembers.length} of {members.length} members
                  {searchTerm && ` (filtered by "${searchTerm}")`}
                </div>
                <div className="flex flex-wrap items-center gap-4">
                  <span className="flex items-center gap-1">
                    <Tractor className="h-4 w-4" />
                    Total Farm Area: {
                      filteredMembers.reduce((sum, m) => sum + (parseFloat(m.farm_size) || 0), 0).toFixed(1)
                    } hectares
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
  )
}

export default ClusterMembersPage