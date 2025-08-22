import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"

function ClusterLeaderDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [leader, setLeader] = useState(null)
  const [loading, setLoading] = useState(true)

  // Fetch cluster leader data from database
  useEffect(() => {
    fetchClusterLeader()
  }, [id])

  const fetchClusterLeader = async () => {
    try {
      console.log("📥 Fetching cluster leader details for ID:", id)
      
      const { data, error } = await supabase
        .from('cluster_leaders')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        console.error("❌ Error fetching cluster leader:", error)
        setLeader(null)
        return
      }

      // Get member count for this cluster
      const { data: members, error: membersError } = await supabase
        .from('members')
        .select('id')
        .eq('cluster', data.cluster_name)

      const memberCount = membersError ? 0 : (members ? members.length : 0)

      // Transform database data to match component expectations
      const transformedLeader = {
        id: data.id,
        name: `${data.first_name} ${data.last_name}`,
        clusterName: data.cluster_name,
        location: {
          province: data.province,
          district: data.district,
          ward: data.ward || 'Not specified',
          village: data.village || 'Not specified'
        },
        contactInfo: {
          phone: data.phone,
          email: data.email || 'Not provided',
          address: data.address || 'Not provided'
        },
        members: memberCount,
        yearAppointed: data.year_appointed,
        secretary: {
          name: data.secretary_name || 'Not assigned',
          phone: data.secretary_phone || 'Not provided',
          email: data.secretary_email || 'Not provided'
        },
        treasurer: {
          name: data.treasurer_name || 'Not assigned',
          phone: data.treasurer_phone || 'Not provided',
          email: data.treasurer_email || 'Not provided'
        },
        deputy: {
          name: data.deputy_name || 'Not assigned',
          phone: data.deputy_phone || 'Not provided',
          email: data.deputy_email || 'Not provided'
        },
        about: data.about || 'No additional information available.'
      }

      console.log("✅ Cluster leader details loaded:", transformedLeader)
      setLeader(transformedLeader)
      
    } catch (err) {
      console.error("❌ Fetch error:", err)
      setLeader(null)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="text-2xl font-bold text-green-700 mb-4">Loading cluster leader details...</div>
          <div className="text-gray-600">Fetching leadership information...</div>
        </div>
      </div>
    )
  }

  if (!leader) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <div className="text-6xl mb-4">❌</div>
        <h2 className="text-2xl font-bold text-red-600 mb-4">Cluster Leader Not Found</h2>
        <p className="text-gray-600 mb-6">The cluster leader you're looking for doesn't exist.</p>
        <Button 
          onClick={() => navigate('/cluster-leaders')}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          👥 Back to Cluster Leaders
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <span className="text-2xl">👨‍💼</span>
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">{leader.name}</h1>
              <p className="text-lg text-blue-600 font-medium">{leader.clusterName}</p>
              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                <span>📱 {leader.contactInfo.phone}</span>
                <span>📧 {leader.contactInfo.email}</span>
                <span>👥 {leader.members} Members</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              onClick={() => navigate(`/cluster-leader/${leader.id}/edit`)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              ✏️ Edit Leader
            </Button>
            <Button 
              variant="outline"
              onClick={() => navigate('/cluster-leaders')}
            >
              👥 Back to Leaders
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Leader Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2 flex items-center">
              <span className="mr-2">👤</span>
              Leader Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <span className="text-sm text-gray-600 block">Full Name</span>
                <span className="font-medium text-gray-900">{leader.name}</span>
              </div>
              <div>
                <span className="text-sm text-gray-600 block">Cluster Name</span>
                <span className="font-medium text-gray-900">{leader.clusterName}</span>
              </div>
              <div>
                <span className="text-sm text-gray-600 block">Year Appointed</span>
                <span className="font-medium text-gray-900">{leader.yearAppointed}</span>
              </div>
              <div>
                <span className="text-sm text-gray-600 block">Total Members</span>
                <span className="font-medium text-gray-900">{leader.members} farmers</span>
              </div>
              <div className="md:col-span-2">
                <span className="text-sm text-gray-600 block">Address</span>
                <span className="font-medium text-gray-900">{leader.contactInfo.address}</span>
              </div>
            </div>
          </div>

          {/* Location Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2 flex items-center">
              <span className="mr-2">📍</span>
              Location Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <span className="text-sm text-gray-600 block">Province</span>
                <span className="font-medium text-gray-900">{leader.location.province}</span>
              </div>
              <div>
                <span className="text-sm text-gray-600 block">District</span>
                <span className="font-medium text-gray-900">{leader.location.district}</span>
              </div>
              <div>
                <span className="text-sm text-gray-600 block">Ward</span>
                <span className="font-medium text-gray-900">{leader.location.ward}</span>
              </div>
              <div>
                <span className="text-sm text-gray-600 block">Village</span>
                <span className="font-medium text-gray-900">{leader.location.village}</span>
              </div>
            </div>
          </div>

          {/* About Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2 flex items-center">
              <span className="mr-2">📝</span>
              About the Leader
            </h2>
            <p className="text-gray-700 leading-relaxed">{leader.about}</p>
          </div>
        </div>

        {/* Cluster Team */}
        <div className="space-y-6">
          {/* Deputy Leader */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <span className="mr-2">🤝</span>
              Deputy Leader
            </h3>
            <div className="space-y-3">
              <div>
                <span className="text-sm text-gray-600 block">Name</span>
                <span className="font-medium text-gray-900">{leader.deputy.name}</span>
              </div>
              <div>
                <span className="text-sm text-gray-600 block">Phone</span>
                <span className="font-medium text-green-600">{leader.deputy.phone}</span>
              </div>
              <div>
                <span className="text-sm text-gray-600 block">Email</span>
                <span className="font-medium text-gray-900">{leader.deputy.email}</span>
              </div>
            </div>
          </div>

          {/* Secretary */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <span className="mr-2">📋</span>
              Cluster Secretary
            </h3>
            <div className="space-y-3">
              <div>
                <span className="text-sm text-gray-600 block">Name</span>
                <span className="font-medium text-gray-900">{leader.secretary.name}</span>
              </div>
              <div>
                <span className="text-sm text-gray-600 block">Phone</span>
                <span className="font-medium text-green-600">{leader.secretary.phone}</span>
              </div>
              <div>
                <span className="text-sm text-gray-600 block">Email</span>
                <span className="font-medium text-gray-900">{leader.secretary.email}</span>
              </div>
            </div>
          </div>

          {/* Treasurer */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <span className="mr-2">💰</span>
              Cluster Treasurer
            </h3>
            <div className="space-y-3">
              <div>
                <span className="text-sm text-gray-600 block">Name</span>
                <span className="font-medium text-gray-900">{leader.treasurer.name}</span>
              </div>
              <div>
                <span className="text-sm text-gray-600 block">Phone</span>
                <span className="font-medium text-green-600">{leader.treasurer.phone}</span>
              </div>
              <div>
                <span className="text-sm text-gray-600 block">Email</span>
                <span className="font-medium text-gray-900">{leader.treasurer.email}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Button 
                onClick={() => navigate(`/cluster-leader/${leader.id}/edit`)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                ✏️ Edit Leader Details
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate(`/cluster/${encodeURIComponent(leader.clusterName)}/members`)}
                className="w-full"
              >
                👥 View Cluster Members ({leader.members})
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate('/cluster-leaders')}
                className="w-full"
              >
                👥 Back to All Leaders
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ClusterLeaderDetailsPage