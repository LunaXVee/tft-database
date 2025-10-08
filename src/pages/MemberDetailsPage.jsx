import { useState, useEffect } from "react"
import { useParams, useNavigate, useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"
import DashboardLayout from "@/components/DashboardLayout"
import { 
  FileText, 
  FlaskConical, 
  Calendar, 
  User as UserIcon, 
  TrendingUp,
  Users,
  Home,
  Phone,
  Mail,
  MapPin,
  Tractor,
  FileCheck,
  Edit,
  Download,
  Trash2
} from "lucide-react"

function MemberDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const [member, setMember] = useState(null)
  const [soilSamples, setSoilSamples] = useState([])
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

      // Fetch soil samples for this member
      const { data: samplesData, error: samplesError } = await supabase
        .from('soil_samples')
        .select('*')
        .eq('member_id', id)
        .order('sample_date', { ascending: false })

      if (samplesError) {
        console.error("❌ Error fetching soil samples:", samplesError)
      } else {
        console.log("✅ Soil samples loaded:", samplesData)
        setSoilSamples(samplesData || [])
      }
      
    } catch (err) {
      console.error("❌ Fetch error:", err)
      setMember(null)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteSample = async (sampleId) => {
    if (!confirm('Are you sure you want to delete this soil sample? This action cannot be undone.')) {
      return
    }
  
    try {
      console.log("🗑️ Deleting soil sample:", sampleId)
      
      const { error } = await supabase
        .from('soil_samples')
        .delete()
        .eq('id', sampleId)
  
      if (error) {
        console.error("❌ Delete error:", error)
        alert("Failed to delete soil sample: " + error.message)
        return
      }
  
      console.log("✅ Soil sample deleted successfully")
      alert("Soil sample deleted successfully!")
      
      // Refresh the soil samples list
      setSoilSamples(soilSamples.filter(s => s.id !== sampleId))
      
    } catch (err) {
      console.error("❌ Error:", err)
      alert("An error occurred while deleting.")
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
      <div className="mb-4">
        <UserIcon className="h-24 w-24 mx-auto text-red-500" />
      </div>
      <h2 className="text-2xl font-bold text-red-600 mb-4">Member Not Found</h2>
      <p className="text-gray-600 mb-6">The member you're looking for doesn't exist or may have been deleted.</p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button 
          onClick={() => navigate(isDashboardMode ? '/dashboard/members' : '/members')}
          className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
        >
          <Users className="h-4 w-4" />
          Back to Members Directory
        </Button>
        <Button 
          variant="outline"
          onClick={() => navigate(isDashboardMode ? '/dashboard' : '/')}
          className="flex items-center gap-2"
        >
          <Home className="h-4 w-4" />
          Go to Dashboard
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
            <div className="bg-yellow-100 p-3 rounded-full">
              <UserIcon className="h-8 w-8 text-yellow-600" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">
                {member.first_name} {member.middle_name && `${member.middle_name} `}{member.last_name}
              </h1>
              <p className="text-gray-600 mt-1">Member ID: #{member.id}</p>
              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Phone className="h-3 w-3" />
                  {member.mobile_phone_1}
                </span>
                {member.email_address && (
                  <span className="flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    {member.email_address}
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              onClick={() => navigate(`/member/${member.id}/edit`)}
              className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
            >
              <Edit className="h-4 w-4" />
              Edit Member
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
            <UserIcon className="h-5 w-5 mr-2 text-green-600" />
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
            <MapPin className="h-5 w-5 mr-2 text-green-600" />
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
            <Tractor className="h-5 w-5 mr-2 text-green-600" />
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
            <FileCheck className="h-5 w-5 mr-2 text-green-600" />
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

      {/* Soil Samples Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4 border-b pb-3">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center">
            <FlaskConical className="h-5 w-5 mr-2 text-green-600" />
            Soil Sample History
          </h2>
          <Button 
            size="sm"
            onClick={() => navigate('/add-soil-sample', {
              state: { memberId: member.id }
            })}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            + Add Soil Sample
          </Button>
        </div>

        {soilSamples.length === 0 ? (
          <div className="text-center py-8">
            <FlaskConical className="h-16 w-16 mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500 mb-4">No soil samples recorded yet.</p>
            <Button 
              size="sm"
              variant="outline"
              onClick={() => navigate('/add-soil-sample', {
                state: { memberId: member.id }
              })}
            >
              Upload First Sample
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {soilSamples.map((sample) => (
              <div 
                key={sample.id} 
                className="border rounded-lg p-4 hover:bg-gray-50 transition"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                  <div className="flex-1 w-full">
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <span className="font-medium text-lg flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        {new Date(sample.sample_date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                      {sample.lab_reference && (
                        <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          Lab Ref: {sample.lab_reference}
                        </span>
                      )}
                      {sample.soil_health_rating && (
                        <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
                          sample.soil_health_rating === 'good' 
                            ? 'bg-green-100 text-green-800'
                            : sample.soil_health_rating === 'fair'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          <TrendingUp className="h-3 w-3" />
                          {sample.soil_health_rating.charAt(0).toUpperCase() + sample.soil_health_rating.slice(1)}
                        </span>
                      )}
                    </div>

                    {(sample.ph_level || sample.lime_recommendation) && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm mb-3 bg-gray-50 p-3 rounded">
                        {sample.ph_level && (
                          <div>
                            <span className="text-gray-600 block text-xs">pH Level</span>
                            <span className="font-medium text-gray-900">{sample.ph_level}</span>
                          </div>
                        )}
                        {sample.lime_recommendation && (
                          <div>
                            <span className="text-gray-600 block text-xs">Lime Needed</span>
                            <span className="font-medium text-gray-900">{sample.lime_recommendation} kg/ha</span>
                          </div>
                        )}
                        {sample.soil_health_rating && (
                          <div>
                            <span className="text-gray-600 block text-xs">Overall Health</span>
                            <span className="font-medium text-gray-900 capitalize">{sample.soil_health_rating}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {sample.notes && (
                      <div className="bg-blue-50 border-l-4 border-blue-400 p-3 mb-3">
                        <p className="text-sm text-gray-700">
                          <span className="font-medium">Notes:</span> {sample.notes}
                        </p>
                      </div>
                    )}

                    <p className="text-xs text-gray-400 flex items-center gap-1">
                      <UserIcon className="h-3 w-3" />
                      Uploaded {new Date(sample.created_at).toLocaleDateString()} by {sample.uploaded_by || 'Unknown'}
                    </p>
                  </div>

                  <div className="flex sm:flex-col gap-2 w-full sm:w-auto">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => window.open(sample.file_url, '_blank')}
                      className="flex-1 sm:flex-none flex items-center gap-2"
                    >
                      <FileText className="h-4 w-4" />
                      View Report
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDeleteSample(sample.id)}
                      className="flex-1 sm:flex-none text-red-600 hover:text-red-700 flex items-center gap-2"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Actions</h3>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            onClick={() => navigate(isDashboardMode ? '/dashboard/members' : '/members')}
            variant="outline"
            className="flex-1 sm:flex-none flex items-center gap-2"
          >
            <Users className="h-4 w-4" />
            Back to Directory
          </Button>
          <Button 
            onClick={() => navigate(`/member/${member.id}/edit`)}
            className="bg-blue-600 hover:bg-blue-700 text-white flex-1 sm:flex-none flex items-center gap-2"
          >
            <Edit className="h-4 w-4" />
            Edit Details
          </Button>
          <Button 
            variant="outline"
            onClick={() => navigate(isDashboardMode ? '/dashboard/export' : '/export')}
            className="flex-1 sm:flex-none flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Export Data
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