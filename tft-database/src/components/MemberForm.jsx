import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { memberSchema } from "@/lib/memberSchema"

function MemberForm({ 
  initialData = {},     // Default to empty object
  onSubmit,            // Function to call when form is submitted
  submitButtonText = "Submit", // Default submit button text
  isLoading = false    // Whether we're currently saving
}) {
  const [currentTab, setCurrentTab] = useState("personal")
  
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
    }
  })

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
                <option value="other">Other</option>
                <option value="prefer_not_to_say">Prefer not to say</option>
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

            {/* Cluster */}
            <div>
              <label className="block text-sm font-medium mb-1">Cluster *</label>
              <select 
                {...form.register("cluster")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
              >
                <option value="">Select Your Cluster Number</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
                <option value="9">9</option>
                <option value="10">10</option>
              </select>
              {form.formState.errors.cluster && (
                <p className="text-red-500 text-sm mt-1">
                  {form.formState.errors.cluster.message}
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
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-between pt-6">
        <Button type="button" variant="outline">
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {submitButtonText}
        </Button>
      </div>
    </form>
  )
}

export default MemberForm