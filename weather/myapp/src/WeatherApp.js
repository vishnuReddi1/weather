import React, { useState, useEffect } from "react";
import CurrentWeather from "./components/CurrentWeather";
import Forecast from "./components/Forecast";
import HourlyForecast from "./components/HourlyForecast";
import WeatherMap from "./components/WeatherMap";
import SearchBar from "./components/SearchBar";

import { fetchWeatherData, fetchForecastData } from "./api/weatherService";

function WeatherApp({ user }) {
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [mapCoords, setMapCoords] = useState([16.5, 80.6]);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(true); // Add dark mode state

  useEffect(() => {
    const loadDefaultCity = async () => {
      setLoading(true);
      try {
        const defaultCity = user?.address?.trim() || "Vijayawada";

        const weather = await fetchWeatherData(defaultCity);
        const forecast = await fetchForecastData(defaultCity);

        setWeatherData(weather);
        setForecastData(forecast);

        if (weather.coord) {
          setMapCoords([weather.coord.lat, weather.coord.lon]);
        }
      } catch (err) {
        console.error("Failed to load default city data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadDefaultCity();
  }, [user]);

  // Apply dark/light mode to body
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("bg-gray-900", "text-white");
      document.body.classList.remove("bg-gray-100", "text-gray-900");
    } else {
      document.body.classList.add("bg-gray-100", "text-gray-900");
      document.body.classList.remove("bg-gray-900", "text-white");
    }
  }, [darkMode]);

  return (
    <div className={`relative min-h-screen p-4 md:p-8 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <div className="relative z-10 max-w-6xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Weather Forecast</h1>
            <p className={darkMode ? "text-blue-300" : "text-blue-600"}>Get accurate weather predictions</p>
            {user && (
              <p className={`text-sm ${darkMode ? "text-blue-200" : "text-blue-700"}`}>
                Hello, {user.name} 👋 | Default Location:{" "}
                <span className={`font-semibold ${darkMode ? "text-blue-400" : "text-blue-600"}`}>
                  {user.address?.trim() || "Vijayawada"}
                </span>
              </p>
            )}
          </div>
          
          <div className="flex items-center gap-4">
            {/* Dark/Light mode toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 text-yellow-300' : 'bg-gray-300 text-gray-700'}`}
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
            
            <SearchBar
              setWeatherData={setWeatherData}
              setForecastData={setForecastData}
              setSelectedDay={setSelectedDay}
              setMapCoords={setMapCoords}
              setLoading={setLoading}
              darkMode={darkMode}
            />
          </div>
        </header>

        {/* Rest of your component remains the same */}
        {/* Loading Spinner */}
        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 ${darkMode ? 'border-white' : 'border-gray-900'}`}></div>
          </div>
        )}

        {/* Weather Data */}
        {!loading && weatherData && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <div className="lg:col-span-2">
                <CurrentWeather data={weatherData} darkMode={darkMode} />
              </div>
              <div className="lg:col-span-1">
                <WeatherMap coords={mapCoords} weatherPoint={weatherData} darkMode={darkMode} />
              </div>
            </div>

            {forecastData && (
              <Forecast
                data={forecastData}
                selectedDay={selectedDay}
                setSelectedDay={setSelectedDay}
                darkMode={darkMode}
              />
            )}

            {selectedDay && <HourlyForecast entries={selectedDay} darkMode={darkMode} />}
          </>
        )}
      </div>
    </div>
  );
}

export default WeatherApp;