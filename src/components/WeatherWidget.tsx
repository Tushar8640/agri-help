import React, { useState, useEffect } from 'react';
import { CloudRain, AlertTriangle, Calendar, Sun, Cloud, CloudDrizzle, CloudSnow, Zap } from 'lucide-react';
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
    const lowerCondition = condition.toLowerCase();
    if (lowerCondition.includes('rain')) return <CloudDrizzle className="h-4 w-4" />;
    if (lowerCondition.includes('cloud')) return <Cloud className="h-4 w-4" />;
    if (lowerCondition.includes('clear') || lowerCondition.includes('sun')) return <Sun className="h-4 w-4" />;
    if (lowerCondition.includes('snow')) return <CloudSnow className="h-4 w-4" />;
    if (lowerCondition.includes('storm') || lowerCondition.includes('thunder')) return <Zap className="h-4 w-4" />;
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

const WeatherSection = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        // Replace with your actual API key
        const apiKey = 'YOUR_OPENWEATHERMAP_API_KEY';
        const city = 'London';

        // Fetch current weather
        const currentResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=dhaka&units=metric&appid=${process.env.NEXT_PUBLIC_OPENWEATHERMAP_API_KEY}`
        );

        if (!currentResponse.ok) throw new Error('Failed to fetch current weather');

        const currentData = await currentResponse.json();

        // Fetch 5-day forecast
        const forecastResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?q=dhaka&units=metric&appid=${process.env.NEXT_PUBLIC_OPENWEATHERMAP_API_KEY}`
        );

        if (!forecastResponse.ok) throw new Error('Failed to fetch forecast');

        const forecastData = await forecastResponse.json();

        // Process forecast data - group by day and get min/max temps
        const dailyForecast = processForecastData(forecastData.list);

        const weatherData: WeatherData = {
          location: `${currentData.name}, ${currentData.sys.country}`,
          temperature: Math.round(currentData.main.temp),
          condition: currentData.weather[0].description,
          humidity: currentData.main.humidity,
          windSpeed: Math.round(currentData.wind.speed * 3.6), // Convert m/s to km/h
          forecast: dailyForecast.slice(0, 5) // Get next 5 days
        };

        setWeather(weatherData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load weather data');
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, []);

  const processForecastData = (forecastList: any[]) => {
    const dailyData: Record<string, any> = {};

    forecastList.forEach(item => {
      const date = item.dt_txt.split(' ')[0];
      if (!dailyData[date]) {
        dailyData[date] = {
          date,
          conditions: new Set(),
          temps: [],
          precipitation: 0
        };
      }

      dailyData[date].conditions.add(item.weather[0].description);
      dailyData[date].temps.push(item.main.temp_max);
      dailyData[date].temps.push(item.main.temp_min);

      // Rain data might not always be present
      if (item.rain && item.rain['3h']) {
        dailyData[date].precipitation += item.rain['3h'];
      }
    });

    return Object.values(dailyData).map(day => ({
      date: day.date,
      condition: Array.from(day.conditions).join(', '),
      maxTemp: Math.round(Math.max(...day.temps)),
      minTemp: Math.round(Math.min(...day.temps)),
      precipitation: day.precipitation
    }));
  };

  return (
    <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Weather</h3>
        <CloudRain className="w-5 h-5 text-blue-500" />
      </div>

      {loading && <div className="p-4 text-center text-gray-500">Loading weather data...</div>}
      {error && (
        <div className="p-4 text-center text-red-500">
          {error} <br />
          Showing sample data instead.
          <WeatherWidget weather={getSampleData()} />
        </div>
      )}
      {weather && <WeatherWidget weather={weather} />}
    </div>
  );
};

// Fallback sample data in case API fails
const getSampleData = (): WeatherData => ({
  location: "London, UK",
  temperature: 18,
  condition: "Partly cloudy",
  humidity: 65,
  windSpeed: 12,
  forecast: [
    { date: "2023-05-29", condition: "Partly cloudy", maxTemp: 19, minTemp: 12, precipitation: 10 },
    { date: "2023-05-30", condition: "Light rain", maxTemp: 17, minTemp: 11, precipitation: 65 },
    { date: "2023-05-31", condition: "Rain", maxTemp: 15, minTemp: 10, precipitation: 80 },
    { date: "2023-06-01", condition: "Cloudy", maxTemp: 16, minTemp: 11, precipitation: 20 },
    { date: "2023-06-02", condition: "Sunny", maxTemp: 20, minTemp: 13, precipitation: 0 }
  ]
});

export default WeatherSection;