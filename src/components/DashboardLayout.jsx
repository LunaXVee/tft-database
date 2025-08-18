import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"

function DashboardLayout({ children }) {
  const navigate = useNavigate()
  const location = useLocation()
  
  // Navigation items for the sidebar
  const navigationItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: '📊',
      path: '/dashboard'
    },
    {
      id: 'members-overview',
      label: 'Members Overview',
      icon: '👥',
      path: '/dashboard/members'
    },
    {
      id: 'add-member',
      label: 'Add Member',
      icon: '➕',
      path: '/dashboard/add-member'
    },
    {
      id: 'export-data',
      label: 'Export Data',
      icon: '📄',
      path: '/dashboard/export'
    }
  ]

  const isActiveRoute = (path) => {
    return location.pathname === path || 
           (path === '/dashboard/members' && location.pathname === '/dashboard')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg flex flex-col">
        {/* Logo/Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="bg-green-600 p-2 rounded-lg">
              <span className="text-white font-bold text-lg">🚜</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">TFT</h1>
              <p className="text-sm text-gray-600">The Farmers Talk</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <div className="space-y-2">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  isActiveRoute(item.path)
                    ? 'bg-green-100 text-green-800 font-medium'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <div className="text-sm text-gray-500">
            <p>Member Database</p>
            <p>v1.0.0</p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-gray-800">
                {navigationItems.find(item => isActiveRoute(item.path))?.label || 'Dashboard'}
              </h2>
              <p className="text-gray-600 mt-1">
                Manage your farm members
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">
                Welcome back, Admin
              </div>
              <Button 
                variant="outline"
                onClick={() => navigate('/')}
              >
                Back to Home
              </Button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout