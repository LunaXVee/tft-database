import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import ClusterLeaderForm from "@/components/ClusterLeaderForm"
import { supabase } from "@/lib/supabase"
import DashboardLayout from "@/components/DashboardLayout"

function AddClusterLeaderPage() {
  const navigate = useNavigate()
  const [saving, setSaving] = useState(false)

  const handleAddClusterLeader = async (data) => {
    setSaving(true)
    console.clear()
    console.log("=== SAVING CLUSTER LEADER TO DATABASE ===")
    console.log("Form data:", data)
    
    try {
      console.log("💾 Saving cluster leader to database...")
      
      const { data: savedLeader, error } = await supabase
        .from('cluster_leaders')
        .insert([
          {
            first_name: data.firstName,
            middle_name: data.middleName || null,
            last_name: data.lastName,
            cluster_name: data.clusterName,
            year_appointed: parseInt(data.yearAppointed),
            phone: data.phone,
            email: data.email || null,
            address: data.address || null,
            province: data.province,
            district: data.district,
            ward: data.ward || null,
            village: data.village || null,
            deputy_name: data.deputyName || null,
            deputy_phone: data.deputyPhone || null,
            deputy_email: data.deputyEmail || null,
            secretary_name: data.secretaryName || null,
            secretary_phone: data.secretaryPhone || null,
            secretary_email: data.secretaryEmail || null,
            treasurer_name: data.treasurerName || null,
            treasurer_phone: data.treasurerPhone || null,
            treasurer_email: data.treasurerEmail || null,
            about: data.about || null,
            status: 'Active'
          }
        ])
        .select()
      
      if (error) {
        console.error("❌ Database save failed:", error)
        
        // Handle specific errors
        if (error.code === '23505' && error.message.includes('unique_cluster_name')) {
          alert("A cluster with this name already exists. Please choose a different cluster name.")
        } else {
          alert("Failed to save cluster leader. Check console for details.")
        }
        return
      }
      
      console.log("✅ Cluster leader saved successfully!")
      console.log("Saved leader:", savedLeader)
      alert("🎉 Cluster leader registered successfully!")
      
      // Navigate to the cluster leaders directory
      navigate("/dashboard/cluster-leaders")
      
    } catch (err) {
      console.error("❌ Save error:", err)
      alert("Save error. Check console for details.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header Card */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Add New Cluster Leader</h3>
              <p className="text-gray-600 mt-1">Register a new cluster leader and their team</p>
            </div>
            <div className="text-3xl">👨‍💼</div>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <ClusterLeaderForm 
            onSubmit={handleAddClusterLeader}
            submitButtonText="Register Cluster Leader"
            isLoading={saving}
          />
        </div>
      </div>
    </DashboardLayout>
  )
}

export default AddClusterLeaderPage