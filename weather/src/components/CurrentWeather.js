import React from "react";

const CurrentWeather = ({ data, lastUpdated, darkMode }) => {
  if (!data) return null;
  const { name, sys, main, weather, wind } = data;

  return (
    <div className={`${darkMode ? 'bg-white/10 text-white border-white/20' : 'bg-white text-gray-900 border-gray-200'} backdrop-blur-md p-6 rounded-2xl shadow-xl mb-6 border`}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{name}{sys?.country ? `, ${sys.country}` : ""}</h1>
          <p className="capitalize text-sm mt-1">{weather?.[0]?.description}</p>
        </div>

        <div className="text-right">
          <div className="text-5xl font-extrabold">{Math.round(main.temp)}°C</div>
          <div className="text-sm mt-1">Feels like {Math.round(main.feels_like)}°C</div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div className={`${darkMode ? 'bg-white/10 border-white/10' : 'bg-gray-100 border-gray-200'} p-3 rounded-lg border`}>
          <div className="font-semibold">Humidity</div>
          <div>{main.humidity}%</div>
        </div>
        <div className={`${darkMode ? 'bg-white/10 border-white/10' : 'bg-gray-100 border-gray-200'} p-3 rounded-lg border`}>
          <div className="font-semibold">Wind</div>
          <div>{wind.speed} m/s</div>
        </div>
        <div className={`${darkMode ? 'bg-white/10 border-white/10' : 'bg-gray-100 border-gray-200'} p-3 rounded-lg border`}>
          <div className="font-semibold">Pressure</div>
          <div>{main.pressure} hPa</div>
        </div>
        <div className={`${darkMode ? 'bg-white/10 border-white/10' : 'bg-gray-100 border-gray-200'} p-3 rounded-lg border`}>
          <div className="font-semibold">Visibility</div>
          <div>{(data.visibility ?? 10000) / 1000} km</div>
        </div>
      </div>
      
      {/* Add data source info */}
      <div className={`mt-4 text-xs ${darkMode ? 'text-blue-200' : 'text-blue-600'}`}>
        <p>Data provided by OpenWeatherMap • {lastUpdated || "Just now"}</p>
        <p className="mt-1">Note: Weather data may vary between different providers</p>
      </div>
    </div>
  );
};

export default CurrentWeather;