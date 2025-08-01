import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import MemberForm from "@/components/MemberForm"
import { supabase } from "@/lib/supabase"

function EditMemberPage() {
  const { id } = useParams() // Get member ID from URL
  const navigate = useNavigate()
  const [member, setMember] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Fetch member data when page loads
  useEffect(() => {
    fetchMember()
  }, [id])

  const fetchMember = async () => {
    try {
      console.log("📥 Fetching member data for ID:", id)
      
      const { data, error } = await supabase
        .from('members')
        .select('*')
        .eq('id', id)
        .single() // Get just one record

      if (error) {
        console.error("❌ Error fetching member:", error)
        alert("Failed to load member data")
        navigate('/members')
        return
      }

      console.log("✅ Member data loaded:", data)
      setMember(data)
      
    } catch (err) {
      console.error("❌ Fetch error:", err)
      alert("Error loading member data")
      navigate('/members')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateMember = async (formData) => {
    setSaving(true)
    console.clear()
    console.log("=== UPDATING MEMBER IN DATABASE ===")
    console.log("Form data:", formData)
    console.log("Member ID:", id)
    
    try {
      console.log("💾 Updating member in database...")
      
      const { data: updatedMember, error } = await supabase
        .from('members')
        .update({
          first_name: formData.firstName,
          middle_name: formData.middleName || null,
          last_name: formData.lastName,
          id_number: formData.idNumber,
          date_of_birth: formData.dateOfBirth,
          gender: formData.gender,
          mobile_phone_1: formData.mobilePhone1,
          mobile_phone_2: formData.mobilePhone2 || null,
          email_address: formData.emailAddress || null,
          province: formData.province,
          constituency: formData.constituency,
          district: formData.district,
          ward: formData.ward || null,
          village: formData.village || null,
          cluster: formData.cluster || null,
          farm_type: formData.farmType,
          farm_name: formData.farmName || null,
          farm_size: formData.farmSize,
        })
        .eq('id', id)
        .select()
      
      if (error) {
        console.error("❌ Database update failed:", error)
        alert("Failed to update member. Check console for details.")
        return
      }
      
      console.log("✅ Member updated successfully!")
      console.log("Updated member:", updatedMember)
      alert("🎉 Member updated successfully!")
      
      // Navigate back to member details
      navigate(`/member/${id}`)
      
    } catch (err) {
      console.error("❌ Update error:", err)
      alert("Update error. Check console for details.")
    } finally {
      setSaving(false)
    }
  }

  // Convert database field names to form field names
  const getInitialData = () => {
    if (!member) return {}
    
    return {
      firstName: member.first_name || "",
      middleName: member.middle_name || "",
      lastName: member.last_name || "",
      idNumber: member.id_number || "",
      dateOfBirth: member.date_of_birth || "",
      gender: member.gender || "",
      mobilePhone1: member.mobile_phone_1 || "",
      mobilePhone2: member.mobile_phone_2 || "",
      emailAddress: member.email_address || "",
      province: member.province || "",
      constituency: member.constituency || "",
      district: member.district || "",
      ward: member.ward || "",
      village: member.village || "",
      cluster: member.cluster || "",
      farmType: member.farm_type || "",
      farmName: member.farm_name || "",
      farmSize: member.farm_size || "",
    }
  }

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <h2 className="text-2xl font-bold text-green-700 mb-4">Loading member data...</h2>
            <p className="text-gray-600">Please wait while we fetch the member information.</p>
          </div>
        </div>
      </div>
    )
  }

  // Show error if member not found
  if (!member) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Member Not Found</h2>
            <p className="text-gray-600 mb-4">The member you're trying to edit doesn't exist.</p>
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
        <div className="mb-6">
          <Button 
            variant="outline" 
            onClick={() => navigate(`/member/${id}`)}
            className="mb-4"
          >
            ← Back to Member Details
          </Button>
          <h1 className="text-3xl font-bold text-green-700">
            Edit Member: {member.first_name} {member.last_name}
          </h1>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <MemberForm 
            initialData={getInitialData()}
            onSubmit={handleUpdateMember}
            submitButtonText="Update Member"
            isLoading={saving}
          />
        </div>
      </div>
    </div>
  )
}

export default EditMemberPage