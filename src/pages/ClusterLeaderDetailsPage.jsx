import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import DashboardLayout from "@/components/DashboardLayout"

function ClusterLeaderDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [leader, setLeader] = useState(null)
  const [loading, setLoading] = useState(true)

  // Sample data - replace with real database fetch
  const sampleClusterLeaders = [
    {
      id: 1,
      name: "Joseph Mukamuri",
      clusterName: "Mazowe Valley Cluster",
      location: {
        province: "Mashonaland Central",
        district: "Mazoe District",
        ward: "Ward 15",
        village: "Mazowe Village"
      },
      contactInfo: {
        phone: "+263 78 123 4567",
        email: "joseph.m@gmail.com",
        address: "Plot 45, Mazowe Valley"
      },
      members: 18,
      yearAppointed: 2022,
      secretary: {
        name: "Mary Chidziva",
        phone: "+263 78 234 5678",
        email: "mary.chid@gmail.com"
      },
      treasurer: {
        name: "Peter Makoni",
        phone: "+263 78 345 6789",
        email: "peter.mak@yahoo.com"
      },
      deputy: {
        name: "Sarah Mukamuri",
        phone: "+263 78 456 7890",
        email: "sarah.muk@gmail.com"
      },
      about: "Joseph has been leading the Mazowe Valley Cluster since 2022. He is a experienced tobacco farmer with over 15 years in the industry and has helped increase cluster membership by 40% during his tenure."
    },
    {
      id: 2,
      name: "Grace Chinembiri",
      clusterName: "Chiredzi East Cluster",
      location: {
        province: "Masvingo",
        district: "Chiredzi District",
        ward: "Ward 8",
        village: "Chiredzi East"
      },
      contactInfo: {
        phone: "+263 78 354 6789",
        email: "grace.chin@yahoo.com",
        address: "Farm 23, Chiredzi East"
      },
      members: 12,
      yearAppointed: 2023,
      secretary: {
        name: "John Mpofu",
        phone: "+263 78 234 5679",
        email: "john.mp@gmail.com"
      },
      treasurer: {
        name: "Linda Nyoni",
        phone: "+263 78 345 6790",
        email: "linda.ny@yahoo.com"
      },
      deputy: {
        name: "Thomas Chin",
        phone: "+263 78 456 7891",
        email: "thomas.ch@gmail.com"
      },
      about: "Grace is a dedicated leader who has brought innovative farming techniques to the Chiredzi East Cluster. She focuses on sustainable tobacco farming practices."
    }
    // Add more sample data as needed
  ]

  useEffect(() => {
    // Simulate fetching data
    const foundLeader = sampleClusterLeaders.find(l => l.id === parseInt(id))
    setLeader(foundLeader)
    setLoading(false)
  }, [id])

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-700 mb-4">Loading cluster leader details...</div>
            <div className="text-gray-600">Fetching leadership information...</div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (!leader) {
    return (
      <DashboardLayout>
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-red-600 mb-4">Cluster Leader Not Found</h2>
          <p className="text-gray-600 mb-6">The cluster leader you're looking for doesn't exist.</p>
          <Button 
            onClick={() => navigate('/dashboard/cluster-leaders')}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            👥 Back to Cluster Leaders
          </Button>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
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
                onClick={() => navigate(`/dashboard/cluster-leader/${leader.id}/edit`)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                ✏️ Edit Leader
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate('/dashboard/cluster-leaders')}
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
                  onClick={() => navigate(`/dashboard/cluster-leader/${leader.id}/edit`)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  ✏️ Edit Leader Details
                </Button>
                <Button 
                  variant="outline"
                  className="w-full"
                >
                  👥 View Cluster Members
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => navigate('/dashboard/cluster-leaders')}
                  className="w-full"
                >
                  👥 Back to All Leaders
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default ClusterLeaderDetailsPage