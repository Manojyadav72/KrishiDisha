import React, { useState } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      console.log("LOGIN RESPONSE:", data);

      if (res.ok && data.token) {
        // ✅ SAVE EVERYTHING
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        navigate("/");
      } else {
        setError(data.msg || "Invalid email or password");
      }

    } catch (err) {
      console.error(err);
      setError("Server error");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* ❌ Close Button */}
        <button
          type="button"
          className="close-button"
          onClick={() => navigate("/")}
        >
          &times;
        </button>
        <h2>🌾 KrishiDisha Login</h2>
        <p>Welcome back!</p>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <div className="password-field">
            <input                                                                                              
              type={showPassword ? "text" : "password"}
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span onClick={() => setShowPassword(!showPassword)}>
              👁
            </span>
          </div>

          {error && <p className="error">{error}</p>}

          <button type="submit">Login</button>
        </form>

        <p className="switch">
          Don't have an account?
          <span onClick={() => navigate("/signup")}> Signup</span>
        </p>
      </div>
    </div>
  );
};

export default Login;