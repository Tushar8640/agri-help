import ProjectTabs from './ProjectTabs'
import { getProjectDetails } from '@/app/actions/projects'


export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const project = await getProjectDetails(id)

  if (!project) {
    return <div>Project not found</div>
  }

  // Calculate project statistics
  const totalCost = project.costs.reduce((sum, cost) => sum + cost.amount, 0)
  const totalHarvest = project.harvests.reduce((sum, harvest) => sum + harvest.yield, 0)
  const totalRevenue = project.harvests.reduce((sum, harvest) => sum + (harvest.yield * (harvest.price || 0)), 0)
  const profit = totalRevenue - totalCost
  const profitPerUnit = totalHarvest > 0 ? profit / totalHarvest : 0
  const costPerUnit = totalHarvest > 0 ? totalCost / totalHarvest : 0

  // Prepare data for charts
  const costByCategory = project.costs.reduce((acc, cost) => {
    acc[cost.category] = (acc[cost.category] || 0) + cost.amount
    return acc
  }, {} as Record<string, number>)

  const costBreakdown = project.costs.reduce((acc, cost) => {
    // Group by category and sum amounts
    if (!acc[cost.category]) {
      acc[cost.category] = 0;
    }
    acc[cost.category] += cost.amount;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold">{project.name}</h1>
          <p className="text-gray-600">{project.description}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="p-4 rounded shadow">
          <h3 className="font-medium text-gray-500">Land Area</h3>
          <p className="text-2xl">{project.landArea} acres</p>
        </div>
        <div className="p-4 rounded shadow">
          <h3 className="font-medium text-gray-500">Total Cost</h3>
          <p className="text-2xl">৳{totalCost.toFixed(2)}</p>
        </div>
        <div className="p-4 rounded shadow">
          <h3 className="font-medium text-gray-500">Total Harvest</h3>
          <p className="text-2xl">{totalHarvest.toFixed(2)} KG || {Number(totalHarvest.toFixed(2)) / 40} Mon</p>
          <p className="text-sm">Sell: {totalRevenue.toFixed(2)} TK</p>
        </div>
        <div className="p-4 rounded shadow">
          <h3 className="font-medium text-gray-500">Profit/Loss</h3>
          <p className={`text-2xl ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            ৳{Math.abs(profit).toFixed(2)} {profit >= 0 ? 'Profit' : 'Loss'}
          </p>
        </div>
      </div>

      <ProjectTabs
        project={project}
        costs={project.costs}
        crops={project.crops}
        harvests={project.harvests}
      />
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cost Breakdown Card */}
        <div className="col-span-1 bg-white rounded-xl shadow-md overflow-hidden p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-200">Cost Breakdown</h2>
          <div className="space-y-5">
            {/* Seeds */}
            {costBreakdown.seeds && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Seeds</span>
                <span className="font-medium">৳{costBreakdown.seeds.toFixed(2)}</span>
              </div>
            )}

            {/* Fertilizer */}
            {costBreakdown.fertilizer && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Fertilizer</span>
                <span className="font-medium">৳{costBreakdown.fertilizer.toFixed(2)}</span>
              </div>
            )}

            {/* Labor */}
            {costBreakdown.labor && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Labor</span>
                <span className="font-medium">৳{costBreakdown.labor.toFixed(2)}</span>
              </div>
            )}

            {/* Equipment */}
            {costBreakdown.equipment && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Equipment</span>
                <span className="font-medium">৳{costBreakdown.equipment.toFixed(2)}</span>
              </div>
            )}

            {/* Other */}
            {costBreakdown.other && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Other</span>
                <span className="font-medium">৳{costBreakdown.other.toFixed(2)}</span>
              </div>
            )}

            {/* Total */}
            <div className="pt-4 mt-4 border-t border-gray-200 flex justify-between items-center">
              <span className="font-semibold text-gray-800">Total Costs</span>
              <span className="font-bold text-lg">৳{totalCost.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Financial Summary Card */}
        <div className="col-span-1 bg-white rounded-xl shadow-md overflow-hidden p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-200">Financial Summary</h2>
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">Revenue</h3>
              <p className="flex justify-between">
                <span>Total Revenue:</span>
                <span className="font-medium">৳{totalRevenue.toFixed(2)}</span>
              </p>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-2">Profit Analysis</h3>
              <p className="flex justify-between">
                <span>Net Profit:</span>
                <span className={`font-medium ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ৳{profit.toFixed(2)}
                </span>
              </p>
              <p className="flex justify-between mt-2">
                <span>Profit Margin:</span>
                <span className="font-medium">
                  {totalRevenue > 0 ? ((profit / totalRevenue) * 100).toFixed(2) : 0}%
                </span>
              </p>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-semibold text-purple-800 mb-2">Unit Economics</h3>
              <p className="flex justify-between">
                <span>Cost per Unit:</span>
                <span className="font-medium">৳{costPerUnit.toFixed(2)}</span>
              </p>
              <p className="flex justify-between mt-2">
                <span>Profit per Unit:</span>
                <span className="font-medium">৳{profitPerUnit.toFixed(2)}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Harvest Summary Card */}
        <div className="col-span-1 bg-white rounded-xl shadow-md overflow-hidden p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-200">Harvest Summary</h2>
          <div className="space-y-5">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Expected Yield</span>
              <span className="font-medium">{project.expectedYield} units</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Actual Yield</span>
              <span className="font-medium">{totalHarvest.toFixed(2)} units</span>
            </div>
            <div className="pt-2">
              <div className="flex justify-between mb-1">
                <span className="text-gray-600">Yield Percentage</span>
                <span className="font-medium">
                  {((totalHarvest / project.expectedYield) * 100 || 0).toFixed(2)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-green-600 h-2.5 rounded-full"
                  style={{ width: `${Math.min(100, ((totalHarvest / project.expectedYield) * 100) || 0)}%` }}
                ></div>
              </div>
            </div>
            <div className="pt-4 mt-4 border-t border-gray-200">
              <h3 className="font-semibold text-gray-800 mb-2">Harvest Conversion</h3>
              <p className="flex justify-between">
                <span>Total KG:</span>
                <span className="font-medium">{totalHarvest.toFixed(2)} KG</span>
              </p>
              <p className="flex justify-between mt-1">
                <span>Equivalent Bags (40kg):</span>
                <span className="font-medium">{(totalHarvest / 40).toFixed(1)} bags</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}