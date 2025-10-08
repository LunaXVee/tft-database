import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import MemberForm from "@/components/MemberForm"
import { supabase } from "@/lib/supabase"
import { 
  
  User as UserIcon, 
  
} from "lucide-react"

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
      alert("🎉 Member registered successfully!")
      
      // Navigate back to members directory
      navigate("/members")
      
    } catch (err) {
      console.error("❌ Save error:", err)
      alert("Save error. Check console for details.")
    }
  }

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Member Registration</h3>
            <p className="text-gray-600 mt-1">Add a new farmer to the database</p>
          </div>
          <UserIcon className="h-10 w-10 mr-2 text-green-600" />
          </div>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <MemberForm 
          onSubmit={handleAddMember}
          submitButtonText="Register Member" 
        />
      </div>
    </div>
  )
}

export default AddMemberPage