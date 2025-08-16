import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

/* ❶ Loan-category icons (put the SVGs in src/assets/) */
import { ReactComponent as StudentIcon }   from "../assets/student_loan.svg";
import { ReactComponent as EmployeeIcon }  from "../assets/employee_loan.svg";
import { ReactComponent as BusinessIcon }  from "../assets/business_loan.svg";
import { ReactComponent as HomeIcon }      from "../assets/home_loan.svg";
import { ReactComponent as CarIcon }       from "../assets/car_loan.svg";
import { ReactComponent as GoldIcon }      from "../assets/gold_loan.svg";
import { ReactComponent as InstantIcon }   from "../assets/instant_loan.svg";
import "../css/ServicesPage.css"; // Import your CSS styles
import HelpFab from "./HelpFab";

export default function ServicesPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  /* ❷ Fetch session user once */
  useEffect(() => {
    (async () => {
      try {
        const res  = await fetch("http://localhost:5000/api/users/session-user",
                                { credentials: "include" });
        if (!res.ok) throw new Error("Not logged in");
        const data = await res.json();
        setUser(data.user);
      } catch (err) {
        setUser(null);
      }
    })();
  }, []);

  /* ❸ Tile meta-data array keeps JSX tidy */
  const tiles = [
    // in ServicesPage.jsx  (inside the tiles array)
    { Icon: StudentIcon,  label: "Loan for Student",
      onClick: () => navigate("/applyloan/details/student") },
    { Icon: EmployeeIcon, label: "Loan for Employee",
      onClick: () => navigate("/applyloan/details/employee") },
    { Icon: BusinessIcon, label:"Loan for Business",
      onClick:()=>navigate("/applyloan/details/business") },

    { Icon: HomeIcon, label:"Loan for Home",
      onClick:()=>navigate("/applyloan/details/home") },
    { Icon: CarIcon, label: "Loan for Car",
  onClick: () => navigate("/applyloan/details/car") },

    { Icon: GoldIcon, label: "Loan for Gold",
  onClick: () => navigate("/applyloan/details/gold") },



    { Icon: InstantIcon, label: "Instant Loan",
  onClick: () => navigate("/applyloan/details/instant") },

  ];

  return (
    <div className="services-wrapper">
      <p className="mt-3 mb-1 fw-medium">Hi, Welcome</p>
      <h6 className="fw-bold text-uppercase mb-4">
        {user ? user.name : "GUEST USER"}
      </h6>

      <div className="loan-grid">
        {tiles.map(({ Icon, label, onClick }) => (
          <button key={label} className="loan-tile" onClick={onClick}>
            <Icon className="tile-icon" />
            <span>{label}</span>
          </button>
        ))}

        {/* invisible filler so the last two are centred */}
        <div className="loan-tile filler" aria-hidden="true"></div>
      </div>
      <button className="btn get-app-btn mt-4">Get Dhriti App</button>
      <div style={{ padding: "2rem", textAlign: "center" }}>
      {/* your existing UI */}
      <HelpFab /> {/* ← floating button */}
    </div>
    </div>
    
  );
}
