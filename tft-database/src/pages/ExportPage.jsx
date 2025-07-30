import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"

function ExportPage() {
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
            Export Data
          </h1>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 mb-4">
            Export functionality will go here
          </p>
          <div className="space-x-4">
            <Button>Export as CSV</Button>
            <Button variant="outline">Export as Excel</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ExportPage