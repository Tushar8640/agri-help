import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Project } from '../../context/ProjectContext';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface ProjectProgressChartProps {
  projects: Project[];
}

const ProjectProgressChart: React.FC<ProjectProgressChartProps> = ({ projects }) => {
  // Sort projects by progress
  const sortedProjects = [...projects].sort((a, b) => b.progress - a.progress);
  
  const data = {
    labels: sortedProjects.map(p => p.name),
    datasets: [
      {
        label: 'Progress (%)',
        data: sortedProjects.map(p => p.progress),
        backgroundColor: sortedProjects.map(p => {
          switch(p.status) {
            case 'Planning': return 'rgba(59, 130, 246, 0.7)'; // blue
            case 'Active': return 'rgba(16, 185, 129, 0.7)';   // green
            case 'Harvested': return 'rgba(139, 92, 246, 0.7)'; // purple
            default: return 'rgba(156, 163, 175, 0.7)';        // gray
          }
        }),
        borderColor: sortedProjects.map(p => {
          switch(p.status) {
            case 'Planning': return 'rgb(29, 78, 216)';
            case 'Active': return 'rgb(4, 120, 87)';
            case 'Harvested': return 'rgb(109, 40, 217)';
            default: return 'rgb(107, 114, 128)';
          }
        }),
        borderWidth: 1,
      },
    ],
  };
  
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return `Progress: ${context.raw}%`;
          },
          afterLabel: function(context: any) {
            const project = sortedProjects[context.dataIndex];
            return [
              `Status: ${project.status}`,
              `Budget: $${project.budget.toLocaleString()}`,
              `Expenses: $${project.expenses.toLocaleString()}`
            ];
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: function(value: any) {
            return value + '%';
          }
        }
      },
      x: {
        ticks: {
          maxRotation: 45,
          minRotation: 45
        }
      }
    }
  };

  return (
    <div style={{ height: '300px' }}>
      <Bar data={data} options={options as any} />
    </div>
  );
};

export default ProjectProgressChart;