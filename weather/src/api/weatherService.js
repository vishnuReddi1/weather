// Updated weatherService.js with better error handling
const API_KEY = "c7e2aa9c576616f325ae9cbf52c1fcc4";
const BASE = "https://api.openweathermap.org/data/2.5";

// Function to get coordinates first for more accurate data
export const getCityCoordinates = async (city) => {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${API_KEY}`
    );
    const data = await response.json();
    if (data.length > 0) {
      return { lat: data[0].lat, lon: data[0].lon, name: data[0].name };
    }
    throw new Error("City not found");
  } catch (error) {
    console.error("Error fetching coordinates:", error);
    throw error;
  }
};

// More accurate weather data using coordinates
export const fetchWeatherData = async (city) => {
  try {
    // First get precise coordinates
    const coords = await getCityCoordinates(city);
    
    // Then get weather for those exact coordinates
    const response = await fetch(
      `${BASE}/weather?lat=${coords.lat}&lon=${coords.lon}&appid=${API_KEY}&units=metric`
    );
    const data = await response.json();
    
    if (data.cod !== 200) {
      throw new Error(data.message || "Weather data not available");
    }
    
    return { ...data, name: coords.name }; // Use the precise name from geocoding
  } catch (error) {
    console.error("Error fetching weather data:", error);
    throw error;
  }
};

// More accurate forecast using coordinates
export const fetchForecastData = async (city) => {
  try {
    // First get precise coordinates
    const coords = await getCityCoordinates(city);
    
    // Then get forecast for those exact coordinates
    const response = await fetch(
      `${BASE}/forecast?lat=${coords.lat}&lon=${coords.lon}&appid=${API_KEY}&units=metric`
    );
    const data = await response.json();
    
    if (data.cod !== "200") {
      throw new Error(data.message || "Forecast not available");
    }
    
    return data;
  } catch (error) {
    console.error("Error fetching forecast data:", error);
    throw error;
  }
};