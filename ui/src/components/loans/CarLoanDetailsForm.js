// src/pages/loan/CarLoanDetailsForm.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Row, Col, Button } from "react-bootstrap";

export default function CarLoanDetailsForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    /* personal */
    firstName:"", middleName:"", lastName:"", dob:"", email:"", phone:"",
    street:"", city:"", province:"", postal:"",
    /* car */
    make:"", model:"", year:"", vin:"", purchasePrice:"", downPayment:"", dealer:"",
    /* loan */
    loanAmount:"", term:"", monthlyDebt:"", repaymentYears:"",
    /* consent */
    consent:false, privacy:false,
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

    let applicationId;
    try {
      const res = await fetch('http://localhost:5000/api/applications/applyLoan', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ loanType: "car", amount: loanAmount, details: details }),
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
      alert("Application details saved successfully! Proceed to upload documents.");
      navigate(`/applyloan/docs/car?app=${applicationId}`);
    } 
    catch (err) { console.error(err); }

    
  };

  return (
    <div className="container my-4">
      <h3 className="mb-3">Car Loan – Step 1: Details</h3>

      <Form onSubmit={submit}>
        {/* PERSONAL */}
        <h5>Personal information</h5>
        <Row className="g-3">
          <Col md={4}><Form.Control name="first"  placeholder="First name"  required onChange={change}/></Col>
          <Col md={4}><Form.Control name="middle" placeholder="Middle name"           onChange={change}/></Col>
          <Col md={4}><Form.Control name="last"   placeholder="Last name"   required onChange={change}/></Col>
          <Col md={4}><Form.Control name="dob" type="date" required onChange={change}/></Col>
          <Col md={4}><Form.Control name="email" type="email" placeholder="Email" required onChange={change}/></Col>
          <Col md={4}><Form.Control name="phone" placeholder="Mobile phone" required onChange={change}/></Col>
          <Col md={6}><Form.Control name="street" placeholder="Street address" required onChange={change}/></Col>
          <Col md={3}><Form.Control name="city" placeholder="City" required onChange={change}/></Col>
          <Col md={3}><Form.Control name="province" placeholder="Province" required onChange={change}/></Col>
          <Col md={3}><Form.Control name="postal" placeholder="Postal code" required onChange={change}/></Col>
        </Row>

        {/* CAR */}
        <h5 className="mt-5">Vehicle information</h5>
        <Row className="g-3">
          <Col md={3}><Form.Control name="make"  placeholder="Make"  required onChange={change}/></Col>
          <Col md={3}><Form.Control name="model" placeholder="Model" required onChange={change}/></Col>
          <Col md={2}><Form.Control name="year"  type="number" placeholder="Year" required onChange={change}/></Col>
          <Col md={4}><Form.Control name="vin"   placeholder="VIN" required onChange={change}/></Col>
          <Col md={4}><Form.Control name="purchasePrice" type="number" placeholder="Purchase price (CAD)" required onChange={change}/></Col>
          <Col md={4}><Form.Control name="downPayment"  type="number" placeholder="Down-payment (CAD)" required onChange={change}/></Col>
          <Col md={4}><Form.Control name="dealer" placeholder="Dealer name" required onChange={change}/></Col>
        </Row>

        {/* LOAN */}
        <h5 className="mt-5">Loan details</h5>
        <Row className="g-3">
          <Col md={4}><Form.Control name="loanAmount" type="number" placeholder="Requested amount" required onChange={change}/></Col>
          <Col md={3}><Form.Control name="term" type="number" placeholder="Term (years)" required onChange={change}/></Col>
          <Col md={3}><Form.Control name="repaymentYears" type="number" placeholder="Preferred repayment years" onChange={change}/></Col>
          <Col md={4}><Form.Control name="monthlyDebt" type="number" placeholder="Existing monthly debt" onChange={change}/></Col>
        </Row>

        {/* CONSENT */}
        <Form.Check className="mt-4"
          type="checkbox" name="consent" label="I certify the information is accurate."
          checked={form.consent} onChange={change} required/>
        <Form.Check
          type="checkbox" name="privacy" label="I agree to the Privacy Policy."
          checked={form.privacy} onChange={change} required/>

        <Button className="mt-4" variant="primary" type="submit">Next</Button>
      </Form>
    </div>
  );
}
