"use client"

import React from 'react';
import { 
  Calendar, Ruler, DollarSign, BarChart3, 
  ChevronRight, CloudRain, AlertTriangle
} from 'lucide-react';

import Link from 'next/link';


const ProjectCard = ({ project }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Planning': return 'bg-blue-100 text-blue-800';
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Harvested': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getWeatherRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low': return 'text-green-600';
      case 'Medium': return 'text-amber-600';
      case 'High': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden transition-all hover:shadow-md">
      <div className="border-b border-gray-100 p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-gray-800 line-clamp-1">{project.name}</h3>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
            {project.status}
          </span>
        </div>
        <p className="text-sm text-gray-600 mb-2">
          {project.cropType} · {project.area} {project.areaUnit}
        </p>
        
        {/* Progress bar */}
        <div className="mb-3">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-gray-500">Progress</span>
            <span className="font-medium text-gray-700">{project.progress}%</span>
          </div>
          <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-green-600 rounded-full"
              style={{ width: `${project.progress}%` }}
            ></div>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center text-sm">
            <Calendar className="h-4 w-4 mr-1 text-gray-500" />
            <span className="text-gray-700">{new Date(project.startDate).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center text-sm">
            <DollarSign className="h-4 w-4 mr-1 text-gray-500" />
            <span className="text-gray-700">${project.budget.toLocaleString()}</span>
          </div>
          <div className="flex items-center text-sm">
            <BarChart3 className="h-4 w-4 mr-1 text-gray-500" />
            <span className="text-gray-700">${project.expenses.toLocaleString()}</span>
          </div>
          <div className="flex items-center text-sm">
            <CloudRain className="h-4 w-4 mr-1 text-gray-500" />
            <div className="flex items-center">
              <span className="mr-1">{project.weather.forecast}</span>
              {project.weather.risk !== 'Low' && (
                <AlertTriangle className={`h-3 w-3 ${getWeatherRiskColor(project.weather.risk)}`} />
              )}
            </div>
          </div>
        </div>
        
        <Link
          href={`/projects/${project.id}`}
          className="w-full py-2 flex justify-center items-center text-sm font-medium text-green-700 bg-green-50 rounded-md hover:bg-green-100 transition-colors"
        >
          View Details
          <ChevronRight className="h-4 w-4 ml-1" />
        </Link>
      </div>
    </div>
  );
};

export default ProjectCard;