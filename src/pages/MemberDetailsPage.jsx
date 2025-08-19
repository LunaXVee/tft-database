import { useState, useEffect } from "react"
import { useParams, useNavigate, useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"
import DashboardLayout from "@/components/DashboardLayout"

function MemberDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const [member, setMember] = useState(null)
  const [loading, setLoading] = useState(true)
  
  // Check if we came from dashboard (most common case)
  const isDashboardMode = location.pathname.startsWith('/dashboard') || 
                          document.referrer.includes('/dashboard')
  
  // Fetch member data when page loads
  useEffect(() => {
    fetchMember()
  }, [id])

  const fetchMember = async () => {
    try {
      console.log("📥 Fetching member details for ID:", id)
      
      const { data, error } = await supabase
        .from('members')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        console.error("❌ Error fetching member:", error)
        setMember(null)
        return
      }

      console.log("✅ Member details loaded:", data)
      setMember(data)
      
    } catch (err) {
      console.error("❌ Fetch error:", err)
      setMember(null)
    } finally {
      setLoading(false)
    }
  }

  // Loading component
  const LoadingState = () => (
    <div className="flex items-center justify-center py-12">
      <div className="text-center">
        <div className="text-2xl font-bold text-green-700 mb-4">Loading member details...</div>
        <div className="text-gray-600">Fetching member information from database...</div>
      </div>
    </div>
  )

  // Error component
  const ErrorState = () => (
    <div className="bg-white rounded-lg shadow-md p-8 text-center">
      <div className="text-6xl mb-4">❌</div>
      <h2 className="text-2xl font-bold text-red-600 mb-4">Member Not Found</h2>
      <p className="text-gray-600 mb-6">The member you're looking for doesn't exist or may have been deleted.</p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button 
          onClick={() => navigate(isDashboardMode ? '/dashboard/members' : '/members')}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          👥 Back to Members Directory
        </Button>
        <Button 
          variant="outline"
          onClick={() => navigate(isDashboardMode ? '/dashboard' : '/')}
        >
          🏠 Go to Dashboard
        </Button>
      </div>
    </div>
  )

  // Member details content
  const MemberDetailsContent = () => (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="bg-green-100 p-3 rounded-full">
              <span className="text-2xl">👤</span>
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">
                {member.first_name} {member.middle_name && `${member.middle_name} `}{member.last_name}
              </h1>
              <p className="text-gray-600 mt-1">Member ID: #{member.id}</p>
              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                <span>📱 {member.mobile_phone_1}</span>
                {member.email_address && <span>📧 {member.email_address}</span>}
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              onClick={() => navigate(`/member/${member.id}/edit`)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              ✏️ Edit Member
            </Button>
            <span className={`px-4 py-2 rounded-full text-sm font-medium text-center ${
              member.contract_status === 'Active' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {member.contract_status}
            </span>
          </div>
        </div>
      </div>

      {/* Member Details Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Information Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2 flex items-center">
            <span className="mr-2">👤</span>
            Personal Information
          </h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-gray-600 block">Full Name</span>
                <span className="font-medium text-gray-900">
                  {member.first_name} {member.middle_name && `${member.middle_name} `}{member.last_name}
                </span>
              </div>
              <div>
                <span className="text-sm text-gray-600 block">ID Number</span>
                <span className="font-medium text-gray-900">{member.id_number || 'Not provided'}</span>
              </div>
              <div>
                <span className="text-sm text-gray-600 block">Date of Birth</span>
                <span className="font-medium text-gray-900">{member.date_of_birth || 'Not provided'}</span>
              </div>
              <div>
                <span className="text-sm text-gray-600 block">Gender</span>
                <span className="font-medium text-gray-900 capitalize">{member.gender || 'Not provided'}</span>
              </div>
              <div>
                <span className="text-sm text-gray-600 block">Mobile Phone</span>
                <span className="font-medium text-gray-900">{member.mobile_phone_1 || 'Not provided'}</span>
              </div>
              {member.mobile_phone_2 && (
                <div>
                  <span className="text-sm text-gray-600 block">Mobile Phone 2</span>
                  <span className="font-medium text-gray-900">{member.mobile_phone_2}</span>
                </div>
              )}
            </div>
            <div>
              <span className="text-sm text-gray-600 block">Email Address</span>
              <span className="font-medium text-gray-900">{member.email_address || 'Not provided'}</span>
            </div>
          </div>
        </div>

        {/* Location Information Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2 flex items-center">
            <span className="mr-2">📍</span>
            Location Information
          </h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-gray-600 block">Province</span>
                <span className="font-medium text-gray-900 capitalize">{member.province || 'Not provided'}</span>
              </div>
              <div>
                <span className="text-sm text-gray-600 block">District</span>
                <span className="font-medium text-gray-900">{member.district || 'Not provided'}</span>
              </div>
              <div>
                <span className="text-sm text-gray-600 block">Constituency</span>
                <span className="font-medium text-gray-900">{member.constituency || 'Not provided'}</span>
              </div>
              <div>
                <span className="text-sm text-gray-600 block">Ward</span>
                <span className="font-medium text-gray-900">{member.ward || 'Not provided'}</span>
              </div>
              <div>
                <span className="text-sm text-gray-600 block">Village</span>
                <span className="font-medium text-gray-900">{member.village || 'Not provided'}</span>
              </div>
              <div>
                <span className="text-sm text-gray-600 block">Cluster</span>
                <span className="font-medium text-gray-900">{member.cluster || 'Not provided'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Farm Information Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2 flex items-center">
            <span className="mr-2">🚜</span>
            Farm Information
          </h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-gray-600 block">Farm Type</span>
                <span className="font-medium text-gray-900 capitalize">
                  {member.farm_type?.replace('_', ' ') || 'Not provided'}
                </span>
              </div>
              <div>
                <span className="text-sm text-gray-600 block">Farm Size</span>
                <span className="font-medium text-gray-900">
                  {member.farm_size ? `${member.farm_size} hectares` : 'Not provided'}
                </span>
              </div>
              <div>
                <span className="text-sm text-gray-600 block">Farm Name</span>
                <span className="font-medium text-gray-900">{member.farm_name || 'Not provided'}</span>
              </div>
              <div>
                <span className="text-sm text-gray-600 block">Primary Crop</span>
                <span className="font-medium text-gray-900">Tobacco</span>
              </div>
            </div>
          </div>
        </div>

        {/* Contract Status Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2 flex items-center">
            <span className="mr-2">📋</span>
            Membership Status
          </h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-gray-600 block">Contract Status</span>
                <span className={`font-medium ${
                  member.contract_status === 'Active' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {member.contract_status}
                </span>
              </div>
              <div>
                <span className="text-sm text-gray-600 block">Year Joined</span>
                <span className="font-medium text-gray-900">{member.year_joined}</span>
              </div>
              <div>
                <span className="text-sm text-gray-600 block">Registration Date</span>
                <span className="font-medium text-gray-900">
                  {member.created_at ? new Date(member.created_at).toLocaleDateString() : 'Unknown'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Actions</h3>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            onClick={() => navigate(isDashboardMode ? '/dashboard/members' : '/members')}
            variant="outline"
            className="flex-1 sm:flex-none"
          >
            👥 Back to Directory
          </Button>
          <Button 
            onClick={() => navigate(`/member/${member.id}/edit`)}
            className="bg-blue-600 hover:bg-blue-700 text-white flex-1 sm:flex-none"
          >
            ✏️ Edit Details
          </Button>
          <Button 
            variant="outline"
            onClick={() => navigate(isDashboardMode ? '/dashboard/export' : '/export')}
            className="flex-1 sm:flex-none"
          >
            📄 Export Data
          </Button>
        </div>
      </div>
    </div>
  )

  // Render based on dashboard mode
  if (isDashboardMode) {
    return (
      <DashboardLayout>
        {loading ? <LoadingState /> : member ? <MemberDetailsContent /> : <ErrorState />}
      </DashboardLayout>
    )
  }

  // Legacy standalone mode (for backward compatibility)
  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {loading ? <LoadingState /> : member ? <MemberDetailsContent /> : <ErrorState />}
      </div>
    </div>
  )
}

export default MemberDetailsPage