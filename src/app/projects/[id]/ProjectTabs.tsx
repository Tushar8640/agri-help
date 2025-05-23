'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import AddCostForm from './AddCostForm'
import AddCropForm from './AddCropForm'
import AddHarvestForm from './AddHarvestForm'
import { Button } from '@/components/ui/button'

export default function ProjectTabs({
  project,
  costs,
  crops,
  harvests,
}: {
  project: any
  costs: any[]
  crops: any[]
  harvests: any[]
}) {
  const [activeTab, setActiveTab] = useState('costs')

  return (
    <div className="bg-white rounded shadow grid grid-cols-2">
      <div className="border-b border-gray-200">
        <nav className="flex -mb-px">
          <Button
            variant={'ghost'}
            onClick={() => setActiveTab('costs')}
            className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${activeTab === 'costs' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            Costs
          </Button>
          <Button
            variant={'ghost'}
            onClick={() => setActiveTab('crops')}
            className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${activeTab === 'crops' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            Crops
          </Button>
          <Button
            variant={'ghost'}
            onClick={() => setActiveTab('harvests')}
            className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${activeTab === 'harvests' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            Harvests
          </Button>
        </nav>
        <div className="p-4">
          {activeTab === 'costs' && (
            <div>
              <AddCostForm projectId={project.id} />
            </div>
          )}

          {activeTab === 'crops' && (
            <div>
              <AddCropForm projectId={project.id} />
            </div>
          )}

          {activeTab === 'harvests' && (
            <div>
              <AddHarvestForm projectId={project.id} />
            </div>
          )}
        </div>
      </div>



      <div className="p-4 pt-16">
        {activeTab === 'costs' && (
          <div>
            <div className="mt-4">
              <h3 className="font-medium mb-2 text-black">Cost History</h3>
              <div className="overflow-x-auto border rounded">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {costs.map((cost) => (
                      <tr key={cost.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {format(new Date(cost.date), 'MMM d, yyyy')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {cost.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {cost.category}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          ₹{cost.amount.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'crops' && (
          <div>
            <div className="mt-4">
              <h3 className="font-medium mb-2 text-black">Crops Planted</h3>
              <div className="overflow-x-auto  border rounded">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Variety</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Planting Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Area (ha)</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {crops.map((crop) => (
                      <tr key={crop.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {crop.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {crop.variety || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {format(new Date(crop.plantingDate), 'MMM d, yyyy')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {crop.area.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'harvests' && (
          <div>
            <div className="mt-4">
              <h3 className="font-medium mb-2 text-black">Harvest Records</h3>
              <div className="overflow-x-auto  border rounded">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Yield</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quality</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {harvests.map((harvest) => (
                      <tr key={harvest.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {format(new Date(harvest.date), 'MMM d, yyyy')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {harvest.yield.toFixed(2)} units
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {harvest.quality || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {harvest.price ? `₹${harvest.price.toFixed(2)}` : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {harvest.price ? `₹${(harvest.yield * harvest.price).toFixed(2)}` : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}