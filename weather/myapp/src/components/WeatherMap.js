import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { motion } from "framer-motion";

// Fix default marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
});

const API_KEY = "c7e2aa9c576616f325ae9cbf52c1fcc4"; // Your OpenWeatherMap API Key

// Helper component to animate map movement
const FlyToLocation = ({ coords }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo(coords, 7, { duration: 2 }); // smooth animated zoom/move
  }, [coords, map]);
  return null;
};

const WeatherMap = ({ coords = [16.5, 80.6] }) => {
  const [layer, setLayer] = useState("precipitation_new");
  const [weatherData, setWeatherData] = useState(null);

  // Fetch live weather
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${coords[0]}&lon=${coords[1]}&appid=${API_KEY}&units=metric`
        );
        const data = await res.json();
        setWeatherData(data);
      } catch (err) {
        console.error("Error fetching weather:", err);
      }
    };

    fetchWeather();
  }, [coords]);

  return (
    <motion.div
      className="h-60 rounded-2xl overflow-hidden shadow-xl relative"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <MapContainer center={coords} zoom={7} className="h-full w-full">
        {/* Animated movement */}
        <FlyToLocation coords={coords} />

        {/* Base Map */}
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Weather Overlay with fade animation */}
        <motion.div
          key={layer}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          <TileLayer
            attribution='&copy; <a href="https://openweathermap.org/">OpenWeatherMap</a>'
            url={`https://tile.openweathermap.org/map/${layer}/{z}/{x}/{y}.png?appid=${API_KEY}`}
          />
        </motion.div>

        {/* Weather Marker */}
        {weatherData && (
          <Marker position={coords}>
            <Popup>
              <motion.div
                className="text-sm"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                <div className="font-semibold">{weatherData.name}</div>
                <div>🌡 {Math.round(weatherData.main.temp)}°C</div>
                <div>💧 {weatherData.main.humidity}%</div>
                <div>💨 {weatherData.wind.speed} m/s</div>
                <div className="capitalize">
                  {weatherData.weather?.[0]?.description}
                </div>
              </motion.div>
            </Popup>
          </Marker>
        )}
      </MapContainer>

      {/* Animated Layer Switcher */}
      <div className="absolute bottom-2 left-2 bg-white rounded p-2 shadow flex gap-2">
        {[
          { id: "precipitation_new", label: "Rain", color: "bg-blue-500" },
          { id: "clouds_new", label: "Clouds", color: "bg-gray-600" },
          { id: "temp_new", label: "Temp", color: "bg-red-500" },
        ].map((btn) => (
          <motion.button
            key={btn.id}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`px-2 py-1 rounded text-white ${btn.color}`}
            onClick={() => setLayer(btn.id)}
          >
            {btn.label}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

export default WeatherMap;
