import React, { useState } from "react";
import "./Chatbot.css";

const Chatbot = () => {
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState([
    { role: "bot", text: "👋 Hello! Ask me about farming 🌾" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // 🎤 Voice
  const startListening = () => {
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-IN";
    recognition.start();

    recognition.onresult = (event) => {
      setInput(event.results[0][0].transcript);
    };
  };

  // 🤖 Send message
  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { role: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);

    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message: userMsg.text })
      });

      const data = await res.json();

      const botMsg = {
        role: "bot",
        text: data.reply || "No response"
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "❌ AI error" }
      ]);
    }

    setLoading(false);
  };

return (
  <>
    {/* Open Button */}
    <button className="ai-open-btn" onClick={() => setShowChat(true)}>
      🤖  AI-Powered Farming Assistant
    </button>

    {/* Popup */}
    {showChat && (
      <div className="chat-overlay">
        <div className="chat-modal">

          {/* Header */}
          <div className="chat-header">
            <span>🤖 Krishi AI Assistant</span>
            <button className="close-btn" onClick={() => setShowChat(false)}>✕</button>
          </div>

          {/* Messages */}
          <div className="chat-body">
            {messages.map((msg, i) => (
              <div key={i} className={`chat-bubble ${msg.role}`}>
                {msg.text}
              </div>
            ))}

            {loading && <div className="chat-bubble bot">Typing...</div>}
          </div>

          {/* Input */}
          <div className="chat-footer">
            <input
              type="text"
              placeholder="Ask about crops, weather..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />

            <button onClick={startListening}>🎤</button>
            <button onClick={handleSend}>Send</button>
          </div>

        </div>
      </div>
    )}
  </>
);
};

export default Chatbot;