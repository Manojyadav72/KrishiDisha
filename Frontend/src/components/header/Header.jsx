import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./Header.css";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  // ✅ SAFE USER PARSE (IMPORTANT FIX)
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch {
    user = null;
  }

  const name = user?.name || "Farmer";
  const email = user?.email || "No Email";
  const farmerId = user?.farmerId || "N/A";
  const photo = user?.photo || "";

  // ✅ update on route change
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, [location]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const getInitials = (name) => {
    if (!name) return "U";

    const words = name.trim().split(" ");
    if (words.length === 1) return words[0][0].toUpperCase();

    return (words[0][0] + words[1][0]).toUpperCase();
  };

  return (
    <header className="header">
      <div className="logo">
        <Link to="/">🌿KrishiDisha</Link>
      </div>

      <nav>
        <ul className="nav-links">
          <li><Link to="/crop">Crop Recommendation</Link></li>
          <li><Link to="/fertilizer">Fertilizer Recommendation</Link></li>

          {/* 🔐 PROFILE SECTION */}
          <li className="profile-container">
            {isLoggedIn ? (
              <>
                {photo ? (
                  <img
                    src={photo}
                    alt="profile"
                    className="profile-icon"
                    onClick={() => setShowMenu(!showMenu)}
                  />
                ) : (
                  <div
                    className="profile-avatar"
                    onClick={() => setShowMenu(!showMenu)}
                  >
                    {getInitials(name)}
                  </div>
                )}

                {showMenu && (
                  <div className="profile-dropdown">
                    <p><strong>{name}</strong></p>
                    <p>{email}</p>
                    <p>ID: {farmerId}</p>

                    <button onClick={() => navigate("/profile")}>
                      Edit Profile
                    </button>

                    <button onClick={handleLogout} className="logout-btn">
                      Logout
                    </button>
                  </div>
                )}
              </>
            ) : (
              <Link to="/login">Login</Link>
            )}
          </li>

          <li>
            <a
              href="#"
              onClick={() =>
                window.open("http://127.0.0.1:8080/docs#/", "_blank")
              }
            >
              API Docs
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;