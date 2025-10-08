import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useNavigate } from "react-router-dom"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { supabase } from "@/lib/supabase"
import { Check, ChevronsUpDown } from "lucide-react"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { User, Phone, MapPin, FlaskConical, Calendar, FileText } from "lucide-react"


const soilSampleSchema = z.object({
  uploadedBy: z.string().min(1, "Please enter your name"),
  memberId: z.string().min(1, "Please select a member"),
  sampleDate: z.string().min(1, "Sample date is required"),
  labReference: z.string().optional(),
  phLevel: z.string().optional(),
  limeRecommendation: z.string().optional(),
  soilHealthRating: z.enum(["good", "fair", "poor", ""]).optional(),
  notes: z.string().optional(),
  file: z.any().refine((files) => files?.length > 0, "Please upload a file"),
})

function AddSoilSamplePage() {
  const navigate = useNavigate()
  const [uploading, setUploading] = useState(false)
  const [members, setMembers] = useState([])
  const [open, setOpen] = useState(false)
  const [selectedMember, setSelectedMember] = useState(null)

  const form = useForm({
    resolver: zodResolver(soilSampleSchema),
    defaultValues: {
      uploadedBy: "",
      memberId: "",
      sampleDate: "",
      labReference: "",
      phLevel: "",
      limeRecommendation: "",
      soilHealthRating: "",
      notes: "",
    }
  })

  // Fetch members for the dropdown
  useEffect(() => {
    const fetchMembers = async () => {
      console.log("📥 Fetching members...")
      const { data, error } = await supabase
        .from('members')
        .select('id, first_name, last_name, mobile_phone_1, province')
        .order('first_name')
      
      if (error) {
        console.error("❌ Error fetching members:", error)
        return
      }
      
      console.log("✅ Members loaded:", data)
      if (data) setMembers(data)
    }
    fetchMembers()
  }, [])

  const onSubmit = async (data) => {
    setUploading(true)
    console.log("📤 Starting soil sample upload...")
    console.log("Form data:", data)

    try {
      // 1. Upload the file to Supabase Storage
      const file = data.file[0]
      const fileExt = file.name.split('.').pop()
      const fileName = `${data.memberId}-${Date.now()}.${fileExt}`
      
      console.log("📁 Uploading file:", fileName)
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('soil-samples')
        .upload(fileName, file)

      if (uploadError) {
        console.error("❌ Upload error:", uploadError)
        alert("Failed to upload file: " + uploadError.message)
        return
      }

      console.log("✅ File uploaded successfully:", uploadData)

      // 2. Get the public URL for the file
      const { data: { publicUrl } } = supabase.storage
        .from('soil-samples')
        .getPublicUrl(fileName)

      console.log("📎 Public URL:", publicUrl)

      // 3. Prepare the insert data
      const insertData = {
        member_id: data.memberId,
        sample_date: data.sampleDate,
        lab_reference: data.labReference || null,
        ph_level: data.phLevel ? parseFloat(data.phLevel) : null,
        lime_recommendation: data.limeRecommendation ? parseInt(data.limeRecommendation) : null,
        soil_health_rating: data.soilHealthRating || null,
        notes: data.notes || null,
        file_url: publicUrl,
        uploaded_by: data.uploadedBy,
      }

      console.log("💾 Inserting to database:", insertData)

      const { data: sampleData, error: dbError } = await supabase
        .from('soil_samples')
        .insert(insertData)
        .select()

      if (dbError) {
        console.error("❌ Database error:", dbError)
        alert("Failed to save sample record: " + dbError.message)
        return
      }

      console.log("✅ Soil sample saved successfully!", sampleData)
      alert("🎉 Soil sample uploaded successfully!")
      navigate(`/member/${data.memberId}`)

    } catch (err) {
      console.error("❌ Error:", err)
      alert("An error occurred. Check console.")
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button 
            variant="outline" 
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            ← Back
          </Button>
          <h1 className="text-3xl font-bold text-green-700">
            Upload Soil Sample
          </h1>
          <p className="text-gray-600 mt-2">
            Record a new soil sample analysis for a member
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            
            {/* Uploader Information */}
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
            <label className="block text-sm font-medium mb-1 flex items-center">
                <User className="h-4 w-4 mr-2 text-blue-600" />
                Your Name (Person Uploading) *
                </label>
              <Input 
                {...form.register("uploadedBy")}
                placeholder="Enter your full name"
              />
              {form.formState.errors.uploadedBy && (
                <p className="text-red-500 text-sm mt-1">
                  {form.formState.errors.uploadedBy.message}
                </p>
              )}
              <p className="text-xs text-gray-600 mt-1">
                This helps track who uploaded this soil sample for record keeping
              </p>
            </div>

            {/* Member Selection - SEARCHABLE COMBOBOX */}
            <div>
  <label className="block text-sm font-medium mb-1">
    Select Member *
  </label>
  <Popover open={open} onOpenChange={setOpen}>
    <PopoverTrigger asChild>
      <Button
        variant="outline"
        role="combobox"
        aria-expanded={open}
        className="w-full justify-between h-auto min-h-[40px] text-left"
      >
        {selectedMember ? (
          <div className="flex flex-col items-start">
            <span className="font-medium">
              {selectedMember.first_name} {selectedMember.last_name}
            </span>
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <Phone className="h-3 w-3" />
              {selectedMember.mobile_phone_1}
              <span className="mx-1">•</span>
              <MapPin className="h-3 w-3" />
              {selectedMember.province}
            </span>
          </div>
        ) : (
          "Search and select a member..."
        )}
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>
    </PopoverTrigger>
    <PopoverContent className="w-[500px] p-0" align="start">
      <Command>
        <CommandInput placeholder="Search by name or phone..." />
        <CommandList>
          <CommandEmpty>No member found.</CommandEmpty>
          <CommandGroup>
            {members.map((member) => (
              <CommandItem
                key={member.id}
                value={`${member.first_name} ${member.last_name} ${member.mobile_phone_1}`}
                onSelect={() => {
                  setSelectedMember(member)
                  form.setValue("memberId", member.id)
                  form.clearErrors("memberId")
                  setOpen(false)
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    selectedMember?.id === member.id ? "opacity-100" : "opacity-0"
                  )}
                />
                <div className="flex flex-col">
                  <span className="font-medium">
                    {member.first_name} {member.last_name}
                  </span>
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <Phone className="h-2 w-2" />
                    {member.mobile_phone_1}
                    <span className="mx-1">•</span>
                    <MapPin className="h-2 w-2" />
                    {member.province}
                  </span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </PopoverContent>
  </Popover>
  {form.formState.errors.memberId && (
    <p className="text-red-500 text-sm mt-1">
      {form.formState.errors.memberId.message}
    </p>
  )}
  <p className="text-xs text-gray-500 mt-1">
    Type to search by name or phone number
  </p>
</div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Sample Date */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Sample Date *
                </label>
                <Input 
                  type="date"
                  {...form.register("sampleDate")}
                />
                {form.formState.errors.sampleDate && (
                  <p className="text-red-500 text-sm mt-1">
                    {form.formState.errors.sampleDate.message}
                  </p>
                )}
              </div>

              {/* Lab Reference */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Lab Reference Number
                </label>
                <Input 
                  {...form.register("labReference")}
                  placeholder="e.g., 252048"
                />
              </div>
            </div>

            {/* Middle Ground Fields */}
            <div className="border-t pt-4 mt-4">
              <h3 className="text-lg font-medium mb-3">
                Quick Analysis (Optional)
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* pH Level */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    pH Level
                  </label>
                  <Input 
                    type="number"
                    step="0.01"
                    {...form.register("phLevel")}
                    placeholder="e.g., 5.28"
                  />
                </div>

                {/* Lime Recommendation */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Lime (kg/ha)
                  </label>
                  <Input 
                    type="number"
                    {...form.register("limeRecommendation")}
                    placeholder="e.g., 600"
                  />
                </div>

                {/* Soil Health Rating */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Soil Health
                  </label>
                  <select 
                    {...form.register("soilHealthRating")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                  >
                    <option value="">Select rating...</option>
                    <option value="good">Good</option>
                    <option value="fair">Fair</option>
                    <option value="poor">Poor</option>
                  </select>
                </div>
              </div>
            </div>

            {/* File Upload */}
            <div className="border-t pt-4 mt-4">
              <label className="block text-sm font-medium mb-1">
                Upload Report File (PDF or Image) *
              </label>
              <Input 
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                {...form.register("file")}
              />
              {form.formState.errors.file && (
                <p className="text-red-500 text-sm mt-1">
                  {form.formState.errors.file.message}
                </p>
              )}
              <p className="text-sm text-gray-500 mt-1">
                Accepted formats: PDF, JPG, PNG (Max 10MB)
              </p>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Notes (Optional)
              </label>
              <Textarea 
                {...form.register("notes")}
                placeholder="Any additional observations or comments..."
                rows={3}
              />
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-between pt-6">
              <Button 
                type="button" 
                variant="outline"
                onClick={() => navigate(-1)}
                disabled={uploading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={uploading}>
                {uploading ? "Uploading..." : "Upload Soil Sample"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AddSoilSamplePage