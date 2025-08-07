// src/pages/loan/EmployeeLoanDetailsForm.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Row, Col, Button } from "react-bootstrap";

export default function EmployeeLoanDetailsForm() {
  const navigate = useNavigate();

  /* form state */
  const [form, setForm] = useState({
    /* personal */
    firstName:"", middleName:"", lastName:"", dob:"",
    email:"", phone:"", street:"", city:"", province:"", postalCode:"",
    /* employment */
    employer:"", employerAddress:"", jobTitle:"", employmentType:"",
    startDate:"", salary:"", payFreq:"",
    /* financial */
    loanAmount:"", housingCost:"", monthlyDebt:"", repaymentYears:"",
    /* consent */
    consent:false, privacy:false,
  });

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type==="checkbox" ? checked : value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.consent || !form.privacy) return alert("Please tick both check-boxes.");

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
        body:JSON.stringify({loanType:"employee", amount:loanAmount, details:details}),
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
      navigate(`/applyloan/docs/employee?app=${applicationId}`);
    } 
    catch (err) {
      console.error("Loan POST failed", err.message);
    }
  };

  return (
    <div className="container my-4">
      <h3 className="mb-3">Employee Loan – Step 1: Details</h3>

      <Form onSubmit={handleSubmit}>
        {/* PERSONAL */}
        <h5>Personal information</h5>
        <Row className="g-3">
          <Col md={4}><Form.Control name="firstName"  placeholder="First name"  required onChange={handleChange}/></Col>
          <Col md={4}><Form.Control name="middleName" placeholder="Middle name"           onChange={handleChange}/></Col>
          <Col md={4}><Form.Control name="lastName"   placeholder="Last name"   required onChange={handleChange}/></Col>
          <Col md={4}><Form.Control name="dob" type="date" required onChange={handleChange}/></Col>
          <Col md={4}><Form.Control name="email" type="email" placeholder="Email" required onChange={handleChange}/></Col>
          <Col md={4}><Form.Control name="phone" placeholder="Mobile phone" required onChange={handleChange}/></Col>
          <Col md={6}><Form.Control name="street" placeholder="Street address" required onChange={handleChange}/></Col>
          <Col md={3}><Form.Control name="city" placeholder="City" required onChange={handleChange}/></Col>
          <Col md={3}><Form.Control name="province" placeholder="Province" required onChange={handleChange}/></Col>
          <Col md={3}><Form.Control name="postalCode" placeholder="Postal Code" required onChange={handleChange}/></Col>
        </Row>

        {/* EMPLOYMENT */}
        <h5 className="mt-5">Employment information</h5>
        <Row className="g-3">
          <Col md={6}><Form.Control name="employer" placeholder="Employer name" required onChange={handleChange}/></Col>
          <Col md={6}><Form.Control name="employerAddress" placeholder="Employer address" required onChange={handleChange}/></Col>
          <Col md={4}><Form.Control name="jobTitle" placeholder="Job title" required onChange={handleChange}/></Col>
          <Col md={4}>
            <Form.Select name="employmentType" required onChange={handleChange}>
              <option value="">Employment type</option>
              <option>Full-time</option><option>Part-time</option><option>Contract</option>
            </Form.Select>
          </Col>
          <Col md={4}><Form.Control name="startDate" type="date" placeholder="Start date" required onChange={handleChange}/></Col>
          <Col md={4}><Form.Control name="salary" type="number" placeholder="Annual salary (CAD)" required onChange={handleChange}/></Col>
          <Col md={4}>
            <Form.Select name="payFreq" required onChange={handleChange}>
              <option value="">Pay frequency</option>
              <option>Weekly</option><option>Bi-weekly</option><option>Monthly</option>
            </Form.Select>
          </Col>
        </Row>

        {/* FINANCIAL */}
        <h5 className="mt-5">Loan & financials</h5>
        <Row className="g-3">
          <Col md={4}><Form.Control name="loanAmount"  type="number" placeholder="Requested amount" required onChange={handleChange}/></Col>
          <Col md={4}><Form.Control name="housingCost" type="number" placeholder="Monthly housing cost" onChange={handleChange}/></Col>
          <Col md={4}><Form.Control name="monthlyDebt" type="number" placeholder="Other monthly debt payments" onChange={handleChange}/></Col>
          <Col md={4}><Form.Control name="repaymentYears" type="number" placeholder="Repayment years" onChange={handleChange}/></Col>
        </Row>

        {/* CONSENT */}
        <Form.Check className="mt-4"
          type="checkbox" name="consent"  label="I certify the information is accurate."
          checked={form.consent}  onChange={handleChange} required/>
        <Form.Check
          type="checkbox" name="privacy"  label="I agree to the Privacy Policy."
          checked={form.privacy} onChange={handleChange} required/>

        <Button className="mt-4" variant="primary" type="submit">Next</Button>
      </Form>
    </div>
  );
}
