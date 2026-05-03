import React, { useState } from "react";
import Header from "../header/Header.jsx";
import "./FertilizerPage.css";
import { useNavigate } from "react-router-dom";
import LinearProgress from "@mui/material/LinearProgress";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import MenuItem from "@mui/material/MenuItem";
import Chatbot from "../chatbot/Chatbot.jsx";

// -----------------------------
const FERTILIZER_ENDPOINT = "http://localhost:8080/fertilizer_recommend";

// 🔑 Weather API Key
const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

// -----------------------------
// Weather function
async function fetchWeather() {
  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=25.4358&lon=81.8463&appid=${API_KEY}&units=metric`
    );

    const data = await res.json();

    if (data.cod !== 200) return null;

    return {
      temperature: data.main.temp,
      humidity: data.main.humidity,
      moisture: data.main.humidity, // approx
    };
  } catch {
    return null;
  }
}

// -----------------------------
// Ranges
const ranges = {
  nitrogen: [0, 150],
  phosphorous: [5, 145],
  potassium: [5, 205],
  temperature: [0, 50],
  humidity: [1, 100],
  moisture: [0, 100],
};

// -----------------------------
const createRange = (min, max, step = 1) => {
  let arr = [];
  for (let i = min; i <= max; i += step) {
    arr.push(Number(i.toFixed(1)));
  }
  return arr;
};

// -----------------------------
export function FertilizerPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    nitrogen: "",
    phosphorous: "",
    potassium: "",
    temperature: "",
    humidity: "",
    moisture: "",
    soil: "",
    crop: "",
  });

  // -----------------------------
  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // -----------------------------
  const handleAutoFillWeather = async () => {
    const weather = await fetchWeather();

    if (!weather) {
      alert("Weather fetch failed");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      temperature: weather.temperature,
      humidity: weather.humidity,
      moisture: weather.moisture,
    }));
  };

  // -----------------------------
  const isInvalid = (field, value) => {
    if (value === "") return false;
    const [min, max] = ranges[field];
    return value < min || value > max;
  };

  // -----------------------------
  const handlePredict = () => {
    for (let key in formData) {
      if (formData[key] === "") {
        alert("Please fill all fields");
        return;
      }
    }

    setLoading(true);

    const payload = {
      array: [
        Number(formData.temperature),
        Number(formData.humidity),
        Number(formData.moisture),
        Number(formData.nitrogen),
        Number(formData.potassium),
        Number(formData.phosphorous),
        formData.soil,
        formData.crop,
      ],
    };

    fetch(FERTILIZER_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((result) => {
        setLoading(false);
        navigate("/fertilizer_result", {
          state: { predicted_fertilizer: result },
        });
      })
      .catch(() => {
        setLoading(false);
        alert("Backend error");
      });
  };

  // -----------------------------
  const renderField = (label, field) => {
    const [min, max] = ranges[field];

    return (
      <Autocomplete
        options={createRange(min, max)}
        value={formData[field]}
        onChange={(e, newValue) => handleChange(field, newValue)}
        onInputChange={(e, newValue) => handleChange(field, newValue)}
        freeSolo
        renderInput={(params) => (
          <TextField
            {...params}
            label={label}
            type="number"
            error={isInvalid(field, formData[field])}
            helperText={
              isInvalid(field, formData[field])
                ? `Value must be between ${min} – ${max}`
                : `Range: ${min} – ${max}`
            }
            fullWidth
          />
        )}
      />
    );
  };

  // -----------------------------
  return (
    <>
      <Header />

      {loading && <LinearProgress color="success" />}

      <div className="fertilizer-page">
        
        <h1 className="fertilizer-title">Fertilizer Recommendation 🌾</h1>
        <div className="ai-section">
               <Chatbot />
          </div>
        <p className="fertilizer-subtitle">
          Enter soil nutrients and crop details
        </p>

         <div className="divider"></div>

        <div className="fertilizer-card">
          <div className="fertilizer-container">

            {renderField("Nitrogen (N)", "nitrogen")}
            {renderField("Temperature (°C)", "temperature")}

            {/* Soil */}
            <TextField
              select
              label="Soil Type"
              value={formData.soil}
              onChange={(e) => handleChange("soil", e.target.value)}
              fullWidth
            >
              <MenuItem value="Sandy">Sandy</MenuItem>
              <MenuItem value="Loamy">Loamy</MenuItem>
              <MenuItem value="Black">Black</MenuItem>
              <MenuItem value="Red">Red</MenuItem>
              <MenuItem value="Clayey">Clayey</MenuItem>
            </TextField>

            {/* Crop */}
            <TextField
              select
              label="Crop Type"
              value={formData.crop}
              onChange={(e) => handleChange("crop", e.target.value)}
              fullWidth
            >
              <MenuItem value="Maize">Maize</MenuItem>
              <MenuItem value="Sugarcane">Sugarcane</MenuItem>
              <MenuItem value="Cotton">Cotton</MenuItem>
              <MenuItem value="Paddy">Paddy</MenuItem>
              <MenuItem value="Wheat">Wheat</MenuItem>
            </TextField>

            {renderField("Phosphorous (P)", "phosphorous")}
            {renderField("Humidity (%)", "humidity")}
            {renderField("Potassium (K)", "potassium")}
            {renderField("Moisture", "moisture")}

          </div>

          {/* 🌦️ Auto Weather Button */}
          <div className="action-buttons">
            <button className="btn btn-secondary" onClick={handleAutoFillWeather}>
              <span className="btn-icon">🌤️</span>
              Auto Fill Weather
            </button>
            <button className="btn btn-primary" onClick={handlePredict}>
              <span className="btn-icon">🌾</span>
              Predict Fertilizer
              <span className="btn-arrow">→</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}