import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import MemberForm from "@/components/MemberForm"
import { supabase } from "@/lib/supabase"

function AddMemberPage() {
  const navigate = useNavigate()

  const handleAddMember = async (data) => {
    console.clear()
    console.log("=== SAVING MEMBER TO DATABASE ===")
    console.log("Form data:", data)
    
    try {
      console.log("💾 Saving member to database...")
      
      const { data: savedMember, error } = await supabase
        .from('members')
        .insert([
          {
            first_name: data.firstName,
            middle_name: data.middleName || null,
            last_name: data.lastName,
            id_number: data.idNumber,
            date_of_birth: data.dateOfBirth,
            gender: data.gender,
            mobile_phone_1: data.mobilePhone1,
            mobile_phone_2: data.mobilePhone2 || null,
            email_address: data.emailAddress || null,
            province: data.province,
            constituency: data.constituency,
            district: data.district,
            ward: data.ward || null,
            village: data.village || null,
            cluster: data.cluster || null,
            farm_type: data.farmType,
            farm_name: data.farmName || null,
            farm_size: data.farmSize,
          }
        ])
        .select()
      
      if (error) {
        console.error("❌ Database save failed:", error)
        alert("Failed to save member. Check console for details.")
        return
      }
      
      console.log("✅ Member saved successfully!")
      console.log("Saved member:", savedMember)
      alert("🎉 Member registered successfully! Check the Members Directory to see them.")
      
      navigate("/members")
      
    } catch (err) {
      console.error("❌ Save error:", err)
      alert("Save error. Check console for details.")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button 
            variant="outline" 
            onClick={() => navigate('/')}
            className="mb-4"
          >
            ← Back to Home
          </Button>
          <h1 className="text-3xl font-bold text-green-700">
            Add New Member
          </h1>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <MemberForm 
            onSubmit={handleAddMember}
            submitButtonText="Add Member"
          />
        </div>
      </div>
    </div>
  )
}

export default AddMemberPage