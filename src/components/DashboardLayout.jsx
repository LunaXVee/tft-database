// src/components/DashboardLayout.jsx - With mobile navigation
import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useUser, UserButton } from '@clerk/clerk-react'
import { LayoutList,
  UserStar,
  Users,
  Plus,
  ChartColumn,
  CalendarDays,
  Download
 } from 'lucide-react';


export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user } = useUser()
  const location = useLocation()
  const userRole = user?.publicMetadata?.role || 'user'
  const userName = user?.firstName || 'User'

  // Navigation items based on role
  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutList, roles: ['admin', 'cluster_leader'] },
    { name: 'Members Overview', href: '/members', icon: UserStar, roles: ['admin', 'cluster_leader'] },
    { name: 'Cluster Leaders', href: '/cluster-leaders', icon: Users, roles: ['admin'] },
    { name: 'Add Member', href: '/add-member', icon: Plus, roles: ['admin', 'cluster_leader'] },
    { name: 'Analytics', href: '/analytics', icon: ChartColumn, roles: ['admin', 'cluster_leader'] },
    { name: 'Calendar', href: '/calendar', icon: CalendarDays, roles: ['admin', 'cluster_leader'] },
    { name: 'Export Data', href: '/export', icon: Download, roles: ['admin'] },
  ]

  // Filter navigation based on user role
  const allowedNavigation = navigation.filter(item => item.roles.includes(userRole))

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div 
            className="fixed inset-0 bg-gray-600 bg-opacity-75"
            onClick={() => setSidebarOpen(false)}
          ></div>
        </div>
      )}

      {/* Mobile sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white transform transition-transform duration-300 ease-in-out md:hidden ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col flex-grow pt-5 overflow-y-auto border-r">
          {/* Mobile Logo */}
          <div className="flex items-center justify-between flex-shrink-0 px-4">
            <div className="flex items-center">
              
            <div className="h-12 w-12  flex items-center justify-center">
          <img src="/leaf.svg" alt="TFT Logo" className="h-12 w-12  " />
            </div>
              <div className="ml-3">
              <p className="text-lg font-bold  text-gray-900">TFT Database</p>
              <p className="text-xs font-semibold  text-[#1B5E20]">The Farmers Talk</p>
                


              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              <span className="sr-only">Close sidebar</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Mobile Navigation */}
          <div className="mt-8 flex-grow flex flex-col">
            <nav className="flex-1 px-2 space-y-1">
              {allowedNavigation.map((item) => (
                <div key={item.name}>
                  {/* Add divider before Export Data */}
                  {item.name === 'Export Data' && (
                    <div className="border-t border-gray-200 my-2"></div>
                  )}

                  <Link
                    to={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`${
                      location.pathname === item.href
                        ? 'bg-green-100 text-green-900 border-r-2 border-green-500'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    } group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors`}
                  >
                    <item.icon className="mr-3 w-5 h-5" />
                    {item.name}
                  </Link>
                </div>
              ))}
            </nav>
          </div>

          {/* Mobile User Info */}
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

      {/* Desktop Sidebar - Fixed */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex flex-col flex-grow pt-5 bg-[#F6F6F6] overflow-y-auto border-r">
          {/* Logo */}
          
          <div className="flex items-center flex-shrink-0 px-4">
           
          <div className="h-12 w-12  flex items-center justify-center">
          <img src="/leaf.svg" alt="TFT Logo" className="h-12 w-12  " />
            </div>

            <div className="ml-3">
              <p className="text-lg font-bold  text-gray-900">TFT Database</p>
              <p className="text-xs font-semibold  text-[#1B5E20]">The Farmers Talk</p>
            </div>
          </div>

          {/* Navigation */}
          <div className="mt-8 flex-grow flex flex-col">
              <nav className="flex-1 px-2 space-y-1">
                {allowedNavigation.map((item) => (
                  <div key={item.name}>
                    {/* Add divider before Export Data */}
                    {item.name === 'Export Data' && (
                      <div className="border-t border-gray-200 my-2"></div>
                    )}

                    <Link
                      to={item.href}
                      className={`${
                        location.pathname === item.href
                          ? 'bg-[#E8F5E9] text-[#1B5E20] border-l-2 border-[#4CAF50]'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      } group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors`}
                    >
                      <item.icon className="mr-3 w-5 h-5" />
                      {item.name}
                    </Link>
                  </div>
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

      {/* Main Content - With left margin to account for fixed sidebar */}
      <div className="flex flex-col flex-1 md:ml-64">
        {/* Top Header - Sticky */}
        <div className="sticky top-0 z-30 bg-[#F6F6F6] shadow-sm border-b px-4 md:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {/* Mobile menu button */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 md:hidden mr-3"
              >
                <span className="sr-only">Open sidebar</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
             
                  {/* Logo and Company Name */}
    <div className="flex items-center space-x-3">
     
      <span className="text-xl md:text-2xl font-bold text-gray-400 hidden sm:block">TFT  </span>
    </div>
    {/* Breadcrumb separator */}
    <span className="text-gray-400 text-xl md:text-2xl font-bold hidden sm:block  ml-3"> › </span>
    

              <h1 className="text-xl md:text-2xl font-bold text-[#1B5E20]  ml-3">
                {navigation.find(item => item.href === location.pathname)?.name || 'Dashboard'}
              </h1>

            </div>
            <div className="flex items-center space-x-2 md:space-x-4">
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

        {/* Page Content - Scrollable */}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto  bg-[#EFF1F1]">
          {children}
        </main>
      </div>
    </div>
  )

  
}