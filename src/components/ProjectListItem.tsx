import React from 'react';
import { Calendar, MapPin, ChevronRight } from 'lucide-react';
import { Project } from '../../../agri/project/src/context/ProjectContext';
import Link from 'next/link';

interface ProjectListItemProps {
  project: Project;
}

const ProjectListItem: React.FC<ProjectListItemProps> = ({ project }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Planning': return 'bg-blue-100 text-blue-800';
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Harvested': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <Link
      href={`/projects/${project.id}`}
      className="grid grid-cols-12 gap-4 px-4 py-3 border-b border-gray-200 text-sm hover:bg-gray-50 transition-colors"
    >
      <div className="col-span-5 md:col-span-4 flex items-center">
        <div>
          <div className="font-medium text-gray-800">{project.name}</div>
          <div className="text-xs text-gray-500">{project.cropType}</div>
        </div>
      </div>
      <div className="col-span-3 md:col-span-2 flex items-center">
        <Calendar className="h-4 w-4 mr-1 text-gray-400 flex-shrink-0" />
        <span className="truncate">{new Date(project.startDate).toLocaleDateString()}</span>
      </div>
      <div className="col-span-2 hidden md:flex items-center">
        <MapPin className="h-4 w-4 mr-1 text-gray-400 flex-shrink-0" />
        <span>{project.area} {project.areaUnit}</span>
      </div>
      <div className="col-span-2 hidden md:flex items-center">
        <div className="w-full mr-2">
          <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-green-600 rounded-full"
              style={{ width: `${project.progress}%` }}
            ></div>
          </div>
        </div>
        <span className="text-xs">{project.progress}%</span>
      </div>
      <div className="col-span-4 md:col-span-2 flex items-center justify-end">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
          {project.status}
        </span>
        <ChevronRight className="h-4 w-4 ml-2 text-gray-400" />
      </div>
    </Link>
  );
};

export default ProjectListItem;