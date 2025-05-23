import React from 'react';
import { CloudRain, AlertTriangle, Calendar } from 'lucide-react';
import { Button } from './ui/button';

interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  forecast: {
    date: string;
    condition: string;
    maxTemp: number;
    minTemp: number;
    precipitation: number;
  }[];
}

interface WeatherWidgetProps {
  weather: WeatherData | null;
}

const WeatherWidget: React.FC<WeatherWidgetProps> = ({ weather }) => {
  if (!weather) {
    return (
      <div className="p-4 text-center text-gray-500">
        Weather data not available
      </div>
    );
  }

  const getWeatherIcon = (condition: string) => {
    // In a real app, you'd have more icons for different conditions
    return <CloudRain className="h-4 w-4" />;
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h4 className="font-medium text-gray-800">{weather.location}</h4>
          <p className="text-sm text-gray-500">{weather.condition}</p>
        </div>
        <div className="text-3xl font-bold text-gray-800">{weather.temperature}°</div>
      </div>
      
      <div className="flex justify-between items-center mb-4 text-sm text-gray-600">
        <div>Humidity: {weather.humidity}%</div>
        <div>Wind: {weather.windSpeed} km/h</div>
      </div>
      
      <div className="mt-4">
        <div className="flex items-center mb-2">
          <Calendar className="h-4 w-4 mr-1 text-gray-500" />
          <h5 className="font-medium text-gray-800">5-Day Forecast</h5>
        </div>
        <div className="grid grid-cols-5 gap-2">
          {weather.forecast.map((day, index) => (
            <div key={index} className="flex flex-col items-center py-2">
              <div className="text-xs text-gray-500">{day.date.slice(5)}</div>
              {getWeatherIcon(day.condition)}
              <div className="text-sm font-medium mt-1">{day.maxTemp}°</div>
              <div className="text-xs text-gray-500">{day.minTemp}°</div>
            </div>
          ))}
        </div>
      </div>
      
      {weather.forecast.some(day => day.precipitation > 50) && (
        <div className="mt-4 p-2 bg-amber-50 border border-amber-100 rounded text-sm text-amber-800 flex items-center">
          <AlertTriangle className="h-4 w-4 mr-2 text-amber-500" />
          Rain expected in the next few days
        </div>
      )}
      
      <Button className="mt-4 w-full py-2 bg-blue-50 text-blue-700 border border-blue-100 rounded-md hover:bg-blue-100 transition-colors text-sm">
        View Detailed Forecast
      </Button>
    </div>
  );
};

export default WeatherWidget;