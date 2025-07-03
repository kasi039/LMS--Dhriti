import React, { useState, useEffect } from 'react';
import { ReactComponent as Logo } from '../assets/logo.svg';
import { ReactComponent as Profile } from '../assets/profile.svg';
import { useNavigate } from 'react-router-dom';

function Header({ userChanged }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

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
      }
    };
    fetchSessionUser();
  }, [userChanged]);

  const logoutuser = async () => {
    try {
      if (!window.confirm("Are you sure you want to logout?")) return;
      const res = await fetch('http://localhost:5000/api/users/logout', {
        method: 'POST',
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Logout failed');
      setUser(null);
      navigate('/');
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const handleProtectedClick = (e, path) => {
    e.preventDefault();
    if (user) {
      navigate(path);
    } else {
      alert('Please sign in first!');
      navigate('/Auth');
    }
  };

  return (
    <header>
      <nav className="navbar">
        <div className="logo">
          <a href="/">
            <Logo className="logo-icon" />
          </a>
        </div>
        <ul className="nav-links">
          {user?.role !== 'admin' && (
            <>
              <li>
                <a href="#" onClick={(e) => handleProtectedClick(e, '/services')}>Services</a>
              </li>
              <li>
                <a href="#" onClick={(e) => handleProtectedClick(e, '/studentloan')}>Student loan</a>
              </li>
              <li>
                <a href="#" onClick={(e) => handleProtectedClick(e, '/aboutus')}>About us</a>
              </li>
            </>
          )}

          {user?.role === 'admin' && (
            <li><a href="/admin">Admin Dashboard</a></li>
          )}

          {user?.role !== 'admin' && (
            <li className="loan-button-container">
              <button
                className="get-loan-button"
                onClick={() => {
                  if (user) {
                    navigate('/applyloan');
                  } else {
                    alert('Please sign in first!');
                    navigate('/Auth');
                  }
                }}
              >
                Get loan
              </button>
            </li>
          )}

          
            <li className="profile" onClick={() => navigate('/Auth')}>
              <Profile className="profile-icon" />
            </li>
          
        </ul>
      </nav>
    </header>
  );
}

export default Header;
