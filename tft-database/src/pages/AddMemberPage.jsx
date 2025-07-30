import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"

function AddMemberPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button 
            variant="outline" 
            onClick={() => navigate('/')}
            className="mb-4"
          >
            ← Back to Home
          </Button>
          <h1 className="text-3xl font-bold text-green-700">
            Add New Member
          </h1>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600">
            Member registration form will go here
          </p>
        </div>
      </div>
    </div>
  )
}

export default AddMemberPage