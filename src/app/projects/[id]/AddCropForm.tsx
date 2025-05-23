'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createCrop } from '@/app/actions/projects'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function AddCropForm({ projectId }: { projectId: number }) {
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    const [formData, setFormData] = useState({
        name: '',
        variety: '',
        plantingDate: new Date().toISOString().split('T')[0],
        area: '',
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            const response = await createCrop({
                ...formData,
                area: parseFloat(formData.area),
                plantingDate: new Date(formData.plantingDate),
                projectId,
            })

            if (response) {
                router.refresh()
                setFormData({
                    name: '',
                    variety: '',
                    plantingDate: new Date().toISOString().split('T')[0],
                    area: '',
                })
            }
            setIsLoading(false)
        } catch (error) {
            console.error('Error adding crop:', error)
            setIsLoading(false)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    return (
        <div className="bg-gray-50 p-4 rounded mb-4">
            <h3 className="font-medium mb-2">Add New Crop</h3>
            <form onSubmit={handleSubmit} className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Crop Name
                        </label>
                        <Input
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
                        <label htmlFor="variety" className="block text-sm font-medium text-gray-700">
                            Variety (Optional)
                        </label>
                        <Input
                            type="text"
                            id="variety"
                            name="variety"
                            value={formData.variety}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="plantingDate" className="block text-sm font-medium text-gray-700">
                            Planting Date
                        </label>
                        <Input
                            type="date"
                            id="plantingDate"
                            name="plantingDate"
                            value={formData.plantingDate}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="area" className="block text-sm font-medium text-gray-700">
                            Area (acres)
                        </label>
                        <Input
                            type="number"
                            id="area"
                            name="area"
                            value={formData.area}
                            onChange={handleChange}
                            required
                            step="0.01"
                            min="0.01"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                        />
                    </div>
                </div>

                <div className="flex justify-end">
                    <Button
                        type="submit"                    >
                        {isLoading ? 'Adding...' : 'Add Crop'}
                    </Button>
                </div>
            </form>
        </div>
    )
}