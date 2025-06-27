import {useState} from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import HomePage from "./components/HomePage";
import Footer from "./components/footer";
import AuthPage from "./components/AuthPage"; 
import ServicesPage from "./components/ServicesPage";
import AdminPage from "./components/Adminui";
import UserAccounts from "./components/useraccounts";
import EditUserPage from "./components/edituser";

import "../src/css/App.css";
import "../src/css/AuthPage.css";

function App() {
  const [userChanged, setUserChanged] = useState(false);
  const onUserChange = () => {
    setUserChanged(prev => !prev);  // toggle to trigger Header useEffect
  };
  return (
    <Router>
      <div className="App">
        <Header userChanged={userChanged} />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/Auth" element={<AuthPage onUserChange={onUserChange} />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/admin" element={<AdminPage/>} />
          <Route path="/useraccounts" element={<UserAccounts/>} />
          <Route path="editform/:id" element={<EditUserPage/>} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
