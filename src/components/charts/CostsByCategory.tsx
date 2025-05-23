import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import { Expense } from '../../context/ProjectContext';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

interface CostsByCategoryProps {
  expenses: Expense[];
}

const CostsByCategory: React.FC<CostsByCategoryProps> = ({ expenses }) => {
  // Group expenses by category
  const expensesByCategory: {[key: string]: number} = {};
  expenses.forEach(expense => {
    if (expensesByCategory[expense.category]) {
      expensesByCategory[expense.category] += expense.amount;
    } else {
      expensesByCategory[expense.category] = expense.amount;
    }
  });
  
  // Sort categories by amount
  const sortedCategories = Object.entries(expensesByCategory)
    .sort((a, b) => b[1] - a[1])
    .map(entry => entry[0]);
  
  const data = {
    labels: sortedCategories,
    datasets: [
      {
        data: sortedCategories.map(cat => expensesByCategory[cat]),
        backgroundColor: [
          'rgba(46, 125, 50, 0.7)',   // green - Primary
          'rgba(93, 64, 55, 0.7)',     // brown - Secondary
          'rgba(255, 160, 0, 0.7)',   // amber - Accent
          'rgba(3, 169, 244, 0.7)',   // light blue
          'rgba(156, 39, 176, 0.7)',  // purple
          'rgba(233, 30, 99, 0.7)'    // pink
        ],
        borderColor: [
          'rgb(46, 125, 50)',
          'rgb(93, 64, 55)',
          'rgb(255, 160, 0)',
          'rgb(3, 169, 244)',
          'rgb(156, 39, 176)',
          'rgb(233, 30, 99)'
        ],
        borderWidth: 1,
      },
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
            const label = context.label || '';
            const value = context.raw;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: $${value.toLocaleString()} (${percentage}%)`;
          }
        }
      }
    }
  };

  return (
    <div style={{ height: '200px' }}>
      {Object.keys(expensesByCategory).length > 0 ? (
        <Doughnut data={data} options={options as any} />
      ) : (
        <div className="h-full flex items-center justify-center text-gray-500">
          No expense data available
        </div>
      )}
    </div>
  );
};

export default CostsByCategory;