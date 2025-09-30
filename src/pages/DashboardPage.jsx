// src/pages/DashboardPage.jsx - FIXED (no DashboardLayout wrapper)
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"
import { useUser } from '@clerk/clerk-react'

import { 
  StickyNote,
  Layers2,
  SquareAsterisk,
  CopyCheck,
  FolderOpenDot,
  BookUser,
  CheckCheck,
  ChartArea,
  Tractor
 } from 'lucide-react';


function DashboardPage() {
  const navigate = useNavigate()

  const { user } = useUser()
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good Morning'
    if (hour < 17) return 'Good Afternoon'
    return 'Good Evening'
  }


  const [stats, setStats] = useState({
    totalMembers: 0,
    activeMembers: 0,
    newThisMonth: 0,
    totalFarmArea: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  const fetchDashboardStats = async () => {
    try {
      // Fetch all members
      const { data: members, error } = await supabase
        .from('members')
        .select('*')

      if (error) {
        console.error('Error fetching dashboard stats:', error)
        return
      }

      // Calculate stats
      const totalMembers = members?.length || 0
      const activeMembers = members?.filter(m => m.contract_status === 'Active').length || 0
      
      // Calculate new members this month
      const currentMonth = new Date().getMonth()
      const currentYear = new Date().getFullYear()
      const newThisMonth = members?.filter(m => {
        if (!m.created_at) return false
        const memberDate = new Date(m.created_at)
        return memberDate.getMonth() === currentMonth && memberDate.getFullYear() === currentYear
      }).length || 0

      // Calculate total farm area
      const totalFarmArea = members?.reduce((sum, member) => {
        const farmSize = parseFloat(member.farm_size) || 0
        return sum + farmSize
      }, 0) || 0

      setStats({
        totalMembers,
        activeMembers,
        newThisMonth,
        totalFarmArea: Math.round(totalFarmArea * 10) / 10 // Round to 1 decimal
      })

    } catch (err) {
      console.error('Error calculating dashboard stats:', err)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    {
      title: 'Total Members',
      value: stats.totalMembers,
      icon: BookUser,
      color: 'blue',
      description: 'Registered farmers'
    },
    {
      title: 'Active Contracts',
      value: stats.activeMembers,
      icon: CopyCheck,
      color: 'green',
      description: 'Currently active'
    },
    {
      title: 'New This Month',
      value: stats.newThisMonth,
      icon: FolderOpenDot,
      color: 'purple',
      description: 'Recent registrations'
    },
    {
      title: 'Total Farm Area',
      value: `${stats.totalFarmArea} ha`,
      icon: Tractor,
      color: 'orange',
      description: 'Combined hectares'
    }
  ]

  const quickActions = [
    {
      title: 'Add New Member',
      description: 'Register a new  farmer',
      icon: '➕',
      action: () => navigate('/add-member'),  // Fixed navigation paths
      color: 'green'
    },
    {
      title: 'View All Members',
      description: 'Browse member directory',
      icon: '👥',
      action: () => navigate('/members'),  // Fixed navigation paths
      color: 'blue'
    },
    {
      title: 'Export Data',
      description: 'Download member information',
      icon: '📄',
      action: () => navigate('/export'),  // Fixed navigation paths
      color: 'purple'
    }
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-2xl font-semibold text-gray-600 mb-2">Loading dashboard...</div>
          <div className="text-gray-500">Fetching member statistics</div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 ">

      {/* Welcome Message */}
      <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight text-gray-900">
          {getGreeting()}, {user?.firstName || 'User'}!
        </h1>
        <p className="text-muted-foreground mt-2 text-[#797E86]">
          Here's a snapshot of your TFT club members performance and key summaries.
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-[#E5E6E7] p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#21211D]">{stat.title}</p>
                <p className="text-2xl font-bold text-[#21211D] mt-1">{stat.value}</p>
                <p className="text-sm text-gray-500 mt-1">{stat.description}</p>
              </div>
              <stat.icon className="w-8 h-8 text-gray-600" />
              </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-[#f6f7f8] p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={action.action}
              className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-md transition-all text-left"
            >
              <div className="flex items-center space-x-3">
                <div className="text-2xl text-[#21211D]">{action.icon}</div>
                <div>
                  <h4 className="font-medium text-gray-800">{action.title}</h4>
                  <p className="text-sm text-gray-600">{action.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-[#E5E6E7] p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-3 p-3 bg-[#]  rounded-lg">
            <div className="text-green-600">  <CheckCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-[#21211D]">Database connected successfully</p>
              <p className="text-xs text-gray-500">All member data is synchronized</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-[#EFF1F1] rounded-lg">
            <div className="text-blue-600"> <ChartArea className="w-5 h-5" /></div>
            <div>
              <p className="text-sm font-medium text-[#21211D]">Dashboard statistics updated</p>
              <p className="text-xs text-gray-500">Real-time member counts and farm data</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage