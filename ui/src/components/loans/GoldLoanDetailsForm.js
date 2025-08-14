// src/pages/loan/GoldLoanDetailsForm.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Row, Col, Button } from "react-bootstrap";

export default function GoldLoanDetailsForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    /* personal */
    firstName:"", middleName:"", lastName:"", dob:"", email:"", phone:"",
    street:"", city:"", province:"", postal:"",
    /* gold details */
    goldWeight:"", goldPurity:"", goldType:"Jewellery", appraisalValue:"",
    /* loan */
    loanAmount:"", tenureMonths:"", repaymentMode:"Monthly",
    /* consent */
    consent:false, privacy:false,
  });

  const change = e=>{
    const {name,value,type,checked}=e.target;
    setForm({...form,[name]:type==="checkbox"?checked:value});
  };

  const submit = async e => {
    e.preventDefault();
    if(!form.consent||!form.privacy) return alert("Tick both declarations.");

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
        body:JSON.stringify({loanType:"gold", amount:loanAmount, details:details}),
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
      navigate(`/applyloan/docs/gold?app=${applicationId}`);
    } 
    catch (err) {
      console.error("Loan POST failed", err.message);
    }
  };

  return (
    <div className="container my-4">
      <h3 className="mb-3">Gold Loan – Step 1: Details</h3>

      <Form onSubmit={submit}>
        {/* PERSONAL */}
        <h5>Personal information</h5>
        <Row className="g-3">
          <Col md={4}><Form.Control name="firstName"  placeholder="First name"  required onChange={change}/></Col>
          <Col md={4}><Form.Control name="middleName" placeholder="Middle name"          onChange={change}/></Col>
          <Col md={4}><Form.Control name="lastName"   placeholder="Last name"   required onChange={change}/></Col>
          <Col md={4}><Form.Control name="dob" type="date" required onChange={change}/></Col>
          <Col md={4}><Form.Control name="email" type="email" placeholder="Email" required onChange={change}/></Col>
          <Col md={4}><Form.Control name="phone" placeholder="Mobile phone" required onChange={change}/></Col>
          <Col md={6}><Form.Control name="street" placeholder="Street address" required onChange={change}/></Col>
          <Col md={3}><Form.Control name="city" placeholder="City" required onChange={change}/></Col>
          <Col md={3}><Form.Control name="province" placeholder="Province" required onChange={change}/></Col>
          <Col md={3}><Form.Control name="postal" placeholder="Postal code" required onChange={change}/></Col>
        </Row>

        {/* GOLD */}
        <h5 className="mt-5">Gold details</h5>
        <Row className="g-3">
          <Col md={3}><Form.Control name="goldWeight" type="number" placeholder="Gold weight (grams)" required onChange={change}/></Col>
          <Col md={3}><Form.Control name="goldPurity" placeholder="Purity (e.g. 22K)" required onChange={change}/></Col>
          <Col md={3}>
            <Form.Select name="goldType" value={form.goldType} onChange={change}>
              <option value="Jewellery">Jewellery</option>
              <option value="Coins/Bars">Coins/Bars</option>
            </Form.Select>
          </Col>
          <Col md={3}><Form.Control name="appraisalValue" type="number" placeholder="Appraisal value (CAD)" required onChange={change}/></Col>
        </Row>

        {/* LOAN */}
        <h5 className="mt-5">Loan details</h5>
        <Row className="g-3">
          <Col md={3}><Form.Control name="loanAmount" type="number" placeholder="Requested amount" required onChange={change}/></Col>
          <Col md={3}><Form.Control name="tenureMonths" type="number" placeholder="Tenure (months)" required onChange={change}/></Col>
          <Col md={3}>
            <Form.Select name="repaymentMode" value={form.repaymentMode} onChange={change}>
              <option value="Monthly">Monthly</option>
              <option value="Quarterly">Quarterly</option>
              <option value="Bullet">Bullet</option>
            </Form.Select>
          </Col>
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
