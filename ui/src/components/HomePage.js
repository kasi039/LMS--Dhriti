// src/components/HomePage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/HomePage.css'; // Import your CSS styles

import phoneImage from '../assets/phone-mockup.png'; 
import approvalIcon from '../assets/approval-icon.svg';
import percentIcon from '../assets/100percent-icon.svg';
import bankIcon from '../assets/bank-icon.svg';
import happyIcon from '../assets/happy-icon.svg';

function HomePage() {
  const navigate = useNavigate();

  return (
    <main className="main-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-inner">
          {/* Left Text */}
          <div className="hero-text">
            <h1>
              Dhriti: Your <span className="highlight">Instant</span> <br />
              <span className="highlight">Loan App</span> for Hassle-Free Loans
            </h1>
            <p>
              Ready to invest in your future, but concerned about the financial hurdles along the way? Dhriti is your Instant Loan App for quick financial solutions in India. As a trusted credit loan app, we are here to help you navigate the world of personal loans with confidence and clarity.
            </p>
            <div className="hero-buttons">
              <button className="button-modeled" onClick={() => navigate('/Auth')}>
                Apply Now
              </button>
            </div>
          </div>

          {/* Right Image */}
          <div className="hero-image">
            <img src={phoneImage} alt="App Preview" />
          </div>
        </div>
      </section>

      <section className="why-dhriti">
        <h2>Why Choose Dhriti credit loan app?</h2>
        <div className="features-grid">
          <div className="feature-box">
            <img src={approvalIcon} alt="Approval in 10 minutes" />
            <h3>Approval in 10 minutes</h3>
            <p>Get funds fast with our 10-minutes loan approval process</p>
          </div>

          <div className="feature-box">
            <img src={percentIcon} alt="100% online process" />
            <h3>100% online process</h3>
            <p>Streamline your finances with our 100% online loan application process</p>
          </div>

          <div className="feature-box">
            <img src={bankIcon} alt="Direct Bank Transfer" />
            <h3>Direct Bank Transfer</h3>
            <p>Seamless funds delivery through secure direct bank transfer</p>
          </div>

          <div className="feature-box">
            <img src={happyIcon} alt="Flexible & Hassle Free" />
            <h3>Flexible & Hassle Free</h3>
            <p>Take bullet loans or choose from easy EMI payment options</p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default HomePage;
