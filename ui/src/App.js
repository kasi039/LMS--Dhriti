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
import Success from "./components/successfull";
import UserApplications from "./components/ApplicationbyUser";
import Userdocuments from "./components/DocumentsByUser"
import AllApplications from "./components/Allapplications";
import StudentLoanDetailsForm from "./components/loans/StudentLoanDetailsForm";
import StudentLoanDocuments from "./components/loans/StudentLoanDocuments";
import EmployeeLoanDetailsForm from "./components/loans/EmployeeLoanDetailsForm";
import EmployeeLoanDocuments from "./components/loans/EmployeeLoanDocuments";
import BusinessLoanDetailsForm from "./components/loans/BusinessLoanDetailsForm";
import BusinessLoanDocuments   from "./components/loans/BusinessLoanDocuments";
import HomeLoanDetailsForm from "./components/loans/HomeLoanDetailsForm";
import HomeLoanDocuments   from "./components/loans/HomeLoanDocuments";
import CarLoanDetailsForm from "./components/loans/CarLoanDetailsForm";
import CarLoanDocuments   from "./components/loans/CarLoanDocuments";
import GoldLoanDetailsForm from "./components/loans/GoldLoanDetailsForm";
import GoldLoanDocuments   from "./components/loans/GoldLoanDocuments";
import InstantLoanDetailsForm from "./components/loans/InstantLoanDetailsForm";
import InstantLoanDocuments   from "./components/loans/InstantLoanDocuments";
import AboutUsPage from "./components/AboutUsPage";
import GetTheApplicationDetails from "./components/ApplicationDetails";
import LoanPayment from "./components/PaymentPage";
import PaymentSuccess from "./components/PaymentSuccess";
import PaymentFailed from "./components/PaymentFailed";
import Allapprovedapplications from "./components/Allapprovedpayments";

import "../src/css/App.css";
import "../src/css/AuthPage.css";
import "../src/css/ServicesPage.css";
import "../src/css/AboutUsPage.css";
import "../src/css/Navbar.css";


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
          <Route path="/success" element={<Success />} />
          <Route path="/userapplications" element={<UserApplications />} />
          <Route path="/userdocuments/:id" element={<Userdocuments />}/>
          <Route path="/allapplications" element={<AllApplications />}/>
          <Route path="/applyloan/details/student"   element={<StudentLoanDetailsForm />} />
          <Route path="/applyloan/docs/student"      element={<StudentLoanDocuments />} />
          <Route path="/applyloan/details/employee" element={<EmployeeLoanDetailsForm />}/>
          <Route path="/applyloan/docs/employee"             element={<EmployeeLoanDocuments />}/>
          <Route path="/applyloan/details/business" element={<BusinessLoanDetailsForm/>}/>
          <Route path="/applyloan/docs/business"            element={<BusinessLoanDocuments/>}/>
          <Route path="/applyloan/details/home" element={<HomeLoanDetailsForm/>}/>
          <Route path="/applyloan/docs/home"         element={<HomeLoanDocuments/>}/>
          <Route path="/applyloan/details/car" element={<CarLoanDetailsForm />} />
          <Route path="/applyloan/docs/car"       element={<CarLoanDocuments />} />
          <Route path="/applyloan/details/gold" element={<GoldLoanDetailsForm />} />
          <Route path="/applyloan/docs/gold"         element={<GoldLoanDocuments />} />
          <Route path="/applyloan/details/instant" element={<InstantLoanDetailsForm />} />
          <Route path="/applyloan/docs/instant"     element={<InstantLoanDocuments />} />
          <Route path="/about" element={<AboutUsPage />} />
          <Route path="/applicationdetails/:id" element={<GetTheApplicationDetails/>} />
          <Route path="/paynow/:id" element={<LoanPayment/>} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/payment-failed" element={<PaymentFailed />} />
          <Route path="/Allapprovedapplications" element = {<Allapprovedapplications />}/>
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
