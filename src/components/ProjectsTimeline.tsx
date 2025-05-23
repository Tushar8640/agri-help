import React from 'react';


const ProjectsTimeline= ({ projects }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Planning': return 'bg-blue-500';
      case 'Active': return 'bg-green-500';
      case 'Harvested': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  // Get min and max dates for the timeline
  const dates = projects.flatMap(p => [
    new Date(p.startDate).getTime(),
    p.endDate ? new Date(p.endDate).getTime() : new Date().getTime() + 30 * 24 * 60 * 60 * 1000 // Default to 30 days after current date
  ]);
  
  const minDate = new Date(Math.min(...dates));
  const maxDate = new Date(Math.max(...dates));
  
  // Format date for display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };
  
  // Calculate project bar position and width
  const calculateBarStyles = (project) => {
    const start = new Date(project.startDate).getTime();
    const end = project.endDate 
      ? new Date(project.endDate).getTime() 
      : new Date().getTime() + 30 * 24 * 60 * 60 * 1000; // Default to 30 days after current date
    
    const totalDuration = maxDate.getTime() - minDate.getTime();
    const startOffset = ((start - minDate.getTime()) / totalDuration) * 100;
    const width = ((end - start) / totalDuration) * 100;
    
    return {
      left: `${startOffset}%`,
      width: `${width}%`
    };
  };

  return (
    <div className="mt-2">
      {/* Timeline header */}
      <div className="flex justify-between text-xs text-gray-500 mb-2">
        <span>{formatDate(minDate)}</span>
        <span>{formatDate(maxDate)}</span>
      </div>
      
      {/* Timeline bars */}
      <div className="space-y-4">
        {projects.map(project => (
          <div key={project.id} className="relative">
            <div className="flex justify-between items-center mb-1">
              <div className="text-sm font-medium text-gray-800 truncate pr-4">{project.name}</div>
              <div className="text-xs text-gray-500">
                {formatDate(new Date(project.startDate))}
                {project.endDate && ` - ${formatDate(new Date(project.endDate))}`}
              </div>
            </div>
            <div className="h-1 w-full bg-gray-200 rounded-full">
              <div
                className={`h-full rounded-full ${getStatusColor(project.status)}`}
                style={calculateBarStyles(project)}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectsTimeline;