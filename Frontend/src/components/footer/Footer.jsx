import React, { useState } from "react";
import "./Footer.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLeaf, faCloud, faSeedling } from "@fortawesome/free-solid-svg-icons";
import { faLinkedinIn } from "@fortawesome/free-brands-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { faSquareXTwitter } from "@fortawesome/free-brands-svg-icons";
import { faFacebookF } from "@fortawesome/free-brands-svg-icons";

const Footer = () => {
    const [email, setEmail] = useState("");
    const [isSubscribed, setIsSubscribed] = useState(false);

    const handleNewsletterSubmit = (e) => {
        e.preventDefault();
        if (email) {
            setIsSubscribed(true);
            setEmail("");
            setTimeout(() => setIsSubscribed(false), 3000);
        }
    };

    return (
        <footer className="footer">
            <div className="footer-wrapper">
                
                {/* Main Footer Grid */}
                <div className="footer-container">
                    {/* Brand Section */}
                    <div className="footer-section footer-brand">
                        <h2 className="brand-title">🌾 KrishiDisha</h2>
                        <p className="brand-subtitle">AI-powered farming assistant</p>
                        <p className="brand-description">Empowering farmers with intelligent crop and fertilizer recommendations</p>

                        <div className="social-icons">
                            <a href="#" className="social-link" title="LinkedIn">

                                <FontAwesomeIcon icon={faLinkedinIn} />
                                

                            </a>
                            <a href="#" className="social-link" title="GitHub">
                                <FontAwesomeIcon icon={faGithub} />
                            </a>
                            <a href="#" className="social-link" title="Twitter">
                                <FontAwesomeIcon icon={faSquareXTwitter} />
                            </a>
                            <a href="#" className="social-link" title="Facebook">
                                <FontAwesomeIcon icon={faFacebookF} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="footer-section">
                        <h4>Quick Links</h4>
                        <ul className="footer-links">
                            <li><a href="#home">Home</a></li>
                            <li><a href="#crop">Crop Recommendation</a></li>
                            <li><a href="#fertilizer">Fertilizer Guide</a></li>
                            <li><a href="#weather">Weather Updates</a></li>
                            <li><a href="#calendar">Crop Calendar</a></li>
                        </ul>
                    </div>

                    {/* Resources */}
                    <div className="footer-section">
                        <h4>Resources</h4>
                        <ul className="footer-links">
                            <li><a href="#about">About Us</a></li>
                            <li><a href="#privacy">Privacy Policy</a></li>
                            <li><a href="#terms">Terms & Conditions</a></li>
                            <li><a href="#contact">Contact Support</a></li>
                            <li><a href="#faq">FAQ</a></li>
                        </ul>
                    </div>

                    {/* Contact Section */}
                    <div className="footer-section footer-contact-info">
                        <h4>Contact Us</h4>
                        <div className="contact-item">
                            <span className="contact-icon">📍</span>
                            <div>
                                <p className="contact-label">Location</p>
                                <p>Sultanpur, Uttar Pradesh, India</p>
                            </div>
                        </div>
                        <div className="contact-item">
                            <span className="contact-icon">📧</span>
                            <div>
                                <p className="contact-label">Email</p>
                                <a href="mailto:manojyadav9027@gmail.com">manojyadav9027@gmail.com</a>
                            </div>
                        </div>
                        <div className="contact-item">
                            <span className="contact-icon">📱</span>
                            <div>
                                <p className="contact-label">Phone</p>
                                <p>+91 9876543210</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Bottom */}
            <div className="footer-divider"></div>
            <div className="footer-bottom">
                <p>&copy; 2026 KrishiDisha. All rights reserved.</p>
                <p>Made with <span className="heart">💚</span> For Farmers</p>
            </div>
        </footer>
    );
};

export default Footer;