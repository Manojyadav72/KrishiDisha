



import React, { useState, useEffect } from "react";
import "./WeatherCard.css";

// Default location
const DEFAULT_LAT = 25.4358;
const DEFAULT_LON = 81.8463;
const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

const WeatherCard = ({
  lat = DEFAULT_LAT,
  lon = DEFAULT_LON,
  title = "Live Weather Conditions",
  showInsight = true,
}) => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ LOCATION STATE
  const [locationName, setLocationName] = useState("");

  // ================= FETCH WEATHER =================
  const fetchWeather = async (latitude = lat, longitude = lon) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
      );

      if (!res.ok) throw new Error("Weather API error");

      const data = await res.json();

      // ✅ SET LOCATION NAME
      setLocationName(data.name);

      setWeatherData({
        temperature: data.main.temp,
        humidity: data.main.humidity,
        rainfall: data.rain ? data.rain["1h"] || 0 : 0,
        condition: data.weather[0].main,
        description: data.weather[0].description,
        icon: data.weather[0].icon,
      });
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ================= AUTO LOCATION =================
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          fetchWeather(pos.coords.latitude, pos.coords.longitude);
        },
        () => fetchWeather()
      );
    } else {
      fetchWeather();
    }
  }, []);

  // ================= ICON =================
  const getWeatherIconUrl = (icon) => {
    return `https://openweathermap.org/img/wn/${icon}@2x.png`;
  };

  // ================= FARMING INSIGHT =================
  const getFarmingInsight = () => {
    if (!weatherData) return "";
    const { rainfall, temperature, humidity } = weatherData;

    if (rainfall > 50)
      return "High rainfall expected. Ensure proper drainage.";
    if (temperature > 35)
      return "High temperature alert. Increase irrigation.";
    if (humidity > 70)
      return "High humidity. Monitor fungal diseases.";
    if (temperature < 15)
      return "Cool conditions. Protect crops.";

    return "Optimal growing conditions!";
  };

  // ================= LOADING =================
  if (loading) {
    return (
      <div className="weather-card">
        <div className="weather-card-header">
          <div className="weather-title">
            <span className="title-icon">🌍</span>
            <h3>{title}</h3>
          </div>
        </div>
        <div className="weather-loading">
          <div className="spinner"></div>
          <p>Fetching weather data...</p>
        </div>
      </div>
    );
  }

  // ================= ERROR =================
  if (error || !weatherData) {
    return (
      <div className="weather-card">
        <div className="weather-card-header">
          <div className="weather-title">
            <span className="title-icon">🌍</span>
            <h3>{title}</h3>
          </div>
        </div>
        <div className="weather-error-state">
          <p>Unable to fetch weather data</p>
          <button onClick={() => fetchWeather()}>Try Again</button>
        </div>
      </div>
    );
  }

  // ================= SUCCESS UI =================
  return (
    <div className="weather-card">
      <div className="weather-card-header">
        <div className="weather-title">
          <span className="title-icon">🌍</span>
          <h3>{title}</h3>
        </div>
         <button className="refresh-btn" onClick={() => fetchWeather()}>
          🔄
        </button> 
      </div>

      {/* ✅ LOCATION NAME */}
      <p className="weather-location-name">📍 {locationName}</p>

      <div className="weather-display">
        <div className="weather-current">
          <img
            src={getWeatherIconUrl(weatherData.icon)}
            alt={weatherData.condition}
            className="weather-icon"
          />
          <div className="temp-info">
            <div className="current-temp">
              {Math.round(weatherData.temperature)}°C
            </div>
            <div className="weather-condition">
              {weatherData.description}
            </div>
          </div>
        </div>

        <div className="weather-stats">
          <div className="stat">
            <div className="stat-icon">💧</div>
            <div className="stat-info">
              <div className="stat-label">Humidity</div>
              <div className="stat-value">
                {weatherData.humidity}%
              </div>
            </div>
          </div>

          <div className="stat">
            <div className="stat-icon">☔</div>
            <div className="stat-info">
              <div className="stat-label">Rainfall</div>
              <div className="stat-value">
                {weatherData.rainfall} mm
              </div>
            </div>
          </div>
        </div>

        {showInsight && (
          <div className="farming-insight">
            <div className="insight-icon">🌱</div>
            <div className="insight-text">
              <strong>Farming Insight:</strong> {getFarmingInsight()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeatherCard;