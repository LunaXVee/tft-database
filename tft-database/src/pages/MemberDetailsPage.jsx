import { useParams, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { sampleMembers } from "@/data/sampleMembers"

function MemberDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  
  // Find the member by ID
  const member = sampleMembers.find(m => m.id === parseInt(id))
  
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
                {member.firstName} {member.lastName}
              </h1>
              <p className="text-gray-600 mt-2">Member ID: #{member.id}</p>
            </div>
            <div className="space-x-3">
              <Button variant="outline">
                Edit Member
              </Button>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                member.contractStatus === 'Active' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {member.contractStatus}
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
                <span className="font-medium">{member.firstName} {member.lastName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Mobile Phone:</span>
                <span className="font-medium">{member.mobilePhone1}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Email:</span>
                <span className="font-medium">{member.emailAddress}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Member Since:</span>
                <span className="font-medium">{member.yearJoined}</span>
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
                <span className="font-medium">{member.province}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">District:</span>
                <span className="font-medium">-</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Ward:</span>
                <span className="font-medium">-</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Village:</span>
                <span className="font-medium">-</span>
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
                <span className="font-medium capitalize">{member.farmType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Farm Size:</span>
                <span className="font-medium">- hectares</span>
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
                  member.contractStatus === 'Active' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {member.contractStatus}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Contract Year:</span>
                <span className="font-medium">2025</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Last Updated:</span>
                <span className="font-medium">January 2025</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-center space-x-4">
          <Button variant="outline" onClick={() => navigate('/members')}>
            Back to Directory
          </Button>
          <Button>
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