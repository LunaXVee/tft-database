import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
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
      
      // Calculate REAL new members this month
      const currentDate = new Date()
      const currentMonth = currentDate.getMonth()
      const currentYear = currentDate.getFullYear()
      
      const newMembersThisMonth = members?.filter(member => {
        if (!member.created_at) return false
        const memberDate = new Date(member.created_at)
        return memberDate.getMonth() === currentMonth && memberDate.getFullYear() === currentYear
      }).length || 0

      // Calculate previous month for growth comparison
      const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1
      const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear
      
      const newMembersLastMonth = members?.filter(member => {
        if (!member.created_at) return false
        const memberDate = new Date(member.created_at)
        return memberDate.getMonth() === lastMonth && memberDate.getFullYear() === lastMonthYear
      }).length || 0

      setAnalytics({
        totalMembers,
        totalFarmArea: Math.round(totalFarmArea * 10) / 10,
        activeContracts,
        activeClusters,
        provincesCovered,
        newMembersThisMonth,
        newMembersLastMonth // For growth calculation
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

    // REAL Member Growth Trend based on created_at dates
    const memberGrowthTrend = []
    const currentDate = new Date()
    const currentMonth = currentDate.getMonth()
    const currentYear = currentDate.getFullYear()
    
    // Get data for last 4 weeks of current month
    for (let week = 1; week <= 4; week++) {
      const weekStart = new Date(currentYear, currentMonth, (week - 1) * 7 + 1)
      const weekEnd = new Date(currentYear, currentMonth, week * 7)
      
      const weekMembers = members?.filter(member => {
        if (!member.created_at) return false
        const memberDate = new Date(member.created_at)
        return memberDate >= weekStart && memberDate <= weekEnd
      }).length || 0
      
      memberGrowthTrend.push({
        week: `Week ${week}`,
        members: weekMembers
      })
    }

    // REAL Top Performing Clusters with actual data
    const clusterMemberCount = {}
    const clusterFarmArea = {}
    const clusterActiveContracts = {}
    
    members?.forEach(member => {
      if (member.cluster) {
        // Count members
        clusterMemberCount[member.cluster] = (clusterMemberCount[member.cluster] || 0) + 1
        
        // Sum farm area
        clusterFarmArea[member.cluster] = (clusterFarmArea[member.cluster] || 0) + (parseFloat(member.farm_size) || 0)
        
        // Count active contracts
        if (member.contract_status === 'Active') {
          clusterActiveContracts[member.cluster] = (clusterActiveContracts[member.cluster] || 0) + 1
        }
      }
    })

    const topClusters = clusters?.map(cluster => {
      const memberCount = clusterMemberCount[cluster.cluster_name] || 0
      const activeContracts = clusterActiveContracts[cluster.cluster_name] || 0
      const contractRate = memberCount > 0 ? Math.round((activeContracts / memberCount) * 100) : 0
      const totalArea = clusterFarmArea[cluster.cluster_name] || 0
      
      return {
        clusterName: cluster.cluster_name,
        leader: `${cluster.first_name} ${cluster.last_name}`,
        province: cluster.province,
        members: memberCount,
        contracts: activeContracts,
        contractRate: contractRate,
        totalArea: Math.round(totalArea * 10) / 10
      }
    })
    .filter(cluster => cluster.members > 0) // Only show clusters with members
    .sort((a, b) => b.members - a.members) // Sort by member count
    .slice(0, 4) || [] // Top 4 clusters

    setChartData({
      membersByProvince,
      farmTypeDistribution,
      memberGrowthTrend,
      topClusters
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <BarChart3 className="h-12 w-12 text-green-600 mx-auto mb-4" />
          <div className="text-xl md:text-2xl font-bold text-green-700 mb-2">Loading Analytics...</div>
          <div className="text-gray-600">Processing member and cluster data...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header - Mobile Optimized */}
      <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
        <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
          <div className="flex items-center space-x-3">
            <BarChart3 className="h-6 w-6 md:h-8 md:w-8 text-green-600" />
            <div>
              <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-800">Analytics Dashboard</h1>
              <p className="text-gray-600 text-sm md:text-base">Comprehensive insights into TFT membership and performance</p>
            </div>
          </div>
          
          {/* Filters - Responsive */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <select 
              value={filters.view}
              onChange={(e) => setFilters(prev => ({...prev, view: e.target.value}))}
              className="px-2 md:px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
            >
              <option value="Overview">Overview</option>
              <option value="Members">Members</option>
              <option value="Clusters">Clusters</option>
            </select>
            
            <select 
              value={filters.timeframe}
              onChange={(e) => setFilters(prev => ({...prev, timeframe: e.target.value}))}
              className="px-2 md:px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
            >
              <option value="This Month">This Month</option>
              <option value="Last Month">Last Month</option>
              <option value="This Year">This Year</option>
            </select>
          </div>
        </div>
      </div>

      {/* Key Metrics Cards - Mobile Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 md:gap-4">
        <div className="bg-white p-3 md:p-6 rounded-lg shadow-md text-center">
          <div className="text-xl md:text-3xl font-bold text-gray-800">{analytics.totalMembers}</div>
          <div className="text-xs md:text-sm text-gray-600 mt-1">Total Members</div>
          <div className="text-xs text-green-600 mt-1 md:mt-2">
            {analytics.newMembersThisMonth > 0 ? `+${analytics.newMembersThisMonth} this month` : 'No new members'}
          </div>
        </div>
        
        <div className="bg-white p-3 md:p-6 rounded-lg shadow-md text-center">
          <div className="text-xl md:text-3xl font-bold text-gray-800">{analytics.newMembersThisMonth}</div>
          <div className="text-xs md:text-sm text-gray-600 mt-1">New This Month</div>
          <div className="text-xs text-green-600 mt-1 md:mt-2">
            {analytics.newMembersLastMonth !== undefined && analytics.newMembersLastMonth > 0
              ? `${analytics.newMembersThisMonth > analytics.newMembersLastMonth ? '+' : ''}${((analytics.newMembersThisMonth - analytics.newMembersLastMonth) / analytics.newMembersLastMonth * 100).toFixed(1)}% from last month`
              : 'vs last month'
            }
          </div>
        </div>
        
        <div className="bg-white p-3 md:p-6 rounded-lg shadow-md text-center">
          <div className="text-xl md:text-3xl font-bold text-gray-800">{analytics.totalFarmArea}</div>
          <div className="text-xs md:text-sm text-gray-600 mt-1">Farm Area (ha)</div>
          <div className="text-xs text-green-600 mt-1 md:mt-2">
            {analytics.totalMembers > 0 ? `Avg: ${(analytics.totalFarmArea / analytics.totalMembers).toFixed(1)} ha/member` : 'No data'}
          </div>
        </div>
        
        <div className="bg-white p-3 md:p-6 rounded-lg shadow-md text-center">
          <div className="text-xl md:text-3xl font-bold text-gray-800">{analytics.activeContracts}</div>
          <div className="text-xs md:text-sm text-gray-600 mt-1">Active Contracts</div>
          <div className="text-xs text-green-600 mt-1 md:mt-2">
            {analytics.totalMembers > 0 ? `${((analytics.activeContracts / analytics.totalMembers) * 100).toFixed(1)}% of members` : 'No data'}
          </div>
        </div>
        
        <div className="bg-white p-3 md:p-6 rounded-lg shadow-md text-center">
          <div className="text-xl md:text-3xl font-bold text-gray-800">{analytics.activeClusters}</div>
          <div className="text-xs md:text-sm text-gray-600 mt-1">Active Clusters</div>
          <div className="text-xs text-gray-600 mt-1 md:mt-2">
            {analytics.totalMembers > 0 && analytics.activeClusters > 0 
              ? `Avg: ${(analytics.totalMembers / analytics.activeClusters).toFixed(1)} members/cluster`
              : 'No data'
            }
          </div>
        </div>
        
        <div className="bg-white p-3 md:p-6 rounded-lg shadow-md text-center">
          <div className="text-xl md:text-3xl font-bold text-gray-800">{analytics.provincesCovered}</div>
          <div className="text-xs md:text-sm text-gray-600 mt-1">Provinces</div>
          <div className="text-xs text-green-600 mt-1 md:mt-2">
            {analytics.provincesCovered > 0 ? `${((analytics.provincesCovered / 10) * 100).toFixed(0)}% coverage` : 'No coverage'}
          </div>
        </div>
      </div>

      {/* Charts Section - Mobile Responsive */}
      <div className="space-y-4 md:space-y-6">
        {/* Members by Province */}
        <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base md:text-lg font-semibold text-gray-800">Members by Province</h3>
            <span className="text-xs md:text-sm text-gray-500">Geographic Distribution</span>
          </div>
          <div className="h-64 md:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData.membersByProvince}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="province" 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  fontSize={10}
                  interval={0}
                />
                <YAxis fontSize={10} />
                <Tooltip />
                <Bar dataKey="members" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Farm Type Distribution */}
        <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base md:text-lg font-semibold text-gray-800">Farm Type Distribution</h3>
            <span className="text-xs md:text-sm text-gray-500">Members Category</span>
          </div>
          <div className="h-64 md:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData.farmTypeDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({name, percentage}) => `${name} ${percentage}%`}
                  outerRadius={window.innerWidth < 768 ? 60 : 80}
                  fill="#8884d8"
                  dataKey="value"
                  fontSize={window.innerWidth < 768 ? 10 : 12}
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
        <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base md:text-lg font-semibold text-gray-800">Member Growth Trend</h3>
            <span className="text-xs md:text-sm text-gray-500">Monthly Registration Data</span>
          </div>
          <div className="h-64 md:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData.memberGrowthTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" fontSize={10} />
                <YAxis fontSize={10} />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="members" 
                  stroke="#10B981" 
                  strokeWidth={2}
                  dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top Performing Clusters - Mobile Cards / Desktop Table */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-4 md:p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-base md:text-lg font-semibold text-gray-800">Top Performing Clusters</h3>
            <span className="text-xs md:text-sm text-gray-500">By Member Count & Contract Rate</span>
          </div>
        </div>
        
        {/* Mobile Cards View */}
        <div className="block md:hidden">
          {chartData.topClusters.map((cluster, index) => (
            <div key={index} className="border-b border-gray-200 p-4 last:border-b-0">
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-gray-900">{cluster.clusterName}</h4>
                    <p className="text-sm text-gray-600">{cluster.leader}</p>
                    <p className="text-xs text-gray-500">{cluster.province}</p>
                  </div>
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                    {cluster.contractRate}%
                  </span>
                </div>
                
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div>
                    <div className="text-lg font-bold text-blue-600">{cluster.members}</div>
                    <div className="text-xs text-gray-600">Members</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-green-600">{cluster.contracts}</div>
                    <div className="text-xs text-gray-600">Contracts</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-gray-700">{cluster.totalArea}</div>
                    <div className="text-xs text-gray-600">Hectares</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
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

      {/* Export Actions - Mobile Optimized */}
      <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div>
            <h3 className="text-base md:text-lg font-semibold text-gray-800">Export Analytics</h3>
            <p className="text-gray-600 text-sm">Download comprehensive reports and analytics data</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <Button variant="outline" className="w-full sm:w-auto">
              <Download className="h-4 w-4 mr-2" />
              CSV
            </Button>
            <Button variant="outline" className="w-full sm:w-auto">
              <Download className="h-4 w-4 mr-2" />
              PDF
            </Button>
            <Button className="bg-green-600 hover:bg-green-700 w-full sm:w-auto">
              <Download className="h-4 w-4 mr-2" />
              Report
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AnalyticsPage