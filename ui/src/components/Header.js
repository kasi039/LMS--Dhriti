import React from 'react';
import { ReactComponent as Logo } from '../assets/logo.svg';
import { ReactComponent as Profile } from '../assets/profile.svg';
import { useNavigate } from 'react-router-dom';
 


function Header() {
  const navigate = useNavigate();

  return (
    <header>
      <nav className="navbar">
        <div className="logo">
          <Logo className="logo-icon" />
        </div>
        <ul className="nav-links">
          <li><a href="#home">Services</a></li>
          <li><a href="#apply">Student loan</a></li>
          <li><a href="#status">About us</a></li>
          <li className="loan-button-container">
            <button className="get-loan-button">Get loan</button>
          </li>
        </ul>
        <div className="profile" onClick={() => navigate('/Auth')}>
          <Profile className="profile-icon" />
        </div>
      </nav>
    </header>
  );
}

export default Header;
