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

  // Sample data for now - we'll replace this with real database data
  const sampleClusterLeaders = [
    {
      id: 1,
      name: "Joseph Mukamuri",
      clusterName: "Mazowe Valley Cluster",
      location: {
        province: "Mashonaland Central",
        district: "Mazoe District"
      },
      contactInfo: {
        phone: "+263 78 123 4567",
        email: "joseph.m@gmail.com"
      },
      members: 18,
      secretary: {
        name: "Mary Chidziva",
        phone: "+263 78 234 5678"
      },
      treasurer: {
        name: "Peter Makoni",
        phone: "+263 78 345 6789"
      },
      deputy: {
        name: "Sarah Mukamuri",
        phone: "+263 78 456 7890"
      }
    },
    {
      id: 2,
      name: "Grace Chinembiri",
      clusterName: "Chiredzi East Cluster",
      location: {
        province: "Masvingo",
        district: "Chiredzi District"
      },
      contactInfo: {
        phone: "+263 78 354 6789",
        email: "grace.chin@yahoo.com"
      },
      members: 12,
      secretary: {
        name: "John Mpofu",
        phone: "+263 78 234 5679"
      },
      treasurer: {
        name: "Linda Nyoni",
        phone: "+263 78 345 6790"
      },
      deputy: {
        name: "Thomas Chin",
        phone: "+263 78 456 7891"
      }
    },
    {
      id: 3,
      name: "David Nyamande",
      clusterName: "Gokwe South Cluster",
      location: {
        province: "Midlands",
        district: "Gokwe District"
      },
      contactInfo: {
        phone: "+263 78 567 8910",
        email: "d.nyamande@gmail.com"
      },
      members: 6,
      secretary: {
        name: "Ruth Sibanda",
        phone: "+263 78 234 5680"
      },
      treasurer: {
        name: "Moses Dube",
        phone: "+263 78 345 6791"
      },
      deputy: {
        name: "Grace Nyama",
        phone: "+263 78 456 7892"
      }
    },
    {
      id: 4,
      name: "Tendai Marondera",
      clusterName: "Rusape Highland Cluster",
      location: {
        province: "Manicaland",
        district: "Makoni District"
      },
      contactInfo: {
        phone: "+263 78 789 0123",
        email: "tendai.maro@hotmail.com"
      },
      members: 2,
      secretary: {
        name: "Jane Mutasa",
        phone: "+263 78 234 5681"
      },
      treasurer: {
        name: "Paul Chieza",
        phone: "+263 78 345 6792"
      },
      deputy: {
        name: "Alice Maron",
        phone: "+263 78 456 7893"
      }
    },
    {
      id: 5,
      name: "Micheal Sibanda",
      clusterName: "Hwange West Cluster",
      location: {
        province: "Matabeleland North",
        district: "Hwange District"
      },
      contactInfo: {
        phone: "+263 78 901 2345",
        email: "m.sibanda@gmail.com"
      },
      members: 24,
      secretary: {
        name: "Betty Ndlovu",
        phone: "+263 78 234 5682"
      },
      treasurer: {
        name: "Simon Moyo",
        phone: "+263 78 345 6793"
      },
      deputy: {
        name: "Joyce Siban",
        phone: "+263 78 456 7894"
      }
    }
  ]

  useEffect(() => {
    // For now, use sample data
    setClusterLeaders(sampleClusterLeaders)
    calculateStats(sampleClusterLeaders)
    setLoading(false)
  }, [])

  const calculateStats = (leaders) => {
    const activeClusters = leaders.length
    const totalLeaders = leaders.length
    const totalMembers = leaders.reduce((sum, leader) => sum + leader.members, 0)
    const avgMembersPerCluster = totalMembers / activeClusters || 0
    const provincesCovered = new Set(leaders.map(leader => leader.location.province)).size

    setStats({
      activeClusters,
      totalLeaders,
      avgMembersPerCluster: Math.round(avgMembersPerCluster * 10) / 10,
      provincesCovered
    })
  }

  // Filter cluster leaders based on search term
  const filteredLeaders = clusterLeaders.filter(leader =>
    leader.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    leader.clusterName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    leader.location.province?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    leader.location.district?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-green-700">Loading cluster leaders...</h2>
          <p className="text-gray-600 mt-2">Fetching cluster leadership data...</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
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
            <Button className="bg-green-600 hover:bg-green-700 text-white whitespace-nowrap">
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
                            <Button className="mt-3 bg-green-600 hover:bg-green-700 text-white">
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
                          {leader.name}
                        </button>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium text-gray-900">{leader.clusterName}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-sm bg-gray-100 px-2 py-1 rounded text-center">
                            {leader.location.province}
                          </div>
                          <div className="text-xs text-gray-600 text-center">
                            {leader.location.district}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-sm font-medium text-green-600">
                            {leader.contactInfo.phone}
                          </div>
                          <div className="text-xs text-gray-600">
                            {leader.contactInfo.email}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="text-lg font-bold text-gray-800">
                          {leader.members}
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
                  <span>👥 Total Members: {filteredLeaders.reduce((sum, l) => sum + l.members, 0)}</span>
                  <span>🏛️ Provinces: {new Set(filteredLeaders.map(l => l.location.province)).size}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}

export default ClusterLeadersPage