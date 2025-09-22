import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceArea,
} from "recharts";

const HourlyForecast = ({ entries, darkMode }) => {
  const [activeTab, setActiveTab] = useState("overview");

  if (!entries || entries.length === 0) return null;

  // Convert 3-hour intervals into hourly by interpolation
  const hourlyData = [];
  for (let i = 0; i < entries.length - 1; i++) {
    const curr = entries[i];
    const next = entries[i + 1];

    for (let h = 0; h < 3; h++) {
      const dt = new Date(curr.dt * 1000);
      dt.setHours(dt.getHours() + h);

      const factor = h / 3;
      const interp = (a, b) => a + (b - a) * factor;

      hourlyData.push({
        time: dt.toLocaleTimeString("en-IN", {
          hour: "numeric",
          hour12: true,
        }),
        timeFull: dt,
        temp: Math.round(interp(curr.main.temp, next.main.temp)),
        humidity: Math.round(interp(curr.main.humidity, next.main.humidity)),
        wind: parseFloat(interp(curr.wind.speed, next.wind.speed).toFixed(1)),
        precipitation: Math.round(interp(curr.pop * 100, next.pop * 100)),
        rainAmount: interp(
          curr.rain ? curr.rain["3h"] || 0 : 0,
          next.rain ? next.rain["3h"] || 0 : 0
        ),
        icon: curr.weather[0].icon,
        desc: curr.weather[0].description,
      });
    }
  }

  // Find rain periods
  const rainPeriods = [];
  let rainStart = null;

  hourlyData.forEach((data, i) => {
    const isRaining = data.rainAmount > 0;

    if (isRaining && rainStart === null) {
      rainStart = i;
    } else if (!isRaining && rainStart !== null) {
      rainPeriods.push({ start: rainStart, end: i - 1 });
      rainStart = null;
    }
  });

  if (rainStart !== null) {
    rainPeriods.push({ start: rainStart, end: hourlyData.length - 1 });
  }

  // Tabs for graph - different colors for light/dark mode
  const tabOptions = [
    { 
      key: "overview", 
      label: "Temperature", 
      color: darkMode ? "#2563eb" : "#f59e0b", // Blue for dark, yellow for light
      dataKey: "temp", 
      unit: "°C" 
    },
    { 
      key: "precipitation", 
      label: "Rain", 
      color: darkMode ? "#06b6d4" : "#3b82f6", // Cyan for dark, blue for light
      dataKey: "precipitation", 
      unit: "%" 
    },
    { 
      key: "wind", 
      label: "Wind", 
      color: darkMode ? "#f59e0b" : "#10b981", // Yellow for dark, green for light
      dataKey: "wind", 
      unit: " m/s" 
    },
    { 
      key: "humidity", 
      label: "Humidity", 
      color: darkMode ? "#10b981" : "#8b5cf6", // Green for dark, purple for light
      dataKey: "humidity", 
      unit: "%" 
    },
  ];

  const activeConfig = tabOptions.find((t) => t.key === activeTab);

  return (
    <div className={`${darkMode ? 'bg-gray-800 text-white border-gray-700' : 'bg-white text-gray-900 border-gray-200'} border p-4 rounded-2xl shadow-xl mt-6`}>
      {/* Hourly forecast list */}
      <div className="flex gap-3 overflow-x-auto mt-4 pb-2">
        {hourlyData.map((item, i) => (
          <div
            key={i}
            className={`min-w-[70px] p-2 rounded-xl text-center flex-shrink-0 border ${
              darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900 shadow-sm'
            }`}
          >
            <div className={`text-xs ${darkMode ? 'text-white' : 'text-gray-700'}`}>{item.time}</div>
            <img
              src={`https://openweathermap.org/img/wn/${item.icon}@2x.png`}
              alt={item.desc}
              className="mx-auto w-8 h-8"
            />
            <div className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{item.temp}°C</div>
            {item.rainAmount > 0 && (
              <div className={`text-xs mt-1 ${darkMode ? 'text-blue-300' : 'text-blue-600'}`}>💧 {item.rainAmount.toFixed(1)}mm</div>
            )}
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-3 mb-4 mt-4 overflow-x-auto">
        {tabOptions.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              activeTab === tab.key
                ? `${darkMode ? 'bg-blue-600' : 'bg-blue-500'} text-white`
                : `${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} ${darkMode ? 'text-white' : 'text-gray-900'}`
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Graph */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={hourlyData}>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke={darkMode ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.1)"} 
            />
            <XAxis 
              dataKey="time" 
              stroke={darkMode ? "#fff" : "#000"} 
              interval={2} 
              tick={{ fill: darkMode ? "#fff" : "#000" }}
            />
            <YAxis 
              stroke={darkMode ? "#fff" : "#000"} 
              tick={{ fill: darkMode ? "#fff" : "#000" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: darkMode ? "rgba(0,0,0,0.9)" : "rgba(255,255,255,0.95)",
                border: darkMode ? "1px solid #444" : "1px solid #ddd",
                borderRadius: "8px",
                color: darkMode ? "#fff" : "#000",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              }}
              formatter={(value) => [`${value}${activeConfig.unit}`, activeConfig.label]}
            />
            {rainPeriods.map((period, i) => (
              <ReferenceArea
                key={i}
                x1={hourlyData[period.start].time}
                x2={hourlyData[period.end].time}
                strokeOpacity={0.3}
                fill={darkMode ? "#06b6d4" : "#3b82f6"}
                fillOpacity={0.1}
              />
            ))}
            <Line
              type="monotone"
              dataKey={activeConfig.dataKey}
              stroke={activeConfig.color}
              strokeWidth={2}
              dot={{ r: 3, fill: activeConfig.color }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Rain alerts */}
      {rainPeriods.length > 0 && (
        <div className={`mt-4 p-3 rounded-lg border ${
          darkMode ? 'bg-gray-700 border-gray-600' : 'bg-blue-50 border-blue-200'
        }`}>
          <h4 className={`font-semibold mb-2 ${darkMode ? 'text-blue-300' : 'text-blue-600'}`}>Rain Forecast</h4>
          {rainPeriods.map((period, i) => {
            const startTime = hourlyData[period.start].timeFull;
            const endTime = hourlyData[period.end].timeFull;

            return (
              <div key={i} className={`text-sm mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                💧 Rain expected from{" "}
                {startTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} to{" "}
                {endTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default HourlyForecast;