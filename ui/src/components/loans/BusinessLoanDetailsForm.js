// src/pages/loan/BusinessLoanDetailsForm.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Row, Col, Button } from "react-bootstrap";

export default function BusinessLoanDetailsForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    /* owner */
    ownerFirst:"", ownerLast:"", ownerEmail:"", ownerPhone:"",
    /* business */
    businessName:"", tradeName:"", regNumber:"", street:"", city:"", province:"", postalCode:"",
    startDate:"", industry:"", employees:"", revenue:"",
    /* loan */
    loanAmount:"", purpose:"", monthlyDebt:"", repaymentYears:"",
    /* consent */
    consent:false, privacy:false,
  });

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type==="checkbox" ? checked : value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if(!form.consent || !form.privacy) return alert("Please tick both declarations.");

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
        body:JSON.stringify({loanType:"business", amount:loanAmount, details:details}),
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
      navigate(`/applyloan/docs/business?app=${applicationId}`);
    } 
    catch (err) {
      console.error("Loan POST failed", err.message);
    }
  };

  return (
    <div className="container my-4">
      <h3 className="mb-3">Business Loan – Step&nbsp;1: Details</h3>

      <Form onSubmit={handleSubmit}>
        {/* OWNER */}
        <h5>Owner information</h5>
        <Row className="g-3">
          <Col md={4}><Form.Control name="ownerFirst" placeholder="First name" required onChange={handleChange}/></Col>
          <Col md={4}><Form.Control name="ownerLast"  placeholder="Last name"  required onChange={handleChange}/></Col>
          <Col md={4}><Form.Control name="ownerEmail" type="email" placeholder="Email" required onChange={handleChange}/></Col>
          <Col md={4}><Form.Control name="ownerPhone" placeholder="Phone" required onChange={handleChange}/></Col>
        </Row>

        {/* BUSINESS */}
        <h5 className="mt-5">Business information</h5>
        <Row className="g-3">
          <Col md={6}><Form.Control name="businessName" placeholder="Legal business name" required onChange={handleChange}/></Col>
          <Col md={6}><Form.Control name="tradeName" placeholder="Trade / operating name" onChange={handleChange}/></Col>
          <Col md={4}><Form.Control name="regNumber" placeholder="Registration / Incorporation #"
                   required onChange={handleChange}/></Col>
          <Col md={4}><Form.Control name="industry" placeholder="Industry" required onChange={handleChange}/></Col>
          <Col md={4}><Form.Control name="startDate" type="date" placeholder="Business start date"
                   required onChange={handleChange}/></Col>
          <Col md={3}><Form.Control name="employees" type="number" placeholder="# Employees"
                   required onChange={handleChange}/></Col>
          <Col md={3}><Form.Control name="revenue" type="number" placeholder="Annual revenue (CAD)"
                   required onChange={handleChange}/></Col>
          <Col md={6}><Form.Control name="street" placeholder="Business street address"
                   required onChange={handleChange}/></Col>
          <Col md={3}><Form.Control name="city" placeholder="City" required onChange={handleChange}/></Col>
          <Col md={3}><Form.Control name="province" placeholder="Province" required onChange={handleChange}/></Col>
          <Col md={3}><Form.Control name="postalCode" placeholder="Postal Code" required onChange={handleChange}/></Col>
        </Row>

        {/* LOAN */}
        <h5 className="mt-5">Loan details</h5>
        <Row className="g-3">
          <Col md={4}><Form.Control name="loanAmount" type="number" placeholder="Requested amount" required onChange={handleChange}/></Col>
          <Col md={6}><Form.Control name="purpose" placeholder="Purpose of funds" required onChange={handleChange}/></Col>
          <Col md={4}><Form.Control name="monthlyDebt" type="number" placeholder="Existing monthly debt payments" onChange={handleChange}/></Col>
          <Col md={4}><Form.Control name="repaymentYears" type="number" placeholder="Repayment years" onChange={handleChange}/></Col>
        </Row>

        {/* CONSENT */}
        <Form.Check className="mt-4"
          type="checkbox" name="consent" label="I certify the information is accurate."
          checked={form.consent} onChange={handleChange} required/>
        <Form.Check
          type="checkbox" name="privacy" label="I agree to the Privacy Policy."
          checked={form.privacy} onChange={handleChange} required/>

        <Button className="mt-4" variant="primary" type="submit">Next</Button>
      </Form>
    </div>
  );
}
