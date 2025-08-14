// src/pages/loan/InstantLoanDetailsForm.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Row, Col, Button } from "react-bootstrap";

export default function InstantLoanDetailsForm() {
  const navigate = useNavigate();

  /* only the bare minimum for a same-day cash loan */
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", phone: "",
    dob: "", sin: "",               // SIN optional but typical for payday checks
    street: "", city: "", province: "", postal: "",
    employer: "", netMonthlyIncome: "",
    consent: false, privacy: false,
  });

  const change = e => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const submit = async e => {
    e.preventDefault();
    if (!form.consent || !form.privacy) return alert("Please tick both boxes.");

    const loanAmount = form.loanAmount;

    const details = {...form};
    delete details.loanAmount;
    delete details.consent;
    delete details.privacy;

    let applicationId ;
    try{
      const res = await fetch('http://localhost:5000/api/applications/applyLoan',{
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body:JSON.stringify({loanType:"instant", amount:loanAmount, details:details}),
        credentials: "include"
      });
       if (!res.ok) {
        alert("Failed to submit application. Please try again later.");
        console.log("Error response:", res.status, res.statusText);
        return;
      } 
  
      const data = await res.json();
      applicationId = data.applicationId;

      if (!applicationId) {
          alert("Application ID missing from server response.");
          return;
      }
      alert("Application submitted successfully! Proceed to upload documents.");
      navigate(`/applyloan/docs/instant?app=${applicationId}`);
    } 
    catch (err) {
      console.error("Loan POST failed", err.message);
    }
  };

  return (
    <div className="container my-4">
      <h3 className="mb-3">Instant Loan – Step 1: Details</h3>

      <Form onSubmit={submit}>
        {/* PERSONAL */}
        <Row className="g-3">
          <Col md={4}><Form.Control name="firstName"  placeholder="First name" required onChange={change} /></Col>
          <Col md={4}><Form.Control name="lastName"   placeholder="Last name"  required onChange={change} /></Col>
          <Col md={4}><Form.Control name="dob"    type="date" placeholder="DOB" required onChange={change} /></Col>
          <Col md={4}><Form.Control name="email"  type="email" placeholder="Email" required onChange={change} /></Col>
          <Col md={4}><Form.Control name="phone"  placeholder="Phone" required onChange={change} /></Col>
          <Col md={4}><Form.Control name="sin"    placeholder="SIN (optional)" onChange={change} /></Col>
          <Col md={6}><Form.Control name="street" placeholder="Street address" required onChange={change} /></Col>
          <Col md={3}><Form.Control name="city"   placeholder="City" required onChange={change} /></Col>
          <Col md={3}><Form.Control name="province" placeholder="Province" required onChange={change} /></Col>
          <Col md={3}><Form.Control name="postal" placeholder="Postal code" required onChange={change} /></Col>
        </Row>

        {/* EMPLOYMENT / INCOME */}
        <h5 className="mt-4">Income</h5>
        <Row className="g-3">
          <Col md={6}><Form.Control name="employer" placeholder="Employer" required onChange={change} /></Col>
          <Col md={6}><Form.Control name="netMonthlyIncome" type="number" placeholder="Net monthly income (CAD)" required onChange={change} /></Col>
        </Row>

        {/* LOAN AMOUNT (fixed between $300 and $2 000) */}
        <h5 className="mt-4">Loan amount</h5>
        <Row className="g-3">
          <Col md={4}><Form.Control name="loanAmount" type="number" min="300" max="2000" step="50"
                     value={form.loanAmount} onChange={change} required /></Col>
        </Row>

        {/* CONSENT */}
        <Form.Check className="mt-3"
          type="checkbox" name="consent"
          label="I certify the information is accurate."
          checked={form.consent} onChange={change} required />
        <Form.Check
          type="checkbox" name="privacy"
          label="I agree to the Privacy Policy."
          checked={form.privacy} onChange={change} required />

        <Button variant="primary" type="submit" className="mt-3">Next</Button>
      </Form>
    </div>
  );
}
