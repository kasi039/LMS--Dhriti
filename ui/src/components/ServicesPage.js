import { Button } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';

function ServicesPage() {
  const navigate = useNavigate()
  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>Welcome to Dhriti Services</h1>
      <p>🎉 You have successfully signed up!</p>
      <ul style={{ listStyle: "none", padding: 0 }}>
        <li><Button variant="primary" onClick = {() => navigate("/applyloan")}>Get Loan</Button></li>
        <li>💼 Apply for a Loan</li>
        <li>📄 Upload Documents</li>
        <li>📊 Track Loan Status</li>
        <li>💰 Payment History</li>
        <li>👤 View Profile</li>
      </ul>
    </div>
  );
}

export default ServicesPage;
