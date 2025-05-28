"use client"

import React from 'react';

import {
  BarChart3, Tractor, DollarSign, LineChart, CalendarRange,
  Sprout, CloudRain, ArrowUpRight, AlertTriangle
} from 'lucide-react';
import StatCard from '../components/StatCard';
import WeatherWidget from '../components/WeatherWidget';
import ProjectProgressChart from '../components/charts/ProjectProgressChart';
import CostsByCategory from '../components/charts/CostsByCategory';
import YieldForecast from '../components/charts/YieldForecast';
import ProjectsTimeline from '../components/ProjectsTimeline';
import { useProjects } from '@/context/ProjectContext';
import { useWeather } from '@/context/WeatherContext';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { InstallPrompt, PushNotificationManager, PWAStatus } from '@/components/PwaComponents';
import { InstallButton } from '@/components/InstallPwa';

const Dashboard: React.FC = () => {
  const { projects, expenses, loading } = useProjects();
  const { weather, loading: weatherLoading } = useWeather();

  if (loading || weatherLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-700"></div>
      </div>
    );
  }

  // Calculate stats
  const activeProjects = projects.filter(p => p.status === 'Active').length;
  const totalBudget = projects.reduce((sum, project) => sum + project.budget, 0);
  const totalExpenses = projects.reduce((sum, project) => sum + project.expenses, 0);
  const completedProjects = projects.filter(p => p.status === 'Harvested').length;

  // Calculate expenses by category
  const expenseCategories = {
    Seeds: 0,
    Fertilizer: 0,
    Pesticides: 0,
    Labor: 0,
    Equipment: 0,
    Other: 0
  };

  expenses.forEach(expense => {
    expenseCategories[expense.category] += expense.amount;
  });

  // Find projects with high weather risk
  const highRiskProjects = projects.filter(p => p.weather.risk === 'High');

  return (
    <div className="pb-20 md:pb-6">
      {/* Stats Overview */}
      {/* <div>
        <h1 className="text-3xl font-bold text-center mb-8">My PWA App</h1>
        <InstallButton />

        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
          <InstallPrompt />
          <PWAStatus />
          <InstallPrompt />

        </div>

        <PushNotificationManager />
      </div> */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Active Projects"
          value={activeProjects.toString()}
          icon={<Tractor className="w-5 h-5 text-green-700" />}
          change="+2 this month"
          trend="up"
        />
        <StatCard
          title="Total Budget"
          value={`$${totalBudget.toLocaleString()}`}
          icon={<DollarSign className="w-5 h-5 text-green-700" />}
          change="15% allocated"
          trend="neutral"
        />
        <StatCard
          title="Total Expenses"
          value={`$${totalExpenses.toLocaleString()}`}
          icon={<BarChart3 className="w-5 h-5 text-amber-600" />}
          change={`${Math.round((totalExpenses / totalBudget) * 100)}% of budget`}
          trend={totalExpenses > totalBudget * 0.8 ? "down" : "up"}
        />
        <StatCard
          title="Completed Projects"
          value={completedProjects.toString()}
          icon={<Sprout className="w-5 h-5 text-green-700" />}
          change="On target"
          trend="up"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Charts Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Project Progress Chart */}
          <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Project Progress</h3>
              <Link href="/projects" className="text-sm text-green-700 hover:text-green-800 flex items-center">
                View All <ArrowUpRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
            <ProjectProgressChart projects={projects} />
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Costs by Category</h3>
              <CostsByCategory expenses={expenses} />
            </div>
            <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Yield Forecast</h3>
              <YieldForecast projects={projects} />
            </div>
          </div>

          {/* Projects Timeline */}
          <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Project Timeline</h3>
              <div className="flex items-center text-sm text-gray-500">
                <CalendarRange className="w-4 h-4 mr-1" />
                <span>2024-2025</span>
              </div>
            </div>
            <ProjectsTimeline projects={projects} />
          </div>
        </div>

        {/* Sidebar Column */}
        <div className="space-y-6">
          {/* Weather Widget */}
          <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Weather</h3>
              <CloudRain className="w-5 h-5 text-blue-500" />
            </div>
            <WeatherWidget />
          </div>

          {/* Risk Alerts */}
          {highRiskProjects.length > 0 && (
            <div className="bg-red-50 p-5 rounded-lg shadow-sm border border-red-100">
              <div className="flex items-center mb-4">
                <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
                <h3 className="text-lg font-semibold text-red-800">Weather Alerts</h3>
              </div>
              <ul className="space-y-3">
                {highRiskProjects.map(project => (
                  <li key={project.id} className="flex items-start">
                    <div className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-red-500 mr-2"></div>
                    <div>
                      <Link href={`/projects/${project.id}`} className="font-medium text-red-700 hover:text-red-800">
                        {project.name}
                      </Link>
                      <p className="text-sm text-red-600">
                        {project.weather.forecast} conditions may affect crop.
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
              <Button className="">
                View Detailed Forecast
              </Button>
            </div>
          )}

          {/* Recent Activities */}
          <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activities</h3>
            <ul className="space-y-3">
              <li className="border-l-2 border-green-500 pl-4 py-1">
                <p className="font-medium text-gray-800">Fertilizer Application</p>
                <p className="text-sm text-gray-600">Winter Wheat - Field 3</p>
                <p className="text-xs text-gray-500">Today, 9:30 AM</p>
              </li>
              <li className="border-l-2 border-amber-500 pl-4 py-1">
                <p className="font-medium text-gray-800">Equipment Maintenance</p>
                <p className="text-sm text-gray-600">Tractor #102</p>
                <p className="text-xs text-gray-500">Yesterday, 2:15 PM</p>
              </li>
              <li className="border-l-2 border-blue-500 pl-4 py-1">
                <p className="font-medium text-gray-800">Irrigation Scheduled</p>
                <p className="text-sm text-gray-600">Soybean Field 3</p>
                <p className="text-xs text-gray-500">Jan 12, 8:00 AM</p>
              </li>
              <li className="border-l-2 border-purple-500 pl-4 py-1">
                <p className="font-medium text-gray-800">New Project Added</p>
                <p className="text-sm text-gray-600">Spring Corn</p>
                <p className="text-xs text-gray-500">Jan 10, 11:45 AM</p>
              </li>
            </ul>
            <Button >
              View All Activities
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;