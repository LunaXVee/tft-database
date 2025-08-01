import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { supabase } from "@/lib/supabase"

function MembersPage() {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState("")
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)

  // Fetch members from database
  useEffect(() => {
    fetchMembers()
  }, [])

  const fetchMembers = async () => {
    try {
      console.log("📥 Fetching members from database...")
      
      const { data, error } = await supabase
        .from('members')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error("❌ Error fetching members:", error)
        return
      }

      console.log("✅ Members fetched successfully:", data)
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
    member.province?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-green-700">Loading members...</h2>
          </div>
        </div>
      </div>
    )
  }

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
            Members Directory
          </h1>
          <p className="text-gray-600 mt-2">
            Manage tobacco farmer members
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          {/* Search and Add Member Header */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex-1 max-w-sm">
              <Input
                placeholder="Search members..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <Button onClick={() => navigate('/add-member')}>
              Add New Member
            </Button>
          </div>

          {/* Members Table */}
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Province</TableHead>
                  <TableHead>Farm Type</TableHead>
                  <TableHead>Year Joined</TableHead>
                  <TableHead>Contract Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMembers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      {searchTerm ? "No members found matching your search." : "No members registered yet."}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredMembers.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell>
                        <div>
                          <button 
                            onClick={() => navigate(`/member/${member.id}`)}
                            className="font-medium text-green-600 hover:text-green-800 hover:underline text-left"
                          >
                            {member.first_name} {member.last_name}
                          </button>
                          <p className="text-sm text-gray-500">{member.email_address || 'No email'}</p>
                        </div>
                      </TableCell>
                      <TableCell>{member.province}</TableCell>
                      <TableCell className="capitalize">{member.farm_type?.replace('_', ' ')}</TableCell>
                      <TableCell>{member.year_joined}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          member.contract_status === 'Active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {member.contract_status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="space-x-2">
                        <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => navigate(`/member/${member.id}/edit`)}
                          >
                            Edit
                          </Button>
                          <Button variant="outline" size="sm">
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          
          <div className="mt-4 text-sm text-gray-500">
            Showing {filteredMembers.length} of {members.length} members
          </div>
        </div>
      </div>
    </div>
  )
}

export default MembersPage