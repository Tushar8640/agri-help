import React from 'react';
import { ArrowUp, ArrowDown, Minus } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  change: string;
  trend: 'up' | 'down' | 'neutral';
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, change, trend }) => {
  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <ArrowUp className="h-3 w-3 text-green-600" />;
      case 'down':
        return <ArrowDown className="h-3 w-3 text-red-600" />;
      case 'neutral':
        return <Minus className="h-3 w-3 text-gray-600" />;
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      case 'neutral':
        return 'text-gray-600';
    }
  };

  return (
    <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 transition-all hover:shadow-md">
      <div className="flex justify-between items-start">
        <div className="text-gray-500 text-sm font-medium">{title}</div>
        <div className="p-2 rounded-full bg-gray-50">{icon}</div>
      </div>
      <div className="mt-2 text-2xl font-bold text-gray-800">{value}</div>
      <div className="mt-2 flex items-center text-xs">
        {getTrendIcon()}
        <span className={`ml-1 ${getTrendColor()}`}>{change}</span>
      </div>
    </div>
  );
};

export default StatCard;