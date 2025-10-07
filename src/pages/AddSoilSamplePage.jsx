import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useNavigate } from "react-router-dom"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { supabase } from "@/lib/supabase"

const soilSampleSchema = z.object({
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

  const form = useForm({
    resolver: zodResolver(soilSampleSchema),
    defaultValues: {
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
  useState(() => {
    const fetchMembers = async () => {
      const { data } = await supabase
        .from('members')
        .select('id, first_name, last_name')
        .order('first_name')
      
      if (data) setMembers(data)
    }
    fetchMembers()
  }, [])

  const onSubmit = async (data) => {
    setUploading(true)
    console.log("📤 Starting soil sample upload...")

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

      console.log("✅ File uploaded successfully")

      // 2. Get the public URL for the file
      const { data: { publicUrl } } = supabase.storage
        .from('soil-samples')
        .getPublicUrl(fileName)

      // 3. Save the record to the database
      const { data: sampleData, error: dbError } = await supabase
        .from('soil_samples')
        .insert([{
          member_id: data.memberId,
          sample_date: data.sampleDate,
          lab_reference: data.labReference || null,
          ph_level: data.phLevel ? parseFloat(data.phLevel) : null,
          lime_recommendation: data.limeRecommendation ? parseInt(data.limeRecommendation) : null,
          soil_health_rating: data.soilHealthRating || null,
          notes: data.notes || null,
          file_url: publicUrl,
          uploaded_by: "Admin", // You can replace this with actual user info later
        }])
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
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            
            {/* Member Selection */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Select Member *
              </label>
              <select 
                {...form.register("memberId")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
              >
                <option value="">Choose a member...</option>
                {members.map(member => (
                  <option key={member.id} value={member.id}>
                    {member.first_name} {member.last_name}
                  </option>
                ))}
              </select>
              {form.formState.errors.memberId && (
                <p className="text-red-500 text-sm mt-1">
                  {form.formState.errors.memberId.message}
                </p>
              )}
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