import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import ClusterLeaderForm from "@/components/ClusterLeaderForm"
import { supabase } from "@/lib/supabase"
import DashboardLayout from "@/components/DashboardLayout"

function EditClusterLeaderPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [leader, setLeader] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Fetch cluster leader data when page loads
  useEffect(() => {
    fetchClusterLeader()
  }, [id])

  const fetchClusterLeader = async () => {
    try {
      console.log("📥 Fetching cluster leader data for ID:", id)
      
      const { data, error } = await supabase
        .from('cluster_leaders')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        console.error("❌ Error fetching cluster leader:", error)
        alert("Failed to load cluster leader data")
        navigate('/dashboard/cluster-leaders')
        return
      }

      console.log("✅ Cluster leader data loaded:", data)
      setLeader(data)
      
    } catch (err) {
      console.error("❌ Fetch error:", err)
      alert("Error loading cluster leader data")
      navigate('/dashboard/cluster-leaders')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateClusterLeader = async (formData) => {
    setSaving(true)
    console.clear()
    console.log("=== UPDATING CLUSTER LEADER IN DATABASE ===")
    console.log("Form data:", formData)
    console.log("Leader ID:", id)
    
    try {
      console.log("💾 Updating cluster leader in database...")
      
      const { data: updatedLeader, error } = await supabase
        .from('cluster_leaders')
        .update({
          first_name: formData.firstName,
          middle_name: formData.middleName || null,
          last_name: formData.lastName,
          cluster_name: formData.clusterName,
          year_appointed: parseInt(formData.yearAppointed),
          phone: formData.phone,
          email: formData.email || null,
          address: formData.address || null,
          province: formData.province,
          district: formData.district,
          ward: formData.ward || null,
          village: formData.village || null,
          deputy_name: formData.deputyName || null,
          deputy_phone: formData.deputyPhone || null,
          deputy_email: formData.deputyEmail || null,
          secretary_name: formData.secretaryName || null,
          secretary_phone: formData.secretaryPhone || null,
          secretary_email: formData.secretaryEmail || null,
          treasurer_name: formData.treasurerName || null,
          treasurer_phone: formData.treasurerPhone || null,
          treasurer_email: formData.treasurerEmail || null,
          about: formData.about || null,
        })
        .eq('id', id)
        .select()
      
      if (error) {
        console.error("❌ Database update failed:", error)
        
        // Handle specific errors
        if (error.code === '23505' && error.message.includes('unique_cluster_name')) {
          alert("A cluster with this name already exists. Please choose a different cluster name.")
        } else {
          alert("Failed to update cluster leader. Check console for details.")
        }
        return
      }
      
      console.log("✅ Cluster leader updated successfully!")
      console.log("Updated leader:", updatedLeader)
      alert("🎉 Cluster leader updated successfully!")
      
      // Navigate back to leader details
      navigate(`/dashboard/cluster-leader/${id}`)
      
    } catch (err) {
      console.error("❌ Update error:", err)
      alert("Update error. Check console for details.")
    } finally {
      setSaving(false)
    }
  }

  // Convert database field names to form field names
  const getInitialData = () => {
    if (!leader) return {}
    
    return {
      firstName: leader.first_name || "",
      middleName: leader.middle_name || "",
      lastName: leader.last_name || "",
      clusterName: leader.cluster_name || "",
      yearAppointed: leader.year_appointed?.toString() || "",
      phone: leader.phone || "",
      email: leader.email || "",
      address: leader.address || "",
      province: leader.province || "",
      district: leader.district || "",
      ward: leader.ward || "",
      village: leader.village || "",
      deputyName: leader.deputy_name || "",
      deputyPhone: leader.deputy_phone || "",
      deputyEmail: leader.deputy_email || "",
      secretaryName: leader.secretary_name || "",
      secretaryPhone: leader.secretary_phone || "",
      secretaryEmail: leader.secretary_email || "",
      treasurerName: leader.treasurer_name || "",
      treasurerPhone: leader.treasurer_phone || "",
      treasurerEmail: leader.treasurer_email || "",
      about: leader.about || "",
    }
  }

  // Show loading state
  if (loading) {
    return (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <h2 className="text-2xl font-bold text-green-700 mb-4">Loading cluster leader data...</h2>
          <p className="text-gray-600">Please wait while we fetch the leader information.</p>
        </div>
    )
  }

  // Show error if leader not found
  if (!leader) {
    return (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Cluster Leader Not Found</h2>
          <p className="text-gray-600 mb-4">The cluster leader you're trying to edit doesn't exist.</p>
          <Button onClick={() => navigate('/dashboard/cluster-leaders')}>
            ← Back to Cluster Leaders
          </Button>
        </div>
    )
  }

  return (
      <div className="space-y-6">
        {/* Header Card */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                Edit Cluster Leader: {leader.first_name} {leader.last_name}
              </h3>
              <p className="text-gray-600 mt-1">Update cluster leader information and team details</p>
            </div>
            <div className="text-3xl">✏️</div>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <ClusterLeaderForm 
            initialData={getInitialData()}
            onSubmit={handleUpdateClusterLeader}
            submitButtonText="Update Cluster Leader"
            isLoading={saving}
          />
        </div>
      </div>
  )
}

export default EditClusterLeaderPage