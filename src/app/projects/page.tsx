
import Link from 'next/link'
import { format } from 'date-fns'
import { getProjects } from '../actions/projects'
import { Key, ReactElement, JSXElementConstructor, ReactNode, ReactPortal, AwaitedReactNode } from 'react'


export default async function ProjectsPage() {

  const projects = await getProjects()

  const calculateProjectStats = (project: any) => {
    const totalCost = project.costs.reduce((sum: number, cost: any) => sum + cost.amount, 0)
    const totalHarvest = project.harvests.reduce((sum: number, harvest: any) => sum + harvest.yield, 0)
    const totalRevenue = project.harvests.reduce((sum: number, harvest: any) => sum + (harvest.yield * (harvest.price || 0)), 0)
    const profit = totalRevenue - totalCost
    const profitPerUnit = totalHarvest > 0 ? profit / totalHarvest : 0

    return {
      totalCost,
      totalHarvest,
      totalRevenue,
      profit,
      profitPerUnit,
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Your Agricultural Projects</h1>
        <Link href="/projects/new" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          Add New Project
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects && projects.map((project: { id: Key | null | undefined; name: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<AwaitedReactNode> | null | undefined; description: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<AwaitedReactNode> | null | undefined; landArea: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<AwaitedReactNode> | null | undefined; expectedHarvestDate: string | number | Date }) => {
          const stats = calculateProjectStats(project)
          return (
            <Link
              key={project.id}
              href={`/projects/${project.id}`}
              className="border rounded-lg p-4 hover:shadow-lg transition-shadow"
            >
              <h2 className="text-xl font-semibold mb-2">{project.name}</h2>
              <p className="text-gray-600 mb-2">{project.description}</p>
              <div className="grid grid-cols-2 gap-2 mb-2">
                <div>
                  <p className="text-sm text-gray-500">Land Area</p>
                  <p>{project.landArea} acres</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Expected Harvest</p>
                  <p>{format(new Date(project.expectedHarvestDate), 'MMM d, yyyy')}</p>
                </div>
              </div>
              <div className="mt-4">
                <p className={`text-lg font-medium ${stats.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {stats.profit >= 0 ? 'Profit' : 'Loss'}: ৳{Math.abs(stats.profit).toFixed(2)}
                </p>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}