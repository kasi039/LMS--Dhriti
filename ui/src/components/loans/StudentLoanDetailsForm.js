import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Form, Row, Col, Button } from "react-bootstrap";

export default function StudentLoanDetailsForm() {
  const [params] = useSearchParams();
  const navigate  = useNavigate();

  const [form, setForm] = useState({
    firstName: "", middleName: "", lastName: "",
    dob: "", email: "", phone: "",
    street: "", city: "", province: "", postalCode: "",
    institution: "", studentId: "", program: "",
    startDate: "", gradDate: "", yearOfStudy: "",
    gpa: "", loanAmount: "", tuition: "",
    otherFunding: "", repaymentYears: "",
    guardianName: "", guardianPhone: "", guardianIncome: "",
    consent: false, privacy: false,
  });

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!form.consent || !form.privacy) {
      alert("Please agree to the declarations to continue.");
      return;
    }

    const loanAmount = form.loanAmount;

    const details = {...form};
    delete details.loanAmount;
    delete details.consent;
    delete details.privacy;

    let applicationId ;
    try {
      const res = await fetch('http://localhost:5000/api/applications/applyLoan', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({loanType: "student", amount: loanAmount, details: details}),
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
      navigate(`/applyloan/docs/student?app=${applicationId}`);
    } catch (err) {
      console.error("Loan POST failed", err.message);
    }

    
  };

  return (
    <div className="container my-4">
      <h3 className="mb-3">Student Loan – Step&nbsp;1: Details</h3>

      <Form onSubmit={handleSubmit}>
        <h5 className="mt-4">Personal information</h5>
        <Row className="g-3">
          <Col md={4}><Form.Control name="firstName" placeholder="First name" required onChange={handleChange}/></Col>
          <Col md={4}><Form.Control name="middleName" placeholder="Middle name"  onChange={handleChange}/></Col>
          <Col md={4}><Form.Control name="lastName"  placeholder="Last name"   required onChange={handleChange}/></Col>
          <Col md={4}><Form.Control name="dob"  type="date" required onChange={handleChange}/></Col>
          <Col md={4}><Form.Control name="email" type="email" placeholder="Email" required onChange={handleChange}/></Col>
          <Col md={4}><Form.Control name="phone" placeholder="Mobile phone" required onChange={handleChange}/></Col>
          <Col md={6}><Form.Control name="street" placeholder="Street address" required onChange={handleChange}/></Col>
          <Col md={3}><Form.Control name="city" placeholder="City" required onChange={handleChange}/></Col>
          <Col md={3}><Form.Control name="province" placeholder="Province" required onChange={handleChange}/></Col>
          <Col md={3}><Form.Control name="postalCode" placeholder="Postal Code" required onChange={handleChange}/></Col>
        </Row>

        <h5 className="mt-5">Academic information</h5>
        <Row className="g-3">
          <Col md={6}><Form.Control name="institution" placeholder="Institution name" required onChange={handleChange}/></Col>
          <Col md={3}><Form.Control name="studentId" placeholder="Student ID" required onChange={handleChange}/></Col>
          <Col md={3}><Form.Control name="program" placeholder="Program / degree" required onChange={handleChange}/></Col>
          <Col md={3}><Form.Control name="startDate" type="date" placeholder="Program start" required onChange={handleChange}/></Col>
          <Col md={3}><Form.Control name="gradDate"  type="date" placeholder="Expected graduation" required onChange={handleChange}/></Col>
          <Col md={3}><Form.Control name="yearOfStudy" placeholder="Year of study (1-4)" required onChange={handleChange}/></Col>
          <Col md={3}><Form.Control name="gpa" placeholder="Current GPA" onChange={handleChange}/></Col>
        </Row>

        <h5 className="mt-5">Loan & financials</h5>
        <Row className="g-3">
          <Col md={4}><Form.Control name="loanAmount" type="number" placeholder="Requested amount (CAD)" required onChange={handleChange}/></Col>
          <Col md={4}><Form.Control name="tuition" type="number" placeholder="Annual tuition cost" required onChange={handleChange}/></Col>
          <Col md={4}><Form.Control name="otherFunding" type="number" placeholder="Other funding (scholarships, etc.)" onChange={handleChange}/></Col>
          <Col md={4}><Form.Control name="repaymentYears" type="number" placeholder="Preferred repayment years" onChange={handleChange}/></Col>
        </Row>

        <h5 className="mt-5">Co-signer / guardian (optional)</h5>
        <Row className="g-3">
          <Col md={4}><Form.Control name="guardianName" placeholder="Guardian full name" onChange={handleChange}/></Col>
          <Col md={4}><Form.Control name="guardianPhone" placeholder="Guardian phone" onChange={handleChange}/></Col>
          <Col md={4}><Form.Control name="guardianIncome" type="number" placeholder="Guardian annual income" onChange={handleChange}/></Col>
        </Row>

        <Form.Check className="mt-4"
          type="checkbox" name="consent"
          label="I certify that the information provided is accurate."
          checked={form.consent} onChange={handleChange} required />
        <Form.Check
          type="checkbox" name="privacy"
          label="I agree to the Privacy Policy."
          checked={form.privacy} onChange={handleChange} required />

        <Button variant="primary" type="submit" className="mt-4">
          Next
        </Button>
      </Form>
    </div>
  );
}
