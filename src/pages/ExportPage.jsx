import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { supabase } from "@/lib/supabase"

function ExportPage() {
  const navigate = useNavigate()
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [exporting, setExporting] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFields, setSelectedFields] = useState({
    // Personal Information
    firstName: true,
    lastName: true,
    middleName: false,
    idNumber: true,
    dateOfBirth: false,
    gender: false,
    mobilePhone1: true,
    mobilePhone2: false,
    emailAddress: true,
    
    // Location Information
    province: true,
    constituency: true,
    district: true,
    ward: false,
    village: false,
    cluster: true,
    
    // Farm Information
    farmType: true,
    farmName: false,
    farmSize: true,
    
    // System Information
    yearJoined: true,
    contractStatus: true,
    createdAt: false
  })

  // Available fields with friendly names
  const fieldDefinitions = {
    // Personal Information
    firstName: { label: "First Name", category: "Personal" },
    lastName: { label: "Last Name", category: "Personal" },
    middleName: { label: "Middle Name", category: "Personal" },
    idNumber: { label: "ID Number", category: "Personal" },
    dateOfBirth: { label: "Date of Birth", category: "Personal" },
    gender: { label: "Gender", category: "Personal" },
    mobilePhone1: { label: "Mobile Phone 1", category: "Personal" },
    mobilePhone2: { label: "Mobile Phone 2", category: "Personal" },
    emailAddress: { label: "Email Address", category: "Personal" },
    
    // Location Information
    province: { label: "Province", category: "Location" },
    constituency: { label: "Constituency", category: "Location" },
    district: { label: "District", category: "Location" },
    ward: { label: "Ward", category: "Location" },
    village: { label: "Village", category: "Location" },
    cluster: { label: "Cluster", category: "Location" },
    
    // Farm Information
    farmType: { label: "Farm Type", category: "Farm" },
    farmName: { label: "Farm Name", category: "Farm" },
    farmSize: { label: "Farm Size (hectares)", category: "Farm" },
    
    // System Information
    yearJoined: { label: "Year Joined", category: "System" },
    contractStatus: { label: "Contract Status", category: "System" },
    createdAt: { label: "Registration Date", category: "System" }
  }

  // Fetch members from database
  useEffect(() => {
    fetchMembers()
  }, [])

  const fetchMembers = async () => {
    try {
      console.log("📥 Fetching members for export...")
      
      const { data, error } = await supabase
        .from('members')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error("❌ Error fetching members:", error)
        return
      }

      console.log("✅ Members fetched for export:", data?.length || 0)
      setMembers(data || [])
      
    } catch (err) {
      console.error("❌ Fetch error:", err)
    } finally {
      setLoading(false)
    }
  }

  // Filter members based on search term
  const filteredMembers = members.filter(member =>
    member.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.province?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.farm_type?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Convert database record to export format
  const convertMemberForExport = (member) => {
    const exportRecord = {}
    
    // Only include selected fields
    Object.keys(selectedFields).forEach(fieldKey => {
      if (selectedFields[fieldKey]) {
        const fieldDef = fieldDefinitions[fieldKey]
        let value = ''
        
        // Map database fields to export values
        switch (fieldKey) {
          case 'firstName':
            value = member.first_name || ''
            break
          case 'lastName':
            value = member.last_name || ''
            break
          case 'middleName':
            value = member.middle_name || ''
            break
          case 'idNumber':
            value = member.id_number || ''
            break
          case 'dateOfBirth':
            value = member.date_of_birth || ''
            break
          case 'gender':
            value = member.gender || ''
            break
          case 'mobilePhone1':
            value = member.mobile_phone_1 || ''
            break
          case 'mobilePhone2':
            value = member.mobile_phone_2 || ''
            break
          case 'emailAddress':
            value = member.email_address || ''
            break
          case 'province':
            value = member.province || ''
            break
          case 'constituency':
            value = member.constituency || ''
            break
          case 'district':
            value = member.district || ''
            break
          case 'ward':
            value = member.ward || ''
            break
          case 'village':
            value = member.village || ''
            break
          case 'cluster':
            value = member.cluster || ''
            break
          case 'farmType':
            value = member.farm_type ? member.farm_type.replace('_', ' ') : ''
            break
          case 'farmName':
            value = member.farm_name || ''
            break
          case 'farmSize':
            value = member.farm_size || ''
            break
          case 'yearJoined':
            value = member.year_joined || ''
            break
          case 'contractStatus':
            value = member.contract_status || ''
            break
          case 'createdAt':
            value = member.created_at ? new Date(member.created_at).toLocaleDateString() : ''
            break
          default:
            value = ''
        }
        
        exportRecord[fieldDef.label] = value
      }
    })
    
    return exportRecord
  }

  // Export to CSV
  const exportToCSV = () => {
    setExporting(true)
    
    try {
      console.log("📄 Generating CSV export...")
      
      // Convert members to export format
      const exportData = filteredMembers.map(convertMemberForExport)
      
      if (exportData.length === 0) {
        alert("No data to export")
        setExporting(false)
        return
      }
      
      // Get headers from first record
      const headers = Object.keys(exportData[0])
      
      // Create CSV content
      const csvContent = [
        headers.join(','), // Header row
        ...exportData.map(row => 
          headers.map(header => {
            // Escape quotes and wrap in quotes if contains comma
            const value = String(row[header] || '')
            return value.includes(',') ? `"${value.replace(/"/g, '""')}"` : value
          }).join(',')
        )
      ].join('\n')
      
      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', `TFT_Members_${new Date().toISOString().split('T')[0]}.csv`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      console.log("✅ CSV export completed!")
      alert(`Successfully exported ${exportData.length} members to CSV!`)
      
    } catch (error) {
      console.error("❌ CSV export failed:", error)
      alert("CSV export failed. Check console for details.")
    } finally {
      setExporting(false)
    }
  }

  // Export to Excel (simplified - generates CSV with .xlsx extension)
  const exportToExcel = () => {
    setExporting(true)
    
    try {
      console.log("📊 Generating Excel export...")
      
      // For now, we'll create a CSV and name it .xlsx
      // In a real app, you'd use a library like xlsx-populate
      const exportData = filteredMembers.map(convertMemberForExport)
      
      if (exportData.length === 0) {
        alert("No data to export")
        setExporting(false)
        return
      }
      
      const headers = Object.keys(exportData[0])
      
      const csvContent = [
        headers.join(','),
        ...exportData.map(row => 
          headers.map(header => {
            const value = String(row[header] || '')
            return value.includes(',') ? `"${value.replace(/"/g, '""')}"` : value
          }).join(',')
        )
      ].join('\n')
      
      const blob = new Blob([csvContent], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', `TFT_Members_${new Date().toISOString().split('T')[0]}.xlsx`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      console.log("✅ Excel export completed!")
      alert(`Successfully exported ${exportData.length} members to Excel!`)
      
    } catch (error) {
      console.error("❌ Excel export failed:", error)
      alert("Excel export failed. Check console for details.")
    } finally {
      setExporting(false)
    }
  }

  // Toggle field selection
  const toggleField = (fieldKey) => {
    setSelectedFields(prev => ({
      ...prev,
      [fieldKey]: !prev[fieldKey]
    }))
  }

  // Quick select presets
  const selectAllFields = () => {
    const allSelected = {}
    Object.keys(fieldDefinitions).forEach(key => {
      allSelected[key] = true
    })
    setSelectedFields(allSelected)
  }

  const selectEssentialFields = () => {
    setSelectedFields({
      firstName: true,
      lastName: true,
      mobilePhone1: true,
      province: true,
      farmType: true,
      yearJoined: true,
      contractStatus: true,
      // All others false
      ...Object.keys(fieldDefinitions).reduce((acc, key) => {
        if (!['firstName', 'lastName', 'mobilePhone1', 'province', 'farmType', 'yearJoined', 'contractStatus'].includes(key)) {
          acc[key] = false
        }
        return acc
      }, {})
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-green-700">Loading export data...</h2>
          </div>
        </div>
      </div>
    )
  }

  const selectedFieldCount = Object.values(selectedFields).filter(Boolean).length

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <Button 
            variant="outline" 
            onClick={() => navigate('/')}
            className="mb-4"
          >
            ← Back to Home
          </Button>
          <h1 className="text-3xl font-bold text-green-700">
            Export Member Data
          </h1>
          <p className="text-gray-600 mt-2">
            Download member information in CSV or Excel format
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Field Selection Panel */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Select Fields to Export</h2>
                <div className="space-x-2">
                  <Button variant="outline" size="sm" onClick={selectEssentialFields}>
                    Essential Only
                  </Button>
                  <Button variant="outline" size="sm" onClick={selectAllFields}>
                    Select All
                  </Button>
                </div>
              </div>
              
              {/* Group fields by category */}
              {['Personal', 'Location', 'Farm', 'System'].map(category => (
                <div key={category} className="mb-6">
                  <h3 className="font-medium text-gray-800 mb-3 border-b pb-1">
                    {category} Information
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {Object.entries(fieldDefinitions)
                      .filter(([_, def]) => def.category === category)
                      .map(([fieldKey, fieldDef]) => (
                        <label key={fieldKey} className="flex items-center space-x-2 text-sm">
                          <input
                            type="checkbox"
                            checked={selectedFields[fieldKey]}
                            onChange={() => toggleField(fieldKey)}
                            className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                          />
                          <span className={selectedFields[fieldKey] ? 'font-medium' : ''}>
                            {fieldDef.label}
                          </span>
                        </label>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Export Panel */}
          <div className="space-y-6">
            {/* Preview Panel */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Export Preview</h2>
              
              {/* Search Filter */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Filter Members</label>
                <Input
                  placeholder="Search to filter export..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Members:</span>
                  <span className="font-medium">{members.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Filtered Members:</span>
                  <span className="font-medium">{filteredMembers.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Selected Fields:</span>
                  <span className="font-medium">{selectedFieldCount}</span>
                </div>
              </div>
            </div>

            {/* Export Buttons */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Download</h2>
              
              <div className="space-y-3">
                <Button 
                  onClick={exportToCSV}
                  disabled={exporting || selectedFieldCount === 0 || filteredMembers.length === 0}
                  className="w-full"
                >
                  {exporting ? "Exporting..." : "Export as CSV"}
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={exportToExcel}
                  disabled={exporting || selectedFieldCount === 0 || filteredMembers.length === 0}
                  className="w-full"
                >
                  {exporting ? "Exporting..." : "Export as Excel"}
                </Button>
              </div>
              
              {selectedFieldCount === 0 && (
                <p className="text-red-500 text-sm mt-2">
                  Please select at least one field to export
                </p>
              )}
              
              {filteredMembers.length === 0 && members.length > 0 && (
                <p className="text-red-500 text-sm mt-2">
                  No members match your search filter
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ExportPage