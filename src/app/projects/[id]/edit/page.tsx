'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'

export default function EditProjectPage({
  params,
}: {
  params: { id: string }
}) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    landArea: '',
    startDate: '',
    expectedHarvestDate: '',
    targetSellPrice: '',
    expectedYield: '',
  })

  // Fetch project data
  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch(`/api/projects/${params.id}`)
        if (response.ok) {
          const project = await response.json()
          setFormData({
            name: project.name,
            description: project.description || '',
            landArea: project.landArea.toString(),
            startDate: format(new Date(project.startDate), 'yyyy-MM-dd'),
            expectedHarvestDate: format(new Date(project.expectedHarvestDate), 'yyyy-MM-dd'),
            targetSellPrice: project.targetSellPrice.toString(),
            expectedYield: project.expectedYield.toString(),
          })
        }
      } catch (error) {
        console.error('Error fetching project:', error)
      }
    }

    fetchProject()
  }, [params.id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const response = await fetch(`/api/projects/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        router.push(`/projects/${params.id}`)
      }
    } catch (error) {
      console.error('Error updating project:', error)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Edit Project</h1>
      
      <form onSubmit={handleSubmit} className="max-w-lg space-y-4">
        {/* Same form fields as NewProjectPage */}
        {/* ... */}
        
        <div className="flex justify-end space-x-4 pt-4">
          <Button
            type="button"
            onClick={() => router.push(`/projects/${params.id}`)}
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Update Project
          </Button>
        </div>
      </form>
    </div>
  )
}