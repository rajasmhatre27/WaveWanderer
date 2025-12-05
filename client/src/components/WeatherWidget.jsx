import React, { useState, useEffect } from "react";
import axios from "axios";
import { Sun, Cloud, CloudRain, RefreshCw } from "lucide-react";
import apiUrl from "../apiConfig";
const WeatherWidget = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchWeather = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${apiUrl}/api/weather`);
      setWeather(response.data);
    } catch (error) {
      console.error("Failed to fetch weather:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <RefreshCw
          className="animate-spin mx-auto mb-2 text-blue-500"
          size={24}
        />
        <p>Loading weather...</p>
      </div>
    );
  }

  if (!weather) return <div>Failed to load weather</div>;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-800">Alibag Weather</h3>
          <p className="text-gray-600 text-sm">Live Updates</p>
        </div>
        <button
          onClick={fetchWeather}
          className="text-gray-400 hover:text-gray-600"
        >
          <RefreshCw size={20} />
        </button>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Sun className="text-yellow-500" size={32} />
          <div className="ml-3">
            <div className="text-3xl font-bold text-gray-800">
              {weather.temperature}°C
            </div>
            <div className="text-gray-600 capitalize">
              {weather.description}
            </div>
          </div>
        </div>
      </div>

      {weather.recommendation && (
        <div
          className={`border-l-4 rounded-r px-4 py-3 ${
            weather.recommendation.color === "green"
              ? "bg-green-100 border-green-500 text-green-800"
              : weather.recommendation.color === "blue"
              ? "bg-blue-100 border-blue-500 text-blue-800"
              : weather.recommendation.color === "red"
              ? "bg-red-100 border-red-500 text-red-800"
              : "bg-yellow-100 border-yellow-500 text-yellow-800"
          }`}
        >
          <div className="flex items-center">
            <span className="text-2xl mr-2">
              {weather.recommendation.emoji}
            </span>
            <div>
              <div className="font-bold">{weather.recommendation.status}</div>
              <div className="text-sm">{weather.recommendation.message}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherWidget;
