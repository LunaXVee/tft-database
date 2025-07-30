import { useState } from "react"
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
import { sampleMembers } from "@/data/sampleMembers"

function MembersPage() {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState("")
  
  // Filter members based on search term
  const filteredMembers = sampleMembers.filter(member =>
    member.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.province.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
            Manage TFT farmer members
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
                {filteredMembers.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{member.firstName} {member.lastName}</p>
                        <p className="text-sm text-gray-500">{member.emailAddress}</p>
                      </div>
                    </TableCell>
                    <TableCell>{member.province}</TableCell>
                    <TableCell>{member.farmType}</TableCell>
                    <TableCell>{member.yearJoined}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        member.contractStatus === 'Active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {member.contractStatus}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="space-x-2">
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                        <Button variant="outline" size="sm">
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          <div className="mt-4 text-sm text-gray-500">
            Showing {filteredMembers.length} of {sampleMembers.length} members
          </div>
        </div>
      </div>
    </div>
  )
}

export default MembersPage