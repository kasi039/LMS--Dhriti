// src/components/Footer.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/white-logo.svg";
import "../css/FooterPage.css";
import { useLocation } from "react-router-dom";

function Footer() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessionUser = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/users/session-user', {
          credentials: 'include',
        });
        if (!res.ok) throw new Error('Not logged in');
        const data = await res.json();
        console.log("Fetched session user:", data);
        setUser(data.user);
      } catch (err) {
        console.log("Fetched session user error:", err);
        setUser(null);
      } finally{
        setLoading(false);
      }
    };
    fetchSessionUser();
  }, [location]);

  // Helper: go to path if logged in, else go to /Auth
  const go = (authedPath) => {
    if(loading) return;
    if (user) navigate(authedPath);
    else navigate("/Auth");
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Brand */}
        <div className="footer-brand">
          <img src={logo} alt="Dhriti Logo" className="footer-logo" />
        </div>

        {/* Quick Links (NO legal/privacy) */}
        <div className="footer-links">
          <div>
            <h4>Services</h4>
            <ul>
              <li>
                <button className="footer-link-btn" onClick={() => go("/services")}>
                  Apply for Loan
                </button>
              </li>
              <li>
                <button className="footer-link-btn" onClick={() => go("/userapplications")}>
                  Track Loan Status
                </button>
              </li>
              <li>
                <button className="footer-link-btn" onClick={() => go("/Allapprovedapplications")}>
                  Payments
                </button>
              </li>
              <li>
                <button className="footer-link-btn" onClick={() => go("/services")}>
                  Services Hub
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4>Explore</h4>
            <ul>
              <li>
                <button className="footer-link-btn" onClick={() => navigate("/")}>
                  Home
                </button>
              </li>
              <li>
                <button className="footer-link-btn" onClick={() => navigate("/about")}>
                  About Us
                </button>
              </li>
              <li>
                <button className="footer-link-btn" onClick={() => navigate("/help")}>
                  Help Center
                </button>
              </li>
              <li>
                <button className="footer-cta-btn" onClick={() => go("/userapplications")}>
                  {user ? "My Account" : "Sign In / Get Loan"}
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4>Loans</h4>
            <ul>
              <li>
                <button className="footer-link-btn" onClick={() => go("/applyloan/details/student")}>
                  Student Loan
                </button>
              </li>
              <li>
                <button className="footer-link-btn" onClick={() => go("/applyloan/details/home")}>
                  Home Loan
                </button>
              </li>
              <li>
                <button className="footer-link-btn" onClick={() => go("/applyloan/details/car")}>
                  Car Loan
                </button>
              </li>
              <li>
                <button className="footer-link-btn" onClick={() => go("/applyloan/docs/business")}>
                  Business Loan
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="footer-bottom">
          <div className="footer-social">
            <a href="#"><i className="fab fa-twitter" /></a>
            <a href="#"><i className="fab fa-facebook-f" /></a>
            <a href="#"><i className="fab fa-youtube" /></a>
            <a href="#"><i className="fab fa-instagram" /></a>
            <a href="#"><i className="fab fa-linkedin-in" /></a>
          </div>
          <div className="footer-copy">
            <p>Copyright © 2025 Dhriti Tech Solutions Private Limited</p>
            <p>Copyright © Kasi Philips Sannihith</p>
            <p>All Rights Reserved</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
