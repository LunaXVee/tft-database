import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"

function HomePage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-green-700 mb-8">
          Tobacco Farmers Trust Database
        </h1>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 mb-4">
            Welcome to the TFT member management system
          </p>
          <div className="space-x-4">
            <Button onClick={() => navigate('/add-member')}>
              Add New Member
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate('/members')}
            >
              View Members
            </Button>
            <Button 
              variant="secondary" 
              onClick={() => navigate('/export')}
            >
              Export Data
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage