import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Project } from '../../context/ProjectContext';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface YieldForecastProps {
  projects: Project[];
}

const YieldForecast: React.FC<YieldForecastProps> = ({ projects }) => {
  // Only include projects with yield data or active projects
  const relevantProjects = projects.filter(p => p.yield || p.status === 'Active');
  
  // Sort projects by date
  const sortedProjects = [...relevantProjects].sort((a, b) => 
    new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  );
  
  // Generate forecast data (simplified)
  const actualYields = sortedProjects.map(p => p.yield || 0);
  
  // For active projects without yield, create forecast
  const forecastYields = sortedProjects.map((p, i) => {
    if (p.yield) return null; // Already harvested
    
    // Simple forecast based on average of previous yields
    const previousYields = actualYields.slice(0, i).filter(y => y > 0);
    if (previousYields.length > 0) {
      const avgYield = previousYields.reduce((sum, y) => sum + y, 0) / previousYields.length;
      // Add some variability
      return Math.round(avgYield * (0.9 + Math.random() * 0.3));
    }
    
    // Default forecast
    return Math.round(100 + Math.random() * 50);
  });
  
  const data = {
    labels: sortedProjects.map(p => p.name),
    datasets: [
      {
        label: 'Actual Yield',
        data: actualYields,
        borderColor: 'rgb(46, 125, 50)',
        backgroundColor: 'rgba(46, 125, 50, 0.5)',
        pointBackgroundColor: 'rgb(46, 125, 50)',
        pointRadius: 4
      },
      {
        label: 'Forecast',
        data: forecastYields,
        borderColor: 'rgb(255, 160, 0)',
        backgroundColor: 'rgba(255, 160, 0, 0.5)',
        borderDash: [5, 5],
        pointBackgroundColor: 'rgb(255, 160, 0)',
        pointRadius: 4
      }
    ],
  };
  
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          usePointStyle: true,
          boxWidth: 8,
          padding: 20
        }
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const label = context.dataset.label || '';
            const value = context.raw;
            if (value === null || value === undefined) return '';
            return `${label}: ${value} tons`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Yield (tons)'
        }
      }
    }
  };

  return (
    <div style={{ height: '200px' }}>
      {relevantProjects.length > 0 ? (
        <Line data={data} options={options as any} />
      ) : (
        <div className="h-full flex items-center justify-center text-gray-500">
          No yield data available
        </div>
      )}
    </div>
  );
};

export default YieldForecast;