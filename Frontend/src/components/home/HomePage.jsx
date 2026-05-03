

import Header from "../header/Header.jsx";
import Background3D from "../3dmodel/Model.jsx";
import "./HomePage.css";
import { useNavigate } from "react-router-dom";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { useState, useEffect } from "react";
import { HashLoader } from "react-spinners";
import Container from "@mui/material/Container";
import WeatherCard from "../weather/WeatherCard.jsx";
import CropCalendar from "../calendar/cropCalendar.jsx";
import Chatbot from "../chatbot/Chatbot.jsx";
import Footer from "../footer/Footer.jsx";
import MandiFilter from "../cropprice/FilterPrice.jsx";


// Vite public asset path
const MODEL_PATH = "/Model/scene.gltf";
// ----------------------------------------------------
// HOME PAGE UI
function HomePage({ children }) {
  const navigate = useNavigate();

  // ✅ AI STATES
  const [messages, setMessages] = useState([
    { role: "bot", text: "👋 Hello! Ask me about farming 🌾" }
  ]);
  const [input, setInput] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);

  // 🎤 Voice Recognition
  const startListening = () => {
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-IN"; // Hindi/English mix
    recognition.start();

    recognition.onresult = (event) => {
      const speechText = event.results[0][0].transcript;
      setInput(speechText);
    };
  };

  // 🤖 Send Message
  const handleAsk = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);

    setLoadingAI(true);
    setInput("");

    try {
      const res = await fetch("http://localhost:5000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();

      const botMessage = {
        role: "bot",
        text: data.reply || "No response",
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "❌ AI error" },
      ]);
    }

    setLoadingAI(false);
  };
  return (
    <>
      <Header />

      <div className="home-wrapper">
        {/* 3D BACKGROUND */}
        <div className="background-3d">
          {children}
        </div>

        {/* TEXT + BUTTON OVERLAY */}
        <div className="home-content">
          

           <div className="ai-section">
               <Chatbot />
          </div>

          <h1 className="hero-title">
            What Crop to Grow <span className="highlight">This Season?</span>
          </h1>

          <p className="hero-description">
            Welcome to <strong>KrishiDisha</strong> 🌱<br />
            An AI-powered system that recommends the best crop and fertilizer
            based on soil nutrients, temperature, humidity, rainfall, and moisture.
            Make smarter farming decisions with machine learning.
          </p>
         <div className="btn-group">
           <button className="Croprecommend" onClick={() => navigate("/crop")}>
            RECOMMEND CROPS
          </button>
          <button className="Croprecommend" onClick={() => navigate("/fertilizer")}>
            RECOMMEND FERTILIZER
          </button>
         </div>

          {/* <button className="start_btn" onClick={() => navigate("/crop")}>
            <span className="btn-icon">🌾</span>
            GET STARTED
            <span className="btn-arrow">→</span>
          </button> */}
        </div>
      </div>
      <MandiFilter />

       <div className="weather-section-home">
        <div className="section-header">
          <span className="section-icon">🌍</span>
          <h2>Live Weather Conditions</h2>
          <p>Real‑time weather data to help you plan your farming activities</p>
        </div>
        <WeatherCard
          title="Current Weather"
          showInsight={true}
        />
      </div>

      {/* Season Section */}
      <div className="season-section">
        <div className="section-header">
          <span className="section-icon">🌱</span>
          <h2>Understanding Crop Seasons in India</h2>
          <p>Choose the right crop based on the season for optimal yield</p>
        </div>

        <div className="season-grid">
          <div className="season-card kharif">
            <div className="card-icon">🌧️</div>
            <h3>Kharif Crops</h3>
            <div className="season-month">June – October</div>
            <p>
              Grown during monsoon season. Requires high rainfall and warm climate.
              <br />
              <strong>Examples:</strong> Rice, Maize, Cotton, Soybean, Sugarcane
            </p>
            <div className="card-footer">Best for rainy regions</div>
          </div>

          <div className="season-card rabi">
            <div className="card-icon">❄️</div>
            <h3>Rabi Crops</h3>
            <div className="season-month">October – April</div>
            <p>
              Grown during winter season. Requires cool climate.
              <br />
              <strong>Examples:</strong> Wheat, Mustard, Barley, Peas, Gram
            </p>
            <div className="card-footer">Ideal for winter cultivation</div>
          </div>

          <div className="season-card zaid">
            <div className="card-icon">☀️</div>
            <h3>Zaid Crops</h3>
            <div className="season-month">March – June</div>
            <p>
              Grown during summer season. Requires irrigation.
              <br />
              <strong>Examples:</strong> Watermelon, Cucumber, Muskmelon, Bitter Gourd
            </p>
            <div className="card-footer">Short duration crops</div>
          </div>
        </div>

        <div className="season-tip">
          <span className="tip-icon">💡</span>
          <p>Our AI considers these seasonal patterns to provide the most accurate crop recommendations for your location.</p>
        </div>
      </div>

      {/* Weather Section – using WeatherCard component */}
     
      <CropCalendar />
      <Footer />
    </>
  );
}

// MODEL LOADER
export function ModelLoader() {
  const [loading, setLoading] = useState(true);
  const [model, setModel] = useState(null);

  useEffect(() => {
    const loader = new GLTFLoader();

    loader.load(
      MODEL_PATH,
      (gltf) => {
        setModel(gltf);
        setLoading(false);
      },
      undefined,
      (error) => {
        console.error("❌ Failed to load 3D model:", error);
        setLoading(false);
      }
    );
  }, []);

  if (loading) {
    return (
      <>
        <Header />
        <Container maxWidth="md">
          <HashLoader
            color="#22c55e"
            cssOverride={{ margin: "20% auto", display: "block" }}
            size={80}
          />
        </Container>
      </>
    );
  }

  if (!model) {
    return (
      <>
        <Header />
        <div className="model-fallback">
          <h2>Failed to load 3D model</h2>
          <p>But you can still use our AI recommendations!</p>
          <button className="btn-primary" onClick={() => window.location.href = "/crop"}>
            Get Started
          </button>
        </div>
      </>
    );
  }

  return (
    <HomePage>
      <Background3D model={model} />
    </HomePage>
  );
}