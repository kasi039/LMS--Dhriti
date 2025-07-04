
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Dropdown} from 'react-bootstrap';
import { ReactComponent as Logo } from '../assets/logo.svg';
import { ReactComponent as Profile } from '../assets/profile.svg'; 




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
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand>
          <a href="/">
            <Logo className="logo-icon" />
          </a>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar" />
        <Navbar.Collapse id="navbar">
          <Nav className="me-auto">

           {user?.role !== 'admin' && (
            <>
            <Nav.Link as={Link} to="/about">About Us</Nav.Link>
            <Nav.Link as={Link} to="/help">Help</Nav.Link>
            <Nav.Link as={Link} to={ user ? "/services" : "/Auth"}>Services</Nav.Link>
            <Nav.Link as={Link} to={ user ? "/payments" : "/Auth"}>Payments</Nav.Link>
            </>
           )}
           {user?.role === 'user' && (
            <>

            </>
           )}

           {user?.role === 'admin' && (
              <Nav.Link as={Link} to="/admin">Admin Dashboard</Nav.Link>
           )}
          </Nav>

          <div className="d-flex align-items-center">
            <Dropdown align="end">
              <Dropdown.Toggle variant="light" id="dropdown-basic" className="d-flex align-items-center border-0 bg-transparent">
                <Profile style={{ width: '30px', height: '30px' }} />
              </Dropdown.Toggle>
              <Dropdown.Menu>
                { user ? (
                  <>
                  <Dropdown.Item onClick={(e) =>{e.preventDefault(); logoutuser();}}>Logout</Dropdown.Item>
                  <Dropdown.Item onClick={() => navigate("/userapplications")}>My Profile</Dropdown.Item>
                  </>
                  ):(<Dropdown.Item onClick={() => navigate('/Auth')}>LogIn</Dropdown.Item>) }
                
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navbarfunction;
