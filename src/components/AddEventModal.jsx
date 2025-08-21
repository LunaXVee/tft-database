import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { supabase } from "@/lib/supabase"
import { X } from 'lucide-react'

// Event type configuration
const EVENT_TYPES = {
  training: {
    label: 'Training Sessions',
    color: 'bg-green-500',
    icon: '📚'
  },
  meeting: {
    label: 'Cluster Meetings', 
    color: 'bg-red-500',
    icon: '👥'
  },
  general: {
    label: 'General Events',
    color: 'bg-blue-500', 
    icon: '📅'
  },
  deadline: {
    label: 'Deadlines',
    color: 'bg-yellow-400',
    icon: '⏰'
  },
  inspection: {
    label: 'Field Inspections',
    color: 'bg-purple-500',
    icon: '🔍'
  }
}

function AddEventModal({ isOpen, onClose, onEventAdded, selectedDate = null }) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    event_type: '',
    start_date: selectedDate ? selectedDate.toISOString().slice(0, 16) : '',
    end_date: selectedDate ? selectedDate.toISOString().slice(0, 16) : '',
    location: '',
    organizer: '',
    target_audience: 'all_cluster_leaders',
    cluster_name: '',
    province: ''
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      console.log("💾 Creating new event:", formData)

      // Validate required fields
      if (!formData.title || !formData.event_type || !formData.start_date || !formData.end_date) {
        alert("Please fill in all required fields")
        setLoading(false)
        return
      }

      // Insert the event into database
      const { data, error } = await supabase
        .from('events')
        .insert([{
          title: formData.title,
          description: formData.description || null,
          event_type: formData.event_type,
          start_date: formData.start_date,
          end_date: formData.end_date,
          location: formData.location || null,
          organizer: formData.organizer || null,
          target_audience: formData.target_audience,
          cluster_name: formData.cluster_name || null,
          province: formData.province || null,
          status: 'scheduled'
        }])
        .select()

      if (error) {
        console.error("❌ Error creating event:", error)
        alert("Failed to create event. Check console for details.")
        return
      }

      console.log("✅ Event created successfully:", data)
      alert("🎉 Event created successfully!")
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        event_type: '',
        start_date: selectedDate ? selectedDate.toISOString().slice(0, 16) : '',
        end_date: selectedDate ? selectedDate.toISOString().slice(0, 16) : '',
        location: '',
        organizer: '',
        target_audience: 'all_cluster_leaders',
        cluster_name: '',
        province: ''
      })

      // Notify parent component to refresh events
      if (onEventAdded) {
        onEventAdded()
      }

      // Close modal
      onClose()

    } catch (err) {
      console.error("❌ Create event error:", err)
      alert("Error creating event. Check console for details.")
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Add New Event</h2>
            <p className="text-gray-600 mt-1">Create a new event for the TFT calendar</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Modal Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Event Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Event Details</h3>
            
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Event Title *
              </label>
              <Input
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter event title"
                required
              />
            </div>

            {/* Event Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Event Type *
              </label>
              <select
                name="event_type"
                value={formData.event_type}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                required
              >
                <option value="">Select event type</option>
                {Object.entries(EVENT_TYPES).map(([key, type]) => (
                  <option key={key} value={key}>
                    {type.icon} {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter event description"
                rows={3}
              />
            </div>
          </div>

          {/* Date & Time */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Date & Time</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Start Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date & Time *
                </label>
                <Input
                  type="datetime-local"
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* End Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date & Time *
                </label>
                <Input
                  type="datetime-local"
                  name="end_date"
                  value={formData.end_date}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          </div>

          {/* Location & Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Location & Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <Input
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="Enter location"
                />
              </div>

              {/* Organizer */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Organizer
                </label>
                <Input
                  name="organizer"
                  value={formData.organizer}
                  onChange={handleInputChange}
                  placeholder="Enter organizer name"
                />
              </div>

              {/* Province */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Province
                </label>
                <select
                  name="province"
                  value={formData.province}
                  onChange={handleInputChange}
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
              </div>

              {/* Target Audience */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Target Audience
                </label>
                <select
                  name="target_audience"
                  value={formData.target_audience}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                >
                  <option value="all_cluster_leaders">All Cluster Leaders</option>
                  <option value="all_members">All Members</option>
                  <option value="specific_cluster">Specific Cluster</option>
                </select>
              </div>
            </div>

            {/* Cluster Name (conditional) */}
            {formData.target_audience === 'specific_cluster' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cluster Name
                </label>
                <Input
                  name="cluster_name"
                  value={formData.cluster_name}
                  onChange={handleInputChange}
                  placeholder="Enter specific cluster name"
                />
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {loading ? "Creating..." : "Create Event"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddEventModal