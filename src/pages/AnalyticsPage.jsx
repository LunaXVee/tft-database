import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import DashboardLayout from "@/components/DashboardLayout"
import { supabase } from "@/lib/supabase"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts'
import { TrendingUp, Users, Building, MapPin, Calendar, Filter, Download, BarChart3 } from 'lucide-react'

// Colors for charts
const COLORS = ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444', '#06B6D4', '#84CC16']

function AnalyticsPage() {
  const [loading, setLoading] = useState(true)
  const [analytics, setAnalytics] = useState({
    totalMembers: 0,
    totalFarmArea: 0,
    activeContracts: 0,
    activeClusters: 0,
    provincesCovered: 0,
    newMembersThisMonth: 0
  })
  
  const [chartData, setChartData] = useState({
    membersByProvince: [],
    farmTypeDistribution: [],
    memberGrowthTrend: [],
    topClusters: []
  })
  
  const [filters, setFilters] = useState({
    view: 'Overview',
    category: 'All Data',
    timeframe: 'This Month'
  })

  useEffect(() => {
    fetchAnalyticsData()
  }, [])

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true)
      console.log("📊 Fetching analytics data...")

      // Fetch members data
      const { data: members, error: membersError } = await supabase
        .from('members')
        .select('*')

      // Fetch cluster leaders data
      const { data: clusters, error: clustersError } = await supabase
        .from('cluster_leaders')
        .select('*')
        .eq('status', 'Active')

      if (membersError) {
        console.error("❌ Error fetching members:", membersError)
        return
      }

      if (clustersError) {
        console.error("❌ Error fetching clusters:", clustersError)
        return
      }

      console.log("✅ Members data:", members)
      console.log("✅ Clusters data:", clusters)

      // Calculate basic metrics
      const totalMembers = members?.length || 0
      const totalFarmArea = members?.reduce((sum, member) => sum + (parseFloat(member.farm_size) || 0), 0) || 0
      const activeContracts = members?.filter(m => m.contract_status === 'Active').length || 0
      const activeClusters = clusters?.length || 0
      const provincesCovered = new Set(members?.map(m => m.province).filter(Boolean)).size || 0
      
      // Calculate new members this month (mock data for now)
      const newMembersThisMonth = Math.floor(totalMembers * 0.1) // 10% of total as new this month

      setAnalytics({
        totalMembers,
        totalFarmArea: Math.round(totalFarmArea * 10) / 10, // Round to 1 decimal
        activeContracts,
        activeClusters,
        provincesCovered,
        newMembersThisMonth
      })

      // Process data for charts
      processChartData(members, clusters)

    } catch (err) {
      console.error("❌ Analytics fetch error:", err)
    } finally {
      setLoading(false)
    }
  }

  const processChartData = (members, clusters) => {
    // Members by Province
    const provinceCount = {}
    members?.forEach(member => {
      if (member.province) {
        provinceCount[member.province] = (provinceCount[member.province] || 0) + 1
      }
    })
    
    const membersByProvince = Object.entries(provinceCount).map(([province, count]) => ({
      province: province.charAt(0).toUpperCase() + province.slice(1),
      members: count
    }))

    // Farm Type Distribution
    const farmTypeCount = {}
    members?.forEach(member => {
      if (member.farm_type) {
        const type = member.farm_type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
        farmTypeCount[type] = (farmTypeCount[type] || 0) + 1
      }
    })

    const farmTypeDistribution = Object.entries(farmTypeCount).map(([type, count]) => ({
      name: type,
      value: count,
      percentage: Math.round((count / members.length) * 100)
    }))

    // Member Growth Trend (mock data based on current members)
    const memberGrowthTrend = [
      { week: 'Week 1', members: Math.floor(members.length * 0.2) },
      { week: 'Week 2', members: Math.floor(members.length * 0.4) },
      { week: 'Week 3', members: Math.floor(members.length * 0.7) },
      { week: 'Week 4', members: members.length }
    ]

    // Top Performing Clusters
    const clusterMemberCount = {}
    members?.forEach(member => {
      if (member.cluster) {
        clusterMemberCount[member.cluster] = (clusterMemberCount[member.cluster] || 0) + 1
      }
    })

    const topClusters = clusters?.map(cluster => {
      const memberCount = clusterMemberCount[cluster.cluster_name] || 0
      const contractRate = memberCount > 0 ? Math.round((memberCount * 0.8) / memberCount * 100) : 0 // Mock 80% contract rate
      const totalArea = memberCount * 15.5 // Mock average 15.5 hectares per member
      
      return {
        clusterName: cluster.cluster_name,
        leader: `${cluster.first_name} ${cluster.last_name}`,
        province: cluster.province,
        members: memberCount,
        contracts: Math.floor(memberCount * 0.8), // Mock 80% have contracts
        contractRate: contractRate,
        totalArea: Math.round(totalArea * 10) / 10
      }
    }).sort((a, b) => b.members - a.members).slice(0, 4) || []

    setChartData({
      membersByProvince,
      farmTypeDistribution,
      memberGrowthTrend,
      topClusters
    })
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <BarChart3 className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <div className="text-2xl font-bold text-green-700 mb-2">Loading Analytics...</div>
            <div className="text-gray-600">Processing member and cluster data...</div>
          </div>
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
              <BarChart3 className="h-8 w-8 text-green-600" />
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">Analytics Dashboard</h1>
                <p className="text-gray-600">Comprehensive insights into TFT membership and performance</p>
              </div>
            </div>
            
            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700">View:</label>
                <select 
                  value={filters.view}
                  onChange={(e) => setFilters(prev => ({...prev, view: e.target.value}))}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
                >
                  <option value="Overview">Overview</option>
                  <option value="Members">Members</option>
                  <option value="Clusters">Clusters</option>
                </select>
              </div>
              
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700">Category:</label>
                <select 
                  value={filters.category}
                  onChange={(e) => setFilters(prev => ({...prev, category: e.target.value}))}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
                >
                  <option value="All Data">All Data</option>
                  <option value="Active Members">Active Members</option>
                  <option value="New Members">New Members</option>
                </select>
              </div>
              
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700">View:</label>
                <select 
                  value={filters.timeframe}
                  onChange={(e) => setFilters(prev => ({...prev, timeframe: e.target.value}))}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
                >
                  <option value="This Month">This Month</option>
                  <option value="Last Month">Last Month</option>
                  <option value="This Year">This Year</option>
                </select>
              </div>
              
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Apply Filters
              </Button>
            </div>
          </div>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="text-3xl font-bold text-gray-800">{analytics.totalMembers}</div>
            <div className="text-sm text-gray-600 mt-1">Total Members</div>
            <div className="text-xs text-green-600 mt-2">+12 this month</div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="text-3xl font-bold text-gray-800">{analytics.newMembersThisMonth}</div>
            <div className="text-sm text-gray-600 mt-1">New Members This Month</div>
            <div className="text-xs text-green-600 mt-2">+66.8% of members</div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="text-3xl font-bold text-gray-800">{analytics.totalFarmArea}</div>
            <div className="text-sm text-gray-600 mt-1">Total Farm Area(ha)</div>
            <div className="text-xs text-green-600 mt-2">+2.3% this year</div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="text-3xl font-bold text-gray-800">{analytics.activeContracts}</div>
            <div className="text-sm text-gray-600 mt-1">Active Contracts</div>
            <div className="text-xs text-green-600 mt-2">+66.8% of members</div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="text-3xl font-bold text-gray-800">{analytics.activeClusters}</div>
            <div className="text-sm text-gray-600 mt-1">Active Clusters</div>
            <div className="text-xs text-gray-600 mt-2">No change</div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="text-3xl font-bold text-gray-800">{analytics.provincesCovered}</div>
            <div className="text-sm text-gray-600 mt-1">Provinces Covered</div>
            <div className="text-xs text-green-600 mt-2">+1 new province</div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Members by Province */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Members by Province</h3>
              <span className="text-sm text-gray-500">Geographic Distribution</span>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData.membersByProvince}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="province" 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  fontSize={12}
                />
                <YAxis />
                <Tooltip />
                <Bar dataKey="members" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Farm Type Distribution */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Farm Type Distribution</h3>
              <span className="text-sm text-gray-500">Members Category</span>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData.farmTypeDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({name, percentage}) => `${name} ${percentage}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.farmTypeDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Member Growth Trend */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Members Growth Trend</h3>
            <span className="text-sm text-gray-500">Monthly Registration Data</span>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData.memberGrowthTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="members" 
                stroke="#10B981" 
                strokeWidth={3}
                dot={{ fill: '#10B981', strokeWidth: 2, r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Top Performing Clusters */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-800">Top Performing Clusters</h3>
            <span className="text-sm text-gray-500">By Member Count & Contract Rate</span>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="text-left p-4 font-medium text-gray-700">Cluster Name</th>
                  <th className="text-left p-4 font-medium text-gray-700">Leader</th>
                  <th className="text-left p-4 font-medium text-gray-700">Province</th>
                  <th className="text-center p-4 font-medium text-gray-700">Members</th>
                  <th className="text-center p-4 font-medium text-gray-700">Contracts</th>
                  <th className="text-center p-4 font-medium text-gray-700">Contract Rate</th>
                  <th className="text-center p-4 font-medium text-gray-700">Total Area (ha)</th>
                </tr>
              </thead>
              <tbody>
                {chartData.topClusters.map((cluster, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="p-4 font-medium text-gray-900">{cluster.clusterName}</td>
                    <td className="p-4 text-gray-700">{cluster.leader}</td>
                    <td className="p-4 text-gray-700">{cluster.province}</td>
                    <td className="p-4 text-center text-blue-600 font-medium">{cluster.members}</td>
                    <td className="p-4 text-center text-green-600 font-medium">{cluster.contracts}</td>
                    <td className="p-4 text-center">
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                        {cluster.contractRate}%
                      </span>
                    </td>
                    <td className="p-4 text-center text-gray-700 font-medium">{cluster.totalArea}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Export Actions */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Export Analytics</h3>
              <p className="text-gray-600 text-sm">Download comprehensive reports and analytics data</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export as CSV
              </Button>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export as PDF
              </Button>
              <Button className="bg-green-600 hover:bg-green-700">
                <Download className="h-4 w-4 mr-2" />
                Generate Report
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default AnalyticsPage