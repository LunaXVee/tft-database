import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"

function MemberDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [member, setMember] = useState(null)
  const [loading, setLoading] = useState(true)
  
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
        .single() // Get just one record

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

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <h2 className="text-2xl font-bold text-green-700 mb-4">Loading member details...</h2>
            <p className="text-gray-600">Please wait while we fetch the member information.</p>
          </div>
        </div>
      </div>
    )
  }

  // If member not found, show error
  if (!member) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Member Not Found</h2>
            <p className="text-gray-600 mb-4">The member you're looking for doesn't exist.</p>
            <Button onClick={() => navigate('/members')}>
              ← Back to Members Directory
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button 
            variant="outline" 
            onClick={() => navigate('/members')}
            className="mb-4"
          >
            ← Back to Members Directory
          </Button>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-green-700">
                {member.first_name} {member.last_name}
              </h1>
              <p className="text-gray-600 mt-2">Member ID: #{member.id}</p>
            </div>
            <div className="space-x-3">
              <Button 
                variant="outline"
                onClick={() => navigate(`/member/${member.id}/edit`)}
              >
                Edit Member
              </Button>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
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
            <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
              Personal Information
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Full Name:</span>
                <span className="font-medium">{member.first_name} {member.middle_name && `${member.middle_name} `}{member.last_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">ID Number:</span>
                <span className="font-medium">{member.id_number || 'Not provided'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Date of Birth:</span>
                <span className="font-medium">{member.date_of_birth || 'Not provided'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Gender:</span>
                <span className="font-medium capitalize">{member.gender || 'Not provided'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Mobile Phone:</span>
                <span className="font-medium">{member.mobile_phone_1 || 'Not provided'}</span>
              </div>
              {member.mobile_phone_2 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Mobile Phone 2:</span>
                  <span className="font-medium">{member.mobile_phone_2}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Email:</span>
                <span className="font-medium">{member.email_address || 'Not provided'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Member Since:</span>
                <span className="font-medium">{member.year_joined}</span>
              </div>
            </div>
          </div>

          {/* Location Information Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
              Location Information
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Province:</span>
                <span className="font-medium capitalize">{member.province || 'Not provided'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Constituency:</span>
                <span className="font-medium">{member.constituency || 'Not provided'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">District:</span>
                <span className="font-medium">{member.district || 'Not provided'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Ward:</span>
                <span className="font-medium">{member.ward || 'Not provided'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Village:</span>
                <span className="font-medium">{member.village || 'Not provided'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Cluster:</span>
                <span className="font-medium">{member.cluster || 'Not provided'}</span>
              </div>
            </div>
          </div>

          {/* Farm Information Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
              Farm Information
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Farm Type:</span>
                <span className="font-medium capitalize">{member.farm_type?.replace('_', ' ') || 'Not provided'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Farm Name:</span>
                <span className="font-medium">{member.farm_name || 'Not provided'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Farm Size:</span>
                <span className="font-medium">{member.farm_size ? `${member.farm_size} hectares` : 'Not provided'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Primary Crop:</span>
                <span className="font-medium">Tobacco</span>
              </div>
            </div>
          </div>

          {/* Contract Status Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
              Contract Status
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className={`font-medium ${
                  member.contract_status === 'Active' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {member.contract_status}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Year Joined:</span>
                <span className="font-medium">{member.year_joined}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Created:</span>
                <span className="font-medium">
                  {member.created_at ? new Date(member.created_at).toLocaleDateString() : 'Unknown'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-center space-x-4">
          <Button variant="outline" onClick={() => navigate('/members')}>
            Back to Directory
          </Button>
          <Button onClick={() => navigate(`/member/${member.id}/edit`)}>
            Edit Member Details
          </Button>
          <Button variant="outline">
            Export Member Data
          </Button>
        </div>
      </div>
    </div>
  )
}

export default MemberDetailsPage