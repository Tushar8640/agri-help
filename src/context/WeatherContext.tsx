"use client"

import React, { createContext, useContext, useState, useEffect } from 'react';

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

interface WeatherContextType {
  weather: WeatherData | null;
  loading: boolean;
  error: string | null;
  updateLocation: (location: string) => void;
}

const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

// Sample weather data
const sampleWeatherData: WeatherData = {
  location: 'Central Valley',
  temperature: 23,
  condition: 'Partly Cloudy',
  humidity: 65,
  windSpeed: 8,
  forecast: [
    { date: '2025-01-01', condition: 'Sunny', maxTemp: 24, minTemp: 12, precipitation: 0 },
    { date: '2025-01-02', condition: 'Partly Cloudy', maxTemp: 22, minTemp: 10, precipitation: 10 },
    { date: '2025-01-03', condition: 'Rainy', maxTemp: 18, minTemp: 9, precipitation: 70 },
    { date: '2025-01-04', condition: 'Cloudy', maxTemp: 19, minTemp: 8, precipitation: 30 },
    { date: '2025-01-05', condition: 'Sunny', maxTemp: 21, minTemp: 9, precipitation: 0 },
  ]
};

export const WeatherProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const updateLocation = (location: string) => {
    setLoading(true);
    // In a real app, this would fetch from a weather API
    setTimeout(() => {
      setWeather({
        ...sampleWeatherData,
        location
      });
      setLoading(false);
    }, 1000);
  };

  // Initialize with sample data
  useEffect(() => {
    setTimeout(() => {
      setWeather(sampleWeatherData);
      setLoading(false);
    }, 1500);
  }, []);

  return (
    <WeatherContext.Provider value={{
      weather,
      loading,
      error,
      updateLocation
    }}>
      {children}
    </WeatherContext.Provider>
  );
};

export const useWeather = () => {
  const context = useContext(WeatherContext);
  if (context === undefined) {
    throw new Error('useWeather must be used within a WeatherProvider');
  }
  return context;
};