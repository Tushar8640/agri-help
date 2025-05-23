import { format } from 'date-fns'
import Link from 'next/link'
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

  const costData = {
    labels: Object.keys(costByCategory),
    datasets: [
      {
        label: 'Cost by Category',
        data: Object.values(costByCategory),
        backgroundColor: [
          'rgba(255, 99, 132, 0.7)',
          'rgba(54, 162, 235, 0.7)',
          'rgba(255, 206, 86, 0.7)',
          'rgba(75, 192, 192, 0.7)',
          'rgba(153, 102, 255, 0.7)',
        ],
      },
    ],
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold">{project.name}</h1>
          <p className="text-gray-600">{project.description}</p>
        </div>
        <Link
          href={`/projects/${project.id}/edit`}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Edit Project
        </Link>
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
          <p className="text-2xl">{totalHarvest.toFixed(2)} units</p>
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

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Cost Breakdown</h2>
          {/* <BarChart data={costData} /> */}
        </div>
        <div className="p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Project Report</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">Financial Summary</h3>
              <p>Total Costs: ৳{totalCost.toFixed(2)}</p>
              <p>Total Revenue: ৳{totalRevenue.toFixed(2)}</p>
              <p>Net Profit: ৳{profit.toFixed(2)}</p>
              <p>Profit per Unit: ৳{profitPerUnit.toFixed(2)}</p>
              <p>Cost per Unit: ৳{costPerUnit.toFixed(2)}</p>
            </div>
            <div>
              <h3 className="font-medium">Harvest Summary</h3>
              <p>Expected Yield: {project.expectedYield} units</p>
              <p>Actual Yield: {totalHarvest.toFixed(2)} units</p>
              <p>Yield Percentage: {((totalHarvest / project.expectedYield) * 100 || 0).toFixed(2)}%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}