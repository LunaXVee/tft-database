import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Button } from "@/components/ui/button"

function App() {
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
            <Button>Add New Member</Button>
            <Button variant="outline">View Members</Button>
            <Button variant="secondary">Export Data</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App