'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { format } from 'date-fns'
import { createProject } from '@/app/actions/projects'
import { Button } from '@/components/ui/button'

export default function NewProjectPage() {
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        landArea: '',
        startDate: format(new Date(), 'yyyy-MM-dd'),
        expectedHarvestDate: '',
        targetSellPrice: '',
        expectedYield: '',
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            const data = {
                name: formData.name,
                description: formData.description,
                landArea: parseFloat(formData.landArea),
                startDate: new Date(formData.startDate),
                expectedHarvestDate: new Date(formData.expectedHarvestDate),
                targetSellPrice: parseFloat(formData.targetSellPrice),
                expectedYield: parseFloat(formData.expectedYield),
                userId: 1
            }

            const response = await createProject(data)


            console.log("this is response", response)
            if (response) {
                router.push(`/projects/${response.id}`)
            } else {
                console.error('Failed to create project', response)
            }
            setIsLoading(false)
        } catch (error) {
            console.error('Error creating project:', error)
            setIsLoading(false)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className='max-w-lg mx-auto'>
                <h1 className="text-3xl font-bold mb-8">Create New Project</h1>

                <form onSubmit={handleSubmit} className="max-w-lg space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Project Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                            Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={3}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="landArea" className="block text-sm font-medium text-gray-700">
                            Land Area (acres)
                        </label>
                        <input
                            type="number"
                            id="landArea"
                            name="landArea"
                            value={formData.landArea}
                            onChange={handleChange}
                            required
                            step="0.01"
                            min="0"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                            Start Date
                        </label>
                        <input
                            type="date"
                            id="startDate"
                            name="startDate"
                            value={formData.startDate}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="expectedHarvestDate" className="block text-sm font-medium text-gray-700">
                            Expected Harvest Date
                        </label>
                        <input
                            type="date"
                            id="expectedHarvestDate"
                            name="expectedHarvestDate"
                            value={formData.expectedHarvestDate}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="targetSellPrice" className="block text-sm font-medium text-gray-700">
                            Target Sell Price (per unit)
                        </label>
                        <input
                            type="number"
                            id="targetSellPrice"
                            name="targetSellPrice"
                            value={formData.targetSellPrice}
                            onChange={handleChange}
                            required
                            step="0.01"
                            min="0"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="expectedYield" className="block text-sm font-medium text-gray-700">
                            Expected Yield (total units)
                        </label>
                        <input
                            type="number"
                            id="expectedYield"
                            name="expectedYield"
                            value={formData.expectedYield}
                            onChange={handleChange}
                            required
                            step="0.01"
                            min="0"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                        />
                    </div>

                    <div className="flex justify-end space-x-4 pt-4">
                        <Button
                            type="button"
                            onClick={() => router.push('/projects')}
                            className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
    
                        >
                            Create Project
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}