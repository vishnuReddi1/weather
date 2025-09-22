import React, { useState } from "react";
import { fetchWeatherData, fetchForecastData } from "../api/weatherService";

const SearchBar = ({ setWeatherData, setForecastData, setSelectedDay, setMapCoords, setLoading, currentCity, darkMode }) => {
  const [city, setCity] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!city.trim()) return;
    
    try {
      setLoading(true);
      setSelectedDay(null);
      
      const weather = await fetchWeatherData(city.trim());
      const forecast = await fetchForecastData(city.trim());
      
      setWeatherData(weather);
      setForecastData(forecast);

      if (weather.coord) {
        setMapCoords([weather.coord.lat, weather.coord.lon]);
      }
    } catch (err) {
      alert("Error fetching data: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    if (!currentCity) return;
    
    try {
      setLoading(true);
      const weather = await fetchWeatherData(currentCity);
      const forecast = await fetchForecastData(currentCity);
      
      setWeatherData(weather);
      setForecastData(forecast);
      
      // Show refresh confirmation
      const now = new Date();
      alert(`Data refreshed at ${now.toLocaleTimeString()}`);
    } catch (err) {
      alert("Error refreshing data: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 items-center">
      <form onSubmit={handleSearch} className="w-full md:w-auto">
        <div className="relative flex items-center">
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Search city..."
            className={`w-full py-3 pl-4 pr-12 rounded-full backdrop-blur-md border focus:outline-none focus:ring-2 focus:ring-blue-400 ${
              darkMode 
                ? "bg-white/10 border-white/20 text-white placeholder-blue-200" 
                : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
            }`}
          />
          <button
            type="submit"
            className="absolute right-2 bg-blue-600 hover:bg-blue-700 px-4 py-1.5 rounded-full text-white transition-colors"
          >
            Search
          </button>
        </div>
      </form>
      
      {currentCity && (
        <button
          onClick={handleRefresh}
          className="bg-green-600 hover:bg-green-700 px-4 py-3 rounded-full text-white transition-colors flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh Data
        </button>
      )}
    </div>
  );
};

export default SearchBar;