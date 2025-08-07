import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar, Nav, Container, Dropdown } from "react-bootstrap";

import { ReactComponent as Logo }          from "../assets/logo.svg";
import { ReactComponent as Profile }       from "../assets/profile.svg";
import { ReactComponent as SigninIcon }    from "../assets/Signinicon.svg";

/* NEW icons */
import { ReactComponent as NotificationIcon } from "../assets/notification.svg";
import { ReactComponent as SearchIcon }       from "../assets/search.svg";
// in src/components/Navbar.js (or Navbar.jsx)
import "../css/Navbar.css";


function Navbarfunction({ userChanged }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("http://localhost:5000/api/users/session-user", {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Not logged in");
        const data = await res.json();
        setUser(data.user);
      } catch (err) {
        setUser(null);
      }
    })();
  }, [userChanged]);

  const logoutuser = async () => {
    if (!window.confirm("Are you sure you want to logout?")) return;
    await fetch("http://localhost:5000/api/users/logout", {
      method: "POST",
      credentials: "include",
    });
    setUser(null);
    navigate("/");
  };

  return (
    <Navbar
      expand="lg"
      className={`d-flex justify-content-between ${
        user ? "navbar-logged" : "navbar-public"
      }`}
    >
      <Container fluid className="d-flex justify-content-between align-items-center">
        <Navbar.Brand as={Link} to="/">
          <Logo className="logo-icon" />
        </Navbar.Brand>

        <Nav className="align-items-center">
          {user && user?.role !== "admin" && (
            <>
              <Nav.Link as={Link} className="NavLink" to="/services">
                Services
              </Nav.Link>
          
              <Nav.Link as={Link} className="NavLink" to="/about">
                About&nbsp;Us
              </Nav.Link>
              <Nav.Link as={Link} className="NavLink" to="/payments">
                Payments
              </Nav.Link>

              {/* NEW icons after Payments */}
              <NotificationIcon
                className="notif-icon"
                onClick={() => navigate("/notifications")}
                title="Notifications"
              />
              <SearchIcon
                className="search-icon"
                onClick={() => navigate("/search")}
                title="Search"
              />
            </>
          )}

          {!user && (
            <>
              <Nav.Link as={Link} className="NavLink" to="/Auth">
                Services
              </Nav.Link>
              <Nav.Link as={Link} className="NavLink" to="/Auth">
                Student Loan
              </Nav.Link>
              <Nav.Link as={Link} className="NavLink" to="/Auth">
                About&nbsp;Us
              </Nav.Link>
              <Nav.Link as={Link} className="NavLink get-loan-button" to="/Auth">
                Get Loan
              </Nav.Link>
            </>
          )}

          {user?.role === "admin" && (
            <Nav.Link as={Link} className="NavLink" to="/admin">
              Admin Dashboard
            </Nav.Link>
          )}

          {/* right-side auth or profile area */}
          <div className="d-flex align-items-center">
            {!user ? (
              <SigninIcon
                onClick={() => navigate("/Auth")}
                className="signinicon"
              />
            ) : (
              <Dropdown align="end">
                <Dropdown.Toggle className="bg-transparent border-0 p-0">
                  <Profile className="profileicon nav-icon"/>
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Header>{user?.name}</Dropdown.Header>  {/* ONE name here  */}
                  <Dropdown.Item onClick={()=> navigate("/profile")}>My profile</Dropdown.Item>
                  <Dropdown.Item onClick={logoutuser}>Logout</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            )}
          </div>
        </Nav>
      </Container>
    </Navbar>
  );
}

export default Navbarfunction;
