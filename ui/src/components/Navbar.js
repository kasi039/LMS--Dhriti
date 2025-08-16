
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Dropdown} from 'react-bootstrap';
import { ReactComponent as Logo } from '../assets/logo.svg';
import { ReactComponent as Profile } from '../assets/profile.svg'; 
import { ReactComponent as SigninIcon } from '../assets/Signinicon.svg'; 
import { ReactComponent as NotificationIcon } from "../assets/notification.svg";





function Navbarfunction({userChanged }) {
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
    }

  return (
    <Navbar expand="md" className={`d-flex justify-content-between ${user ? "navbar-logged" : "navbar-public"}`}>
      <Container fluid>
        <Navbar.Brand>
          <a href="/">
            <Logo className="logo-icon" />
          </a>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="navbar-nav" className="border-0" />

        <Navbar.Collapse id="navbar-nav" className="justify-content-end">
          <Nav className="align-items-center">
            <Nav.Link className="NavLink" as={Link} to="/about">About Us</Nav.Link>
            {user && user?.role !== 'admin' && (
              <>
                <Nav.Link className="NavLink" as={Link} to="/services">Services</Nav.Link>
                <Nav.Link className="NavLink" as={Link} to="/Allapprovedapplications">Payments</Nav.Link>
                <NotificationIcon
                  className="notif-icon"
                  onClick={() => navigate("/notifications")}
                  title="Notifications"
                />
              </>
            )}

            {!user && (
              <>
                <Nav.Link className="NavLink" as={Link} to="/Auth">Services</Nav.Link>
                <Nav.Link className="NavLink" as={Link} to="/Auth">Student Loan</Nav.Link>
                <Nav.Link className="NavLink get-loan-button" as={Link} to="/Auth">Get Loan</Nav.Link>
              </>
            )}

            {user?.role === 'admin' && (
              <>
                <Nav.Link className="NavLink" as={Link} to="/admin">Admin Dashboard</Nav.Link>
                <Nav.Link className="NavLink" as={Link} to="/Allpayments">Payments</Nav.Link>
              </>
            )}

            <div className="d-flex align-items-center mt-3 mt-lg-0">
              {!user ? (
                <SigninIcon onClick={() => navigate('/Auth')} className="signinicon" />
              ) : (
                <Dropdown align="end">
                  <Dropdown.Toggle className="bg-transparent border-0 p-0">
                    <Profile className="profileicon nav-icon" />
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={(e) => { e.preventDefault(); logoutuser(); }}>
                      Logout
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => navigate("/userapplications")}>
                      My Profile
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              )}
            </div>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>

  );
}

export default Navbarfunction;
