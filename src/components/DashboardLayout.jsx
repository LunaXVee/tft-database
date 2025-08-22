// src/components/DashboardLayout.jsx - Correct layout component
import { useUser, UserButton } from '@clerk/clerk-react'
import { Link, useLocation } from 'react-router-dom'

export default function DashboardLayout({ children }) {
  const { user } = useUser()
  const location = useLocation()
  const userRole = user?.publicMetadata?.role || 'user'
  const userName = user?.firstName || 'User'

  // Navigation items based on role
  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: '📊', roles: ['admin', 'cluster_leader'] },
    { name: 'Members Overview', href: '/members', icon: '👥', roles: ['admin', 'cluster_leader'] },
    { name: 'Cluster Leaders', href: '/cluster-leaders', icon: '👨‍💼', roles: ['admin'] },
    { name: 'Add Member', href: '/add-member', icon: '➕', roles: ['admin', 'cluster_leader'] },
    { name: 'Analytics', href: '/analytics', icon: '📈', roles: ['admin', 'cluster_leader'] },
    { name: 'Calendar', href: '/calendar', icon: '📅', roles: ['admin', 'cluster_leader'] },
    { name: 'Export Data', href: '/export', icon: '💾', roles: ['admin'] },
  ]

  // Filter navigation based on user role
  const allowedNavigation = navigation.filter(item => item.roles.includes(userRole))

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col">
        <div className="flex flex-col flex-grow pt-5 bg-white overflow-y-auto border-r">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0 px-4">
            <div className="h-8 w-8 bg-green-600 rounded flex items-center justify-center">
              <span className="text-white font-bold">TFT</span>
            </div>
            <div className="ml-3">
              <p className="text-lg font-semibold text-gray-900">TFT Database</p>
              <p className="text-xs text-gray-500">The Farmers Talk Portal</p>
            </div>
          </div>

          {/* Navigation */}
          <div className="mt-8 flex-grow flex flex-col">
            <nav className="flex-1 px-2 space-y-1">
              {allowedNavigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`${
                    location.pathname === item.href
                      ? 'bg-green-100 text-green-900 border-r-2 border-green-500'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  } group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors`}
                >
                  <span className="mr-3 text-lg">{item.icon}</span>
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* User Info */}
          <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
            <div className="flex items-center w-full">
              <div className="flex-shrink-0">
                <UserButton 
                  appearance={{
                    elements: {
                      avatarBox: "w-8 h-8"
                    }
                  }}
                />
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-900">{userName}</p>
                <p className="text-xs text-gray-500 capitalize">{userRole}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1">
        {/* Top Header */}
        <div className="bg-white shadow-sm border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {navigation.find(item => item.href === location.pathname)?.name || 'Dashboard'}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium capitalize">
                {userRole.replace('_', ' ')}
              </span>
              <UserButton 
                appearance={{
                  elements: {
                    avatarBox: "w-8 h-8"
                  }
                }}
                afterSignOutUrl="/sign-in"
              />
            </div>
          </div>
        </div>

        {/* Page Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}