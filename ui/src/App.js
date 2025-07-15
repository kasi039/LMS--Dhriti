import {useState} from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbarfunction from "./components/Navbar";
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
import Userdocuments from "./components/DocumentsByUser"
import AllApplications from "./components/Allapplications";

import "../src/css/App.css";
import "../src/css/AuthPage.css";


function App() {
  const [userChanged, setUserChanged] = useState(null);
  const onUserChange = (userData) => {
    setUserChanged(userData);  
  };
  return (
    <Router>
      <div className="App">
        <Navbarfunction userChanged={userChanged} />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/Auth" element={<AuthPage onUserChange={onUserChange} />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/admin" element={<AdminPage/>} />
          <Route path="/useraccounts" element={<UserAccounts/>} />
          <Route path="editform/:id" element={<EditUserPage/>} />
          <Route path="/applyloan" element={<ApplyLoan />} />
          <Route path="/success" element={<Success />} />
          <Route path="/userapplications" element={<UserApplications />} />
          <Route path="/userdocuments/:id" element={<Userdocuments />}/>
          <Route path="/allapplications" element={<AllApplications />}/>
          {/* Add more routes as needed */}
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
