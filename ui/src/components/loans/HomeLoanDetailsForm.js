// src/pages/loan/HomeLoanDetailsForm.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Row, Col, Button } from "react-bootstrap";

export default function HomeLoanDetailsForm() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    /* personal */
    firstName:"", middleName:"", lastName:"", dob:"", email:"", phone:"",
    street:"", city:"", province:"", postal:"", yearsAtAddr:"",
    /* property */
    propStreet:"", propCity:"", propProv:"", propPostal:"",
    propValue:"", downPayment:"", propType:"", occupancy:"", closeDate:"",
    /* income */
    employer:"", jobTitle:"", startDate:"", salary:"", otherIncome:"",
    /* loan */
    loanAmount:"", term:"", rateType:"", purpose:"", monthlyDebt:"",
    /* consent */
    consent:false, privacy:false,
  });

  const change = e=>{
    const {name,value,type,checked}=e.target;
    setForm({...form,[name]:type==="checkbox"?checked:value});
  };

  const submit=async e=>{
    e.preventDefault();
    if(!form.consent||!form.privacy) return alert("Please tick both boxes.");

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
        body:JSON.stringify({loanType:"home", amount:loanAmount, details:details}),
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
      navigate(`/applyloan/docs/home?app=${applicationId}`);
    } 
    catch (err) {
      console.error("Loan POST failed", err.message);
    }
  };

  return(
    <div className="container my-4">
      <h3 className="mb-3">Home Loan – Step 1: Details</h3>

      <Form onSubmit={submit}>
        {/* PERSONAL */}
        <h5>Personal information</h5>
        <Row className="g-3">
          <Col md={4}><Form.Control name="firstName"   placeholder="First name"  required onChange={change}/></Col>
          <Col md={4}><Form.Control name="middleName"  placeholder="Middle name"          onChange={change}/></Col>
          <Col md={4}><Form.Control name="lastName"    placeholder="Last name"   required onChange={change}/></Col>
          <Col md={4}><Form.Control name="dob" type="date" required onChange={change}/></Col>
          <Col md={4}><Form.Control name="email" type="email" placeholder="Email" required onChange={change}/></Col>
          <Col md={4}><Form.Control name="phone" placeholder="Mobile phone" required onChange={change}/></Col>
          <Col md={6}><Form.Control name="street" placeholder="Current street address" required onChange={change}/></Col>
          <Col md={3}><Form.Control name="city" placeholder="City" required onChange={change}/></Col>
          <Col md={3}><Form.Control name="province" placeholder="Province" required onChange={change}/></Col>
          <Col md={3}><Form.Control name="postal" placeholder="Postal code" required onChange={change}/></Col>
          <Col md={3}><Form.Control name="yearsAtAddr" type="number" placeholder="Years at address" required onChange={change}/></Col>
        </Row>

        {/* PROPERTY */}
        <h5 className="mt-5">Property information</h5>
        <Row className="g-3">
          <Col md={6}><Form.Control name="propStreet" placeholder="Property street address" required onChange={change}/></Col>
          <Col md={3}><Form.Control name="propCity" placeholder="City" required onChange={change}/></Col>
          <Col md={3}><Form.Control name="propProv" placeholder="Province" required onChange={change}/></Col>
          <Col md={3}><Form.Control name="propPostal" placeholder="Postal code" required onChange={change}/></Col>
          <Col md={3}><Form.Control name="propValue" type="number" placeholder="Price / Value (CAD)" required onChange={change}/></Col>
          <Col md={3}><Form.Control name="downPayment" type="number" placeholder="Down-payment (CAD)" required onChange={change}/></Col>
          <Col md={3}>
            <Form.Select name="propType" required onChange={change}>
              <option value="">Property type</option>
              <option>Detached</option><option>Condo</option><option>Townhouse</option>
              <option>Multi-unit</option>
            </Form.Select>
          </Col>
          <Col md={3}>
            <Form.Select name="occupancy" required onChange={change}>
              <option value="">Occupancy</option>
              <option>Owner-occupied</option><option>Rental</option><option>Vacation</option>
            </Form.Select>
          </Col>
          <Col md={3}><Form.Control name="closeDate" type="date" placeholder="Expected close date" required onChange={change}/></Col>
        </Row>

        {/* EMPLOYMENT & INCOME */}
        <h5 className="mt-5">Employment & Income</h5>
        <Row className="g-3">
          <Col md={4}><Form.Control name="employer" placeholder="Employer" required onChange={change}/></Col>
          <Col md={4}><Form.Control name="jobTitle" placeholder="Job title" required onChange={change}/></Col>
          <Col md={4}><Form.Control name="startDate" type="date" placeholder="Employment start" required onChange={change}/></Col>
          <Col md={4}><Form.Control name="salary" type="number" placeholder="Annual salary (CAD)" required onChange={change}/></Col>
          <Col md={4}><Form.Control name="otherIncome" type="number" placeholder="Other yearly income" onChange={change}/></Col>
        </Row>

        {/* LOAN */}
        <h5 className="mt-5">Loan details</h5>
        <Row className="g-3">
          <Col md={4}><Form.Control name="loanAmount" type="number" placeholder="Requested loan amount" required onChange={change}/></Col>
          <Col md={3}><Form.Control name="term" type="number" placeholder="Term (years)" required onChange={change}/></Col>
          <Col md={3}>
            <Form.Select name="rateType" required onChange={change}>
              <option value="">Rate type</option>
              <option>Fixed</option><option>Variable</option>
            </Form.Select>
          </Col>
          <Col md={4}><Form.Control name="purpose" placeholder="Purpose (Purchase / Refi / HELOC)" required onChange={change}/></Col>
          <Col md={4}><Form.Control name="monthlyDebt" type="number" placeholder="Existing monthly debt" onChange={change}/></Col>
        </Row>

        {/* CONSENT */}
        <Form.Check className="mt-4"
          type="checkbox" name="consent" label="I certify information is accurate."
          checked={form.consent} onChange={change} required/>
        <Form.Check
          type="checkbox" name="privacy" label="I agree to the Privacy Policy."
          checked={form.privacy} onChange={change} required/>

        <Button className="mt-4" variant="primary" type="submit">Next</Button>
      </Form>
    </div>
  );
}
