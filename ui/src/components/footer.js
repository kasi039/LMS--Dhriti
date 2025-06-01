// src/components/Footer.js
import React from 'react';
import logo from '../assets/white-logo.svg';


function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        <div className="footer-brand">
          <img src={logo} alt="Dhriti Logo" className="footer-logo" />
        </div>

        <div className="footer-links">
          <div>
            <h4>Services</h4>
            <ul>
              <li><a href="#">Student Loan</a></li>
              <li><a href="#">Employee Loan</a></li>
              <li><a href="#">Business Loan</a></li>
              <li><a href="#">Home Loan</a></li>
              <li><a href="#">Car Loan</a></li>
              <li><a href="#">Gold Loan</a></li>
              <li><a href="#">Education Loan</a></li>
              <li><a href="#">Instant Loan</a></li>
            </ul>
          </div>
          <div>
            <h4>Home</h4>
            <ul>
              <li><a href="#">Services</a></li>
              <li><a href="#">Student Loan</a></li>
              <li><a href="#">About Us</a></li>
              <li><a href="#">Get Loan</a></li>
              <li><a href="#">Sign In</a></li>
            </ul>
          </div>
          <div>
            <h4>About Us</h4>
            <ul>
              <li><a href="#">Apply for Loan</a></li>
              <li><a href="#">Education Loan</a></li>
              <li><a href="#">Get Loan</a></li>
              <li><a href="#">Instant Loan</a></li>
              <li><a href="#">Business Loan</a></li>
            </ul>
          </div>
          <div>
            <h4>Legal</h4>
            <ul>
              <li><a href="#">Interest Policy</a></li>
              <li><a href="#">Terms & Conditions</a></li>
              <li><a href="#">Privacy & Data Policy</a></li>
              <li><a href="#">Data Deletion Policy</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-social">
            <a href="#"><i className="fab fa-twitter"></i></a>
            <a href="#"><i className="fab fa-facebook-f"></i></a>
            <a href="#"><i className="fab fa-youtube"></i></a>
            <a href="#"><i className="fab fa-instagram"></i></a>
            <a href="#"><i className="fab fa-linkedin-in"></i></a>
          </div>
          <div className="footer-copy">
            <p>Copyright © 2025 Dhriti Tech Solutions Private Limited</p>
            <p>All Rights Reserved</p>
          </div>
        </div>

      </div>
    </footer>
  );
}

export default Footer;
