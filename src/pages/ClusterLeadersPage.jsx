import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { supabase } from "@/lib/supabase"

function ClusterLeadersPage() {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState("")
  const [leaders, setLeaders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchClusterLeaders()
  }, [])

  const fetchClusterLeaders = async () => {
    try {
      console.log("📥 Fetching cluster leaders from database...")
      
      const { data, error } = await supabase
        .from('cluster_leaders')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error("❌ Error fetching cluster leaders:", error)
        return
      }

      console.log("✅ Cluster leaders fetched successfully:", data)
      setLeaders(data || [])
      
    } catch (err) {
      console.error("❌ Fetch error:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteLeader = async (leaderId, leaderName) => {
    const isConfirmed = window.confirm(
      `Are you sure you want to delete cluster leader ${leaderName}? This action cannot be undone.`
    )
    
    if (!isConfirmed) return
    
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
      fetchClusterLeaders()
      
    } catch (err) {
      console.error("❌ Delete error:", err)
      alert("Delete error. Check console for details.")
    }
  }
  
  const filteredLeaders = leaders.filter(leader =>
    leader.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    leader.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    leader.cluster_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    leader.province?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl md:text-2xl font-bold text-green-700">Loading cluster leaders...</h2>
        <p className="text-gray-600 mt-2">Fetching leadership data from database...</p>
      </div>
    )
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Action Bar - Mobile Optimized */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="space-y-4">
          {/* Search */}
          <div className="w-full">
            <Input
              placeholder="Search cluster leaders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              onClick={() => navigate('/add-cluster-leader')}
              className="bg-green-600 hover:bg-green-700 text-white flex-1 sm:flex-none"
            >
              ➕ Add Cluster Leader
            </Button>
            <Button 
              variant="outline"
              onClick={() => navigate('/export')}
              className="border-blue-500 text-blue-600 hover:bg-blue-50 flex-1 sm:flex-none"
            >
              📄 Export Data
            </Button>
          </div>
        </div>
        
        {/* Quick Stats - Mobile Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-4 pt-4 border-t border-gray-200">
          <div className="text-center bg-gray-50 p-3 rounded">
            <div className="text-lg md:text-2xl font-bold text-gray-800">{leaders.length}</div>
            <div className="text-xs md:text-sm text-gray-600">Total Leaders</div>
          </div>
          <div className="text-center bg-green-50 p-3 rounded">
            <div className="text-lg md:text-2xl font-bold text-green-600">
              {leaders.filter(l => l.status === 'Active').length}
            </div>
            <div className="text-xs md:text-sm text-gray-600">Active</div>
          </div>
          <div className="text-center bg-blue-50 p-3 rounded">
            <div className="text-lg md:text-2xl font-bold text-blue-600">{filteredLeaders.length}</div>
            <div className="text-xs md:text-sm text-gray-600">Results</div>
          </div>
          <div className="text-center bg-purple-50 p-3 rounded">
            <div className="text-lg md:text-2xl font-bold text-purple-600">
              {new Set(leaders.map(l => l.province)).size}
            </div>
            <div className="text-xs md:text-sm text-gray-600">Provinces</div>
          </div>
        </div>
      </div>

      {/* Leaders List - Mobile Cards / Desktop Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">Cluster Leaders Directory</h3>
          <p className="text-gray-600 mt-1 text-sm">Manage cluster leadership across Zimbabwe</p>
        </div>
        
        {filteredLeaders.length === 0 ? (
          <div className="text-center py-12 px-4">
            <div className="text-gray-500">
              {searchTerm ? (
                <div>
                  <div className="text-lg mb-2">🔍 No matches found</div>
                  <div className="mb-3">No cluster leaders found matching "{searchTerm}"</div>
                  <Button 
                    variant="outline" 
                    onClick={() => setSearchTerm("")}
                  >
                    Clear Search
                  </Button>
                </div>
              ) : (
                <div>
                  <div className="text-lg mb-2">👨‍💼 No cluster leaders yet</div>
                  <div className="mb-3">Start by adding your first cluster leader</div>
                  <Button onClick={() => navigate('/add-cluster-leader')}>
                    Add First Leader
                  </Button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <>
            {/* Mobile Card View - Hidden on Desktop */}
            <div className="block md:hidden">
              {filteredLeaders.map((leader) => (
                <div key={leader.id} className="border-b border-gray-200 p-4">
                  <div className="space-y-3">
                    {/* Leader Name */}
                    <div>
                      <button 
                        onClick={() => navigate(`/cluster-leader/${leader.id}`)}
                        className="font-medium text-green-600 hover:text-green-800 text-lg"
                      >
                        {leader.first_name} {leader.last_name}
                      </button>
                      <div className="text-sm text-gray-500 mt-1">
                        📱 {leader.phone}
                      </div>
                    </div>

                    {/* Cluster Info */}
                    <div className="bg-green-50 p-3 rounded">
                      <div className="font-medium text-green-800">{leader.cluster_name}</div>
                      <div className="text-sm text-green-600">{leader.province}</div>
                      <div className="text-xs text-green-500 mt-1">
                        Appointed {leader.year_appointed}
                      </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-gray-500">Email:</span>
                        <div className="font-medium">
                          {leader.email || 'Not provided'}
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-500">District:</span>
                        <div className="font-medium">{leader.district}</div>
                      </div>
                    </div>

                    {/* Status and Actions */}
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        leader.status === 'Active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {leader.status}
                      </span>
                      
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => navigate(`/cluster-leader/${leader.id}`)}
                          className="text-blue-600 border-blue-200 hover:bg-blue-50 text-xs px-2 py-1"
                        >
                          View
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => navigate(`/cluster-leader/${leader.id}/edit`)}
                          className="text-green-600 border-green-200 hover:bg-green-50 text-xs px-2 py-1"
                        >
                          Edit
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDeleteLeader(leader.id, `${leader.first_name} ${leader.last_name}`)}
                          className="text-red-600 border-red-200 hover:bg-red-50 text-xs px-2 py-1"
                        >
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
                      Leader Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cluster Info
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
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
                  {filteredLeaders.map((leader) => (
                    <tr key={leader.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="space-y-1">
                          <button 
                            onClick={() => navigate(`/cluster-leader/${leader.id}`)}
                            className="font-medium text-green-600 hover:text-green-800 hover:underline text-left"
                          >
                            {leader.first_name} {leader.last_name}
                          </button>
                          <div className="text-sm text-gray-500">
                            📱 {leader.phone}
                          </div>
                          <div className="text-sm text-gray-500">
                            {leader.email ? `📧 ${leader.email}` : '📧 No email'}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="space-y-1">
                          <div className="font-medium text-green-700">{leader.cluster_name}</div>
                          <div className="text-sm text-gray-500">
                            Appointed {leader.year_appointed}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="space-y-1">
                          <div className="font-medium">{leader.province}</div>
                          <div className="text-sm text-gray-500">{leader.district}</div>
                          {leader.ward && (
                            <div className="text-xs text-gray-400">Ward {leader.ward}</div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          leader.status === 'Active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {leader.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => navigate(`/cluster-leader/${leader.id}`)}
                            className="text-blue-600 border-blue-200 hover:bg-blue-50"
                          >
                            👁️ View
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => navigate(`/cluster-leader/${leader.id}/edit`)}
                            className="text-green-600 border-green-200 hover:bg-green-50"
                          >
                            ✏️ Edit
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDeleteLeader(leader.id, `${leader.first_name} ${leader.last_name}`)}
                            className="text-red-600 border-red-200 hover:bg-red-50"
                          >
                            🗑️ Delete
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
        {filteredLeaders.length > 0 && (
          <div className="px-4 md:px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm text-gray-600 space-y-2 sm:space-y-0">
              <div>
                Showing {filteredLeaders.length} of {leaders.length} cluster leaders
                {searchTerm && ` (filtered by "${searchTerm}")`}
              </div>
              <div className="text-xs sm:text-sm">
                👨‍💼 Active Leaders: {leaders.filter(l => l.status === 'Active').length}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ClusterLeadersPage