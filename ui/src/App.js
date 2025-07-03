import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

import Header from "./components/Header";
import NavbarAfterLogin from "./components/NavbarAfterLogin";

import HomePage from "./components/HomePage";
import Footer from "./components/footer";
import AuthPage from "./components/AuthPage";
import ServicesPage from "./components/ServicesPage";
import AdminPage from "./components/Adminui";
import UserAccounts from "./components/useraccounts";
import EditUserPage from "./components/edituser";
import ApplyLoan from "./components/ApplyLoan";
import Success from "./components/successfull";
import UserApplications from "./components/ApplicationbyUser";
import Userdocuments from "./components/DocumentsByUser";

import "../src/css/App.css";
import "../src/css/AuthPage.css";

function Layout({ isLoggedIn, onLogout, onToggleTheme }) {
  const location = useLocation();

  // Pages that need NavbarAfterLogin
  const pagesWithLoginNavbar = [
    "/services",
    "/payments",
    "/about",
    "/help",
    "/useraccounts",
    "/editform",
    "/applyloan",
    "/success",
    "/userapplications",
    "/userdocuments"
  ];

  const showLoginNavbar = isLoggedIn && pagesWithLoginNavbar.some(path =>
    location.pathname.startsWith(path)
  );

  return (
    <>
      {showLoginNavbar ? (
        <NavbarAfterLogin onLogout={onLogout} onToggleTheme={onToggleTheme} />
      ) : (
        <Header />
      )}
    </>
  );
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn");
    setIsLoggedIn(loggedIn === "true");
  }, []);

  const handleUserChange = () => {
    localStorage.setItem("isLoggedIn", "true");
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    setIsLoggedIn(false);
  };

  const handleToggleTheme = () => {
    alert("Dark mode toggle clicked!");
  };

  return (
    <Router>
      <Layout isLoggedIn={isLoggedIn} onLogout={handleLogout} onToggleTheme={handleToggleTheme} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/Auth" element={<AuthPage onUserChange={handleUserChange} />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/useraccounts" element={<UserAccounts />} />
        <Route path="editform/:id" element={<EditUserPage />} />
        <Route path="/applyloan" element={<ApplyLoan />} />
        <Route path="/success" element={<Success />} />
        <Route path="/userapplications" element={<UserApplications />} />
        <Route path="/userdocuments" element={<Userdocuments />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
