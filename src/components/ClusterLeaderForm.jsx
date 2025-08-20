import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { clusterLeaderSchema } from "@/lib/clusterLeaderSchema"

function ClusterLeaderForm({ 
  initialData = {},
  onSubmit,
  submitButtonText = "Submit",
  isLoading = false
}) {
  const [currentTab, setCurrentTab] = useState("leader")
  
  const form = useForm({
    resolver: zodResolver(clusterLeaderSchema),
    defaultValues: {
      // Leader Information
      firstName: initialData.firstName || "",
      middleName: initialData.middleName || "",
      lastName: initialData.lastName || "",
      clusterName: initialData.clusterName || "",
      yearAppointed: initialData.yearAppointed || new Date().getFullYear().toString(),
      
      // Contact Information
      phone: initialData.phone || "",
      email: initialData.email || "",
      address: initialData.address || "",
      
      // Location Information
      province: initialData.province || "",
      district: initialData.district || "",
      ward: initialData.ward || "",
      village: initialData.village || "",
      
      // Deputy Leader Information
      deputyName: initialData.deputyName || "",
      deputyPhone: initialData.deputyPhone || "",
      deputyEmail: initialData.deputyEmail || "",
      
      // Secretary Information
      secretaryName: initialData.secretaryName || "",
      secretaryPhone: initialData.secretaryPhone || "",
      secretaryEmail: initialData.secretaryEmail || "",
      
      // Treasurer Information
      treasurerName: initialData.treasurerName || "",
      treasurerPhone: initialData.treasurerPhone || "",
      treasurerEmail: initialData.treasurerEmail || "",
      
      // Additional Information
      about: initialData.about || "",
    }
  })

  const handleSubmit = (data) => {
    if (onSubmit) {
      onSubmit(data)
    }
  }

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
      <Tabs value={currentTab} onValueChange={setCurrentTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="leader">Leader Info</TabsTrigger>
          <TabsTrigger value="location">Location</TabsTrigger>
          <TabsTrigger value="team">Team Members</TabsTrigger>
          <TabsTrigger value="additional">Additional</TabsTrigger>
        </TabsList>
        
        {/* Leader Information Tab */}
        <TabsContent value="leader" className="space-y-4">
          <h3 className="text-lg font-medium">Leader Information</h3>
          
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

            {/* Cluster Name */}
            <div>
              <label className="block text-sm font-medium mb-1">Cluster Name *</label>
              <Input 
                {...form.register("clusterName")}
                placeholder="Enter cluster name" 
              />
              {form.formState.errors.clusterName && (
                <p className="text-red-500 text-sm mt-1">
                  {form.formState.errors.clusterName.message}
                </p>
              )}
            </div>

            {/* Year Appointed */}
            <div>
              <label className="block text-sm font-medium mb-1">Year Appointed *</label>
              <Input 
                type="number"
                min="2000"
                max={new Date().getFullYear()}
                {...form.register("yearAppointed")}
                placeholder="Enter year appointed" 
              />
              {form.formState.errors.yearAppointed && (
                <p className="text-red-500 text-sm mt-1">
                  {form.formState.errors.yearAppointed.message}
                </p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium mb-1">Phone Number *</label>
              <Input 
                {...form.register("phone")}
                placeholder="Enter phone number" 
              />
              {form.formState.errors.phone && (
                <p className="text-red-500 text-sm mt-1">
                  {form.formState.errors.phone.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-1">Email Address</label>
              <Input 
                type="email"
                {...form.register("email")}
                placeholder="Enter email address" 
              />
              {form.formState.errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>

            {/* Address */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Address</label>
              <Input 
                {...form.register("address")}
                placeholder="Enter full address" 
              />
            </div>
          </div>
        </TabsContent>

        {/* Location Information Tab */}
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
                <option value="Harare">Harare</option>
                <option value="Bulawayo">Bulawayo</option>
                <option value="Manicaland">Manicaland</option>
                <option value="Mashonaland Central">Mashonaland Central</option>
                <option value="Mashonaland East">Mashonaland East</option>
                <option value="Mashonaland West">Mashonaland West</option>
                <option value="Masvingo">Masvingo</option>
                <option value="Matabeleland North">Matabeleland North</option>
                <option value="Matabeleland South">Matabeleland South</option>
                <option value="Midlands">Midlands</option>
              </select>
              {form.formState.errors.province && (
                <p className="text-red-500 text-sm mt-1">
                  {form.formState.errors.province.message}
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
            </div>

            {/* Village */}
            <div>
              <label className="block text-sm font-medium mb-1">Village</label>
              <Input 
                {...form.register("village")}
                placeholder="Enter village" 
              />
            </div>
          </div>
        </TabsContent>

        {/* Team Members Tab */}
        <TabsContent value="team" className="space-y-6">
          <h3 className="text-lg font-medium">Team Members</h3>
          
          {/* Deputy Leader Section */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="text-md font-medium mb-3 flex items-center">
              <span className="mr-2">🤝</span>
              Deputy Leader
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <Input 
                  {...form.register("deputyName")}
                  placeholder="Enter deputy name" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <Input 
                  {...form.register("deputyPhone")}
                  placeholder="Enter deputy phone" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <Input 
                  type="email"
                  {...form.register("deputyEmail")}
                  placeholder="Enter deputy email" 
                />
                {form.formState.errors.deputyEmail && (
                  <p className="text-red-500 text-sm mt-1">
                    {form.formState.errors.deputyEmail.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Secretary Section */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="text-md font-medium mb-3 flex items-center">
              <span className="mr-2">📋</span>
              Cluster Secretary
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <Input 
                  {...form.register("secretaryName")}
                  placeholder="Enter secretary name" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <Input 
                  {...form.register("secretaryPhone")}
                  placeholder="Enter secretary phone" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <Input 
                  type="email"
                  {...form.register("secretaryEmail")}
                  placeholder="Enter secretary email" 
                />
                {form.formState.errors.secretaryEmail && (
                  <p className="text-red-500 text-sm mt-1">
                    {form.formState.errors.secretaryEmail.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Treasurer Section */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="text-md font-medium mb-3 flex items-center">
              <span className="mr-2">💰</span>
              Cluster Treasurer
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <Input 
                  {...form.register("treasurerName")}
                  placeholder="Enter treasurer name" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <Input 
                  {...form.register("treasurerPhone")}
                  placeholder="Enter treasurer phone" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <Input 
                  type="email"
                  {...form.register("treasurerEmail")}
                  placeholder="Enter treasurer email" 
                />
                {form.formState.errors.treasurerEmail && (
                  <p className="text-red-500 text-sm mt-1">
                    {form.formState.errors.treasurerEmail.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Additional Information Tab */}
        <TabsContent value="additional" className="space-y-4">
          <h3 className="text-lg font-medium">Additional Information</h3>
          
          <div>
            <label className="block text-sm font-medium mb-1">About the Leader</label>
            <Textarea 
              {...form.register("about")}
              placeholder="Enter additional information about the cluster leader..."
              rows={6}
              className="w-full"
            />
            <p className="text-sm text-gray-500 mt-1">
              Include leadership experience, achievements, farming background, etc.
            </p>
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-between pt-6">
        <Button type="button" variant="outline">
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : submitButtonText}
        </Button>
      </div>
    </form>
  )
}

export default ClusterLeaderForm