import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
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

function ClusterLeadersPage() {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState("")
  const [clusterLeaders, setClusterLeaders] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    activeClusters: 0,
    totalLeaders: 0,
    avgMembersPerCluster: 0,
    provincesCovered: 0
  })

  useEffect(() => {
    fetchClusterLeaders()
  }, [])

  const fetchClusterLeaders = async () => {
    try {
      console.log("📥 Fetching cluster leaders from database...")
      
      const { data: leaders, error: leadersError } = await supabase
        .from('cluster_leaders')
        .select('*')
        .eq('status', 'Active')
        .order('created_at', { ascending: false })

      if (leadersError) {
        console.error("❌ Error fetching cluster leaders:", leadersError)
        return
      }

      console.log("✅ Cluster leaders fetched successfully:", leaders)
      setClusterLeaders(leaders || [])
      
      // Calculate statistics
      await calculateStats(leaders || [])
      
    } catch (err) {
      console.error("❌ Fetch error:", err)
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = async (leaders) => {
    try {
      const activeClusters = leaders.length
      const totalLeaders = leaders.length
      const provincesCovered = new Set(leaders.map(leader => leader.province)).size

      // Calculate member counts per cluster by counting members assigned to each cluster
      const { data: members, error: membersError } = await supabase
        .from('members')
        .select('cluster')

      let avgMembersPerCluster = 0
      if (!membersError && members) {
        // Group members by cluster and calculate average
        const clusterMemberCounts = {}
        members.forEach(member => {
          if (member.cluster) {
            clusterMemberCounts[member.cluster] = (clusterMemberCounts[member.cluster] || 0) + 1
          }
        })
        
        const totalMembers = Object.values(clusterMemberCounts).reduce((sum, count) => sum + count, 0)
        avgMembersPerCluster = activeClusters > 0 ? totalMembers / activeClusters : 0
      }

      setStats({
        activeClusters,
        totalLeaders,
        avgMembersPerCluster: Math.round(avgMembersPerCluster * 10) / 10,
        provincesCovered
      })

    } catch (err) {
      console.error("❌ Error calculating stats:", err)
    }
  }

  const getClusterMemberCount = async (clusterName) => {
    try {
      const { data, error } = await supabase
        .from('members')
        .select('id')
        .eq('cluster', clusterName)

      if (error) {
        console.error("Error counting cluster members:", error)
        return 0
      }

      return data ? data.length : 0
    } catch (err) {
      console.error("Error in getClusterMemberCount:", err)
      return 0
    }
  }

  // Enhanced cluster leaders with member counts
  const [leadersWithCounts, setLeadersWithCounts] = useState([])

  useEffect(() => {
    const addMemberCounts = async () => {
      if (clusterLeaders.length > 0) {
        const leadersWithMemberCounts = await Promise.all(
          clusterLeaders.map(async (leader) => {
            const memberCount = await getClusterMemberCount(leader.cluster_name)
            return { ...leader, memberCount }
          })
        )
        setLeadersWithCounts(leadersWithMemberCounts)
      }
    }

    addMemberCounts()
  }, [clusterLeaders])

  // Delete cluster leader function
  const handleDeleteLeader = async (leaderId, leaderName) => {
    const isConfirmed = window.confirm(
      `Are you sure you want to delete ${leaderName}? This action cannot be undone.`
    )
    
    if (!isConfirmed) {
      return
    }
    
    try {
      console.log("🗑️ Deleting cluster leader:", leaderId)
      
      const { error } = await supabase
        .from('cluster_leaders')
        .delete()
        .eq('id', leaderId)
      
      if (error) {
        console.error("❌ Delete failed:", error)
        alert("Failed to delete cluster leader. Check console for details.")
        return
      }
      
      console.log("✅ Cluster leader deleted successfully!")
      alert("Cluster leader deleted successfully!")
      
      // Refresh the list
      fetchClusterLeaders()
      
    } catch (err) {
      console.error("❌ Delete error:", err)
      alert("Delete error. Check console for details.")
    }
  }

  // Filter cluster leaders based on search term
  const filteredLeaders = leadersWithCounts.filter(leader =>
    leader.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    leader.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    leader.cluster_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    leader.province?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    leader.district?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-green-700">Loading cluster leaders...</h2>
          <p className="text-gray-600 mt-2">Fetching cluster leadership data from database...</p>
        </div>
    )
  }

  return (
      <div className="space-y-6">
        {/* Header with Search */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">Cluster Leaders</h1>
            <p className="text-gray-600 mt-1">Manage cluster leadership and organization</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 lg:w-auto w-full">
            <Input
              placeholder="Search cluster leaders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full lg:w-80"
            />
            <Button 
              onClick={() => navigate('/dashboard/add-cluster-leader')}
              className="bg-green-600 hover:bg-green-700 text-white whitespace-nowrap"
            >
              + Add New Cluster Leader
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <div className="bg-white p-4 lg:p-6 rounded-lg shadow-md text-center">
            <div className="text-2xl lg:text-3xl font-bold text-gray-800">{stats.activeClusters}</div>
            <div className="text-sm lg:text-base text-gray-600 mt-1">Active Clusters</div>
          </div>
          <div className="bg-white p-4 lg:p-6 rounded-lg shadow-md text-center">
            <div className="text-2xl lg:text-3xl font-bold text-gray-800">{stats.totalLeaders}</div>
            <div className="text-sm lg:text-base text-gray-600 mt-1">Cluster Leaders</div>
          </div>
          <div className="bg-white p-4 lg:p-6 rounded-lg shadow-md text-center">
            <div className="text-2xl lg:text-3xl font-bold text-gray-800">{stats.avgMembersPerCluster}</div>
            <div className="text-sm lg:text-base text-gray-600 mt-1">Avg Member/Cluster</div>
          </div>
          <div className="bg-white p-4 lg:p-6 rounded-lg shadow-md text-center">
            <div className="text-2xl lg:text-3xl font-bold text-gray-800">{stats.provincesCovered}</div>
            <div className="text-sm lg:text-base text-gray-600 mt-1">Provinces Covered</div>
          </div>
        </div>

        {/* Cluster Leadership Directory */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4 lg:p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">Cluster Leadership Directory</h3>
            <p className="text-gray-600 mt-1">Manage cluster leaders and their teams</p>
          </div>
          
          <div className="overflow-x-auto">
            <Table className="min-w-[900px]">
              <TableHeader>
                <TableRow className="bg-gray-100 border-b-2 border-gray-200">
                  <TableHead className="font-bold text-gray-900 py-4">Cluster Leader</TableHead>
                  <TableHead className="font-bold text-gray-900 py-4">Cluster Details</TableHead>
                  <TableHead className="font-bold text-gray-900 py-4">Location</TableHead>
                  <TableHead className="font-bold text-gray-900 py-4">Contact Info</TableHead>
                  <TableHead className="font-bold text-gray-900 py-4">Members</TableHead>
                  <TableHead className="font-bold text-gray-900 py-4">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLeaders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12">
                      <div className="text-gray-500">
                        {searchTerm ? (
                          <div>
                            <div className="text-lg mb-2">🔍 No matches found</div>
                            <div>No cluster leaders found matching "{searchTerm}"</div>
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
                            <div className="text-lg mb-2">👥 No cluster leaders yet</div>
                            <div>Start by adding your first cluster leader</div>
                            <Button 
                              onClick={() => navigate('/dashboard/add-cluster-leader')}
                              className="mt-3 bg-green-600 hover:bg-green-700 text-white"
                            >
                              Add First Cluster Leader
                            </Button>
                          </div>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredLeaders.map((leader) => (
                    <TableRow key={leader.id} className="hover:bg-gray-50">
                      <TableCell>
                        <button 
                          onClick={() => navigate(`/dashboard/cluster-leader/${leader.id}`)}
                          className="font-medium text-blue-600 hover:text-blue-800 hover:underline text-left"
                        >
                          {leader.first_name} {leader.last_name}
                        </button>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium text-gray-900">{leader.cluster_name}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-sm bg-gray-100 px-2 py-1 rounded text-center">
                            {leader.province}
                          </div>
                          <div className="text-xs text-gray-600 text-center">
                            {leader.district}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-sm font-medium text-green-600">
                            {leader.phone}
                          </div>
                          <div className="text-xs text-gray-600">
                            {leader.email || 'No email'}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="text-lg font-bold text-gray-800">
                          {leader.memberCount || 0}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => navigate(`/dashboard/cluster-leader/${leader.id}/edit`)}
                            className="text-blue-600 border-blue-200 hover:bg-blue-50"
                          >
                            Edit
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDeleteLeader(leader.id, `${leader.first_name} ${leader.last_name}`)}
                            className="text-red-600 border-red-200 hover:bg-red-50"
                          >
                            Delete
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
          {filteredLeaders.length > 0 && (
            <div className="px-4 lg:px-6 py-4 border-t border-gray-200 bg-gray-50">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between text-sm text-gray-600 gap-2">
                <div>
                  Showing {filteredLeaders.length} of {clusterLeaders.length} cluster leaders
                  {searchTerm && ` (filtered by "${searchTerm}")`}
                </div>
                <div className="flex flex-wrap items-center gap-4">
                  <span>👥 Total Members: {filteredLeaders.reduce((sum, l) => sum + (l.memberCount || 0), 0)}</span>
                  <span>🏛️ Provinces: {new Set(filteredLeaders.map(l => l.province)).size}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
  )
}

export default ClusterLeadersPage