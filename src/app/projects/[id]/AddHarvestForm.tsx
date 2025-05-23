'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createHarvest } from '@/app/actions/projects'
import { Button } from '@/components/ui/button'

export default function AddHarvestForm({ projectId }: { projectId: number }) {
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        yield: '',
        quality: 'good',
        price: '',
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            const response = await createHarvest({
                ...formData,
                yield: parseFloat(formData.yield),
                price: formData.price ? parseFloat(formData.price) : null,
                date: new Date(formData.date),
                projectId,
            })

            if (response) {
                router.refresh()
                setFormData({
                    date: new Date().toISOString().split('T')[0],
                    yield: '',
                    quality: 'good',
                    price: '',
                })
            }
            setIsLoading(false)
        } catch (error) {
            console.error('Error adding harvest:', error)
            setIsLoading(false)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    return (
        <div className="bg-gray-50 p-4 rounded mb-4">
            <h3 className="font-medium mb-2">Add Harvest Record</h3>
            <form onSubmit={handleSubmit} className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                            Harvest Date
                        </label>
                        <input
                            type="date"
                            id="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="yield" className="block text-sm font-medium text-gray-700">
                            Yield (kg/units)
                        </label>
                        <input
                            type="number"
                            id="yield"
                            name="yield"
                            value={formData.yield}
                            onChange={handleChange}
                            required
                            step="0.01"
                            min="0.01"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="quality" className="block text-sm font-medium text-gray-700">
                            Quality
                        </label>
                        <select
                            id="quality"
                            name="quality"
                            value={formData.quality}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                        >
                            <option value="excellent">Excellent</option>
                            <option value="good">Good</option>
                            <option value="average">Average</option>
                            <option value="poor">Poor</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                            Selling Price (per unit, optional)
                        </label>
                        <input
                            type="number"
                            id="price"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            step="0.01"
                            min="0"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                        />
                    </div>
                </div>

                <div className="flex justify-end">
                    <Button
                        type="submit"

                    >
                        {isLoading ? 'Adding...' : 'Add Harvest'}
                    </Button>
                </div>
            </form>
        </div>
    )
}