import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { memberSchema } from "@/lib/memberSchema"
import { supabase } from "@/lib/supabase"

function MemberForm({ 
  initialData = {},     // Default to empty object
  onSubmit,            // Function to call when form is submitted
  submitButtonText = "Submit", // Default submit button text
  isLoading = false    // Whether we're currently saving
}) {
  const [currentTab, setCurrentTab] = useState("personal")
  const [clusters, setClusters] = useState([]) // State for dynamic clusters
  const [clustersLoading, setClustersLoading] = useState(true)
  
  const form = useForm({
    resolver: zodResolver(memberSchema),
    defaultValues: {
      firstName: initialData.firstName || "",
      middleName: initialData.middleName || "",
      lastName: initialData.lastName || "",
      idNumber: initialData.idNumber || "",
      dateOfBirth: initialData.dateOfBirth || "",
      gender: initialData.gender || "",
      mobilePhone1: initialData.mobilePhone1 || "",
      mobilePhone2: initialData.mobilePhone2 || "",
      emailAddress: initialData.emailAddress || "",
      province: initialData.province || "",
      constituency: initialData.constituency || "",
      district: initialData.district || "",
      ward: initialData.ward || "",
      village: initialData.village || "",
      cluster: initialData.cluster || "",
      farmType: initialData.farmType || "",
      farmName: initialData.farmName || "",
      farmSize: initialData.farmSize || "",
      has_insurance: initialData.hasInsurance || "",
    }
  })

  // Fetch clusters from database
  useEffect(() => {
    fetchClusters()
  }, [])

  const fetchClusters = async () => {
    try {
      console.log("📥 Fetching clusters from database...")
      
      const { data, error } = await supabase
        .from('cluster_leaders')
        .select('cluster_name, province, district')
        .eq('status', 'Active')
        .order('cluster_name', { ascending: true })

      if (error) {
        console.error("❌ Error fetching clusters:", error)
        return
      }

      console.log("✅ Clusters fetched successfully:", data)
      setClusters(data || [])
      
    } catch (err) {
      console.error("❌ Fetch clusters error:", err)
    } finally {
      setClustersLoading(false)
    }
  }

  // Handle form submission - just call the function passed in as props
  const handleSubmit = (data) => {
    if (onSubmit) {
      onSubmit(data)
    }
  }

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
      <Tabs value={currentTab} onValueChange={setCurrentTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="personal">Personal Info</TabsTrigger>
          <TabsTrigger value="location">Location</TabsTrigger>
          <TabsTrigger value="farm">Farm Details</TabsTrigger>
        </TabsList> 
        
        <TabsContent value="personal" className="space-y-4">
          <h3 className="text-lg font-medium">Personal Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* First Name */}
            <div>
              <label className="block text-sm font-medium mb-1">First Name *</label>
              <Input 
                {...form.register("firstName")}
                placeholder="Enter first name" 
              />
              {form.formState.errors.firstName && (
                <p className="text-red-500 text-sm mt-1">
                  {form.formState.errors.firstName.message}
                </p>
              )}
            </div>

            {/* Middle Name */}
            <div>
              <label className="block text-sm font-medium mb-1">Middle Name</label>
              <Input 
                {...form.register("middleName")}
                placeholder="Enter middle name" 
              />
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm font-medium mb-1">Last Name *</label>
              <Input 
                {...form.register("lastName")}
                placeholder="Enter last name" 
              />
              {form.formState.errors.lastName && (
                <p className="text-red-500 text-sm mt-1">
                  {form.formState.errors.lastName.message}
                </p>
              )}
            </div>

            {/* ID Number */}
            <div>
              <label className="block text-sm font-medium mb-1">ID Number *</label>
              <Input 
                {...form.register("idNumber")}
                placeholder="Enter ID number" 
              />
              {form.formState.errors.idNumber && (
                <p className="text-red-500 text-sm mt-1">
                  {form.formState.errors.idNumber.message}
                </p>
              )}
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block text-sm font-medium mb-1">Date of Birth *</label>
              <Input 
                type="date"
                {...form.register("dateOfBirth")}
              />
              {form.formState.errors.dateOfBirth && (
                <p className="text-red-500 text-sm mt-1">
                  {form.formState.errors.dateOfBirth.message}
                </p>
              )}
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-medium mb-1">Gender *</label>
              <select 
                {...form.register("gender")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
      
              </select>
              {form.formState.errors.gender && (
                <p className="text-red-500 text-sm mt-1">
                  {form.formState.errors.gender.message}
                </p>
              )}
            </div>

            {/* Mobile Phone 1 */}
            <div>
              <label className="block text-sm font-medium mb-1">Mobile Phone 1 *</label>
              <Input 
                {...form.register("mobilePhone1")}
                placeholder="Enter mobile number" 
              />
              {form.formState.errors.mobilePhone1 && (
                <p className="text-red-500 text-sm mt-1">
                  {form.formState.errors.mobilePhone1.message}
                </p>
              )}
            </div>

            {/* Mobile Phone 2 */}
            <div>
              <label className="block text-sm font-medium mb-1">Mobile Phone 2</label>
              <Input 
                {...form.register("mobilePhone2")}
                placeholder="Enter second mobile number" 
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-1">Email Address</label>
              <Input 
                type="email"
                {...form.register("emailAddress")}
                placeholder="Enter email address" 
              />
              {form.formState.errors.emailAddress && (
                <p className="text-red-500 text-sm mt-1">
                  {form.formState.errors.emailAddress.message}
                </p>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="location" className="space-y-4">
          <h3 className="text-lg font-medium">Location Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Province */}
            <div>
              <label className="block text-sm font-medium mb-1">Province *</label>
              <select 
                {...form.register("province")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
              >
                <option value="">Select Province</option>
                <option value="harare">Harare</option>
                <option value="bulawayo">Bulawayo</option>
                <option value="manicaland">Manicaland</option>
                <option value="mashonaland-central">Mashonaland Central</option>
                <option value="mashonaland-east">Mashonaland East</option>
                <option value="mashonaland-west">Mashonaland West</option>
                <option value="masvingo">Masvingo</option>
                <option value="matabeleland-north">Matabeleland North</option>
                <option value="matabeleland-south">Matabeleland South</option>
                <option value="midlands">Midlands</option>
              </select>
              {form.formState.errors.province && (
                <p className="text-red-500 text-sm mt-1">
                  {form.formState.errors.province.message}
                </p>
              )}
            </div>

            {/* Constituency */}
            <div>
              <label className="block text-sm font-medium mb-1">Constituency *</label>
              <Input 
                {...form.register("constituency")}
                placeholder="Enter constituency" 
              />
              {form.formState.errors.constituency && (
                <p className="text-red-500 text-sm mt-1">
                  {form.formState.errors.constituency.message}
                </p>
              )}
            </div>

            {/* District */}
            <div>
              <label className="block text-sm font-medium mb-1">District *</label>
              <Input 
                {...form.register("district")}
                placeholder="Enter district" 
              />
              {form.formState.errors.district && (
                <p className="text-red-500 text-sm mt-1">
                  {form.formState.errors.district.message}
                </p>
              )}
            </div>

            {/* Ward */}
            <div>
              <label className="block text-sm font-medium mb-1">Ward</label>
              <Input 
                {...form.register("ward")}
                placeholder="Enter ward" 
              />
              {form.formState.errors.ward && (
                <p className="text-red-500 text-sm mt-1">
                  {form.formState.errors.ward.message}
                </p>
              )}
            </div>

            {/* Village */}
            <div>
              <label className="block text-sm font-medium mb-1">Village</label>
              <Input 
                {...form.register("village")}
                placeholder="Enter village" 
              />
              {form.formState.errors.village && (
                <p className="text-red-500 text-sm mt-1">
                  {form.formState.errors.village.message}
                </p>
              )}
            </div>

            {/* Cluster - NOW DYNAMIC! */}
            <div>
              <label className="block text-sm font-medium mb-1">Cluster *</label>
              <select 
                {...form.register("cluster")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                disabled={clustersLoading}
              >
                <option value="">
                  {clustersLoading ? "Loading clusters..." : "Choose Your Cluster"}
                </option>
                {clusters.map((cluster) => (
                  <option key={cluster.cluster_name} value={cluster.cluster_name}>
                    {cluster.cluster_name} ({cluster.province}, {cluster.district})
                  </option>
                ))}
              </select>
              {form.formState.errors.cluster && (
                <p className="text-red-500 text-sm mt-1">
                  {form.formState.errors.cluster.message}
                </p>
              )}
              {clustersLoading && (
                <p className="text-blue-500 text-sm mt-1">
                  Loading available clusters...
                </p>
              )}
              {!clustersLoading && clusters.length === 0 && (
                <p className="text-yellow-600 text-sm mt-1">
                  No active clusters found. Please contact admin.
                </p>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="farm" className="space-y-4">
          <h3 className="text-lg font-medium">Farm Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Farm Type */}
            <div>
              <label className="block text-sm font-medium mb-1">Farm Type *</label>
              <select 
                {...form.register("farmType")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
              >
                <option value="">Select farm type</option>
                <option value="communal">Communal</option>
                <option value="a1">A1</option>
                <option value="a2">A2</option>
                <option value="small_scale_resettlement">Small Scale Resettlement</option>
                <option value="commercial">Commercial</option>
                <option value="old_resettlement">Old Resettlement</option>
              </select>
              {form.formState.errors.farmType && (
                <p className="text-red-500 text-sm mt-1">
                  {form.formState.errors.farmType.message}
                </p>
              )}
            </div>

            {/* Farm Name */}
            <div>
              <label className="block text-sm font-medium mb-1">Farm Name</label>
              <Input 
                {...form.register("farmName")}
                placeholder="Enter farm name" 
              />
              {form.formState.errors.farmName && (
                <p className="text-red-500 text-sm mt-1">
                  {form.formState.errors.farmName.message}
                </p>
              )}
            </div>

            {/* Farm Size */}
            <div>
              <label className="block text-sm font-medium mb-1">Farm Size (hectares) *</label>
              <Input 
                type="number"
                step="0.1"
                {...form.register("farmSize")}
                placeholder="Enter farm size in hectares" 
              />
              {form.formState.errors.farmSize && (
                <p className="text-red-500 text-sm mt-1">
                  {form.formState.errors.farmSize.message}
                </p>
              )}
            </div>

            {/* ADD THIS - Insurance Checkbox */}
    <div className="flex items-center space-x-2 pt-6">
      <input
        type="checkbox"
        id="hasInsurance"
        {...form.register("hasInsurance")}
        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
      />
      <label htmlFor="hasInsurance" className="text-sm font-medium text-gray-700">
        Member has insurance coverage
      </label>
    </div>
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-between pt-6">
        <Button type="button" variant="outline">
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading || clustersLoading}>
          {isLoading ? "Saving..." : submitButtonText}
        </Button>
      </div>
    </form>
  )
}

export default MemberForm