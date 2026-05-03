  import React, { useEffect } from "react";
  import Header from "../header/Header";
  import "./CropResult.css";
  import { useNavigate, useLocation } from "react-router-dom";
  import { output_descriptions, label_image_paths } from "../crop/CropOutputs";

  export function CropResult({ cardless = false }) {
    const navigate = useNavigate();
    const location = useLocation();
    const locationState = location.state;

    useEffect(() => {
      if (locationState == null) {
        navigate("/crop");
      }
    }, [locationState, navigate]);

    if (locationState == null) return null;

    const predicted_crop = locationState.predicted_crop;
    const output_image_path = label_image_paths[predicted_crop];

    // Shared content (badge, title, image, description, buttons)
    const content = (
      <>
        <div className="success-badge">
          <span className="badge-icon">🌾</span>
          <span>Recommendation Ready</span>
        </div>

        <h1 className="result-title">
          You should grow
          <span className="crop-name"> {predicted_crop.toUpperCase()} </span>
          <span className="crop-emoji">🌱</span>
        </h1>

        <div className="image-container">
          <img
            className="crop-result-img"
            src={output_image_path}
            alt={predicted_crop}
          />
          <div className="image-overlay">
            <span className="overlay-text">Best Choice for Your Soil</span>
          </div>
        </div>

        <div className="description-container">
          <div className="description-icon">📋</div>
          <p className="crop-result-description">
            {output_descriptions[predicted_crop]}
          </p>
        </div>

        <div className="action-buttons">
          <button className="btn btn-secondary" onClick={() => navigate("/crop")}>
            <span className="btn-icon">🔄</span>
            Try Another Crop
          </button>
          <button className="btn btn-primary" onClick={() => navigate("/")}>
            <span className="btn-icon">🏠</span>
            Back to Home
          </button>
        </div>
      </>
    );

    return (
      <>
        <Header />
        <div className={`crop-result-page ${cardless ? "cardless" : ""}`}>
          {!cardless && (
            <>
              {/* Extra information OUTSIDE the card (only when card is used) */}
              <div className="info-banner">
                <span className="banner-icon">🌾</span>
                <p>Based on your soil data, this crop has the highest success rate.</p>
              </div>

              {/* Main result card */}
              <div className="result-card">{content}</div>

              {/* Another extra section outside the card */}
              <div className="season-tip-outside">
                <strong>💡 Pro Tip:</strong> Rotate crops every season to maintain soil health.
              </div>
            </>
          )}

          {cardless && (
            // Card‑less layout: content directly on background, no wrapper card
            <div className="cardless-content">{content}</div>
          )}
        </div>
      </>
    );
  }