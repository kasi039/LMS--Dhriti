import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Row, Col, Button } from "react-bootstrap";

const reEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const rePhone10 = /^\d{10}$/;
const rePostalCA = /^[ABCEGHJ-NPRSTVXY]\d[ABCEGHJ-NPRSTV-Z][ -]?\d[ABCEGHJ-NPRSTV-Z]\d$/i;

export default function BusinessLoanDetailsForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    ownerFirstName:"", ownerLastName:"", ownerEmail:"", ownerPhone:"",
    businessName:"", tradeName:"", regNumber:"", street:"", city:"", province:"", postalCode:"",
    startDate:"", industry:"", employees:"", revenue:"",
    loanAmount:"", purpose:"", monthlyDebt:"", repaymentYears:"",
    consent:false, privacy:false,
  });
  const [errs, setErrs] = useState({});

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type==="checkbox" ? checked : value });
  };

  const validate = () => {
    const e = {};
    // owner
    if (!form.ownerFirstName.trim()) e.ownerFirstName = "First name is required.";
    if (!form.ownerLastName.trim()) e.ownerLastName = "Last name is required.";
    if (!reEmail.test(form.ownerEmail)) e.ownerEmail = "Enter a valid email.";
    if (!rePhone10.test(String(form.ownerPhone).replace(/\D/g, ""))) e.ownerPhone = "Enter a 10-digit phone number.";

    // business
    if (!form.businessName.trim()) e.businessName = "Legal business name is required.";
    if (!form.regNumber.trim()) e.regNumber = "Registration / Incorporation # is required.";
    if (!form.industry.trim()) e.industry = "Industry is required.";
    if (!form.startDate) e.startDate = "Start date is required.";
    else if (new Date(form.startDate) > new Date()) e.startDate = "Start date cannot be in the future.";
    if (!form.employees || Number(form.employees) < 1) e.employees = "Employees must be at least 1.";
    if (!form.revenue || Number(form.revenue) <= 0) e.revenue = "Enter annual revenue (> 0).";
    if (!form.street.trim()) e.street = "Street address is required.";
    if (!form.city.trim()) e.city = "City is required.";
    if (!form.province.trim()) e.province = "Province is required.";
    if (!rePostalCA.test(form.postalCode || "")) e.postalCode = "Enter a valid Canadian postal code (e.g., A1A 1A1).";

    // loan
    if (!form.loanAmount || Number(form.loanAmount) <= 0) e.loanAmount = "Enter a positive amount.";
    if (!form.purpose.trim()) e.purpose = "Loan purpose is required.";
    if (form.monthlyDebt && Number(form.monthlyDebt) < 0) e.monthlyDebt = "Monthly debt cannot be negative.";
    if (form.repaymentYears && (Number(form.repaymentYears) < 1 || Number(form.repaymentYears) > 15)) {
      e.repaymentYears = "Repayment years must be between 1 and 15.";
    }

    // consent
    if (!form.consent) e.consent = "Please certify accuracy.";
    if (!form.privacy) e.privacy = "Please agree to the Privacy Policy.";
    setErrs(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!validate()) return;

    const loanAmount = form.loanAmount;
    const details = { ...form };
    delete details.loanAmount; delete details.consent; delete details.privacy;

    try {
      const res = await fetch('http://localhost:5000/api/applications/applyLoan', {
        method:"POST", headers:{ "Content-Type":"application/json" },
        body:JSON.stringify({ loanType:"business", amount:loanAmount, details }),
        credentials: "include"
      });
      if (!res.ok) {
        alert("Failed to submit application. Please try again later.");
        console.log("Error response:", res.status, res.statusText);
        return;
      }
      const data = await res.json();
      const applicationId = data.applicationId;
      if (!applicationId) { alert("Application ID missing from server response."); return; }
      alert("Application submitted successfully! Proceed to upload documents.");
      navigate(`/applyloan/docs/business?app=${applicationId}`);
    } catch (err) {
      console.error("Loan POST failed", err.message);
    }
  };

  return (
    <div className="container my-4">
      <h3 className="mb-3">Business Loan – Step&nbsp;1: Details</h3>

      <Form noValidate onSubmit={handleSubmit}>
        <h5>Owner information</h5>
        <Row className="g-3">
          <Col md={4}>
            <Form.Control name="ownerFirstName" placeholder="First name" required onChange={handleChange}
              isInvalid={!!errs.ownerFirstName}/>
            <Form.Control.Feedback type="invalid">{errs.ownerFirstName}</Form.Control.Feedback>
          </Col>
          <Col md={4}>
            <Form.Control name="ownerLastName" placeholder="Last name" required onChange={handleChange}
              isInvalid={!!errs.ownerLastName}/>
            <Form.Control.Feedback type="invalid">{errs.ownerLastName}</Form.Control.Feedback>
          </Col>
          <Col md={4}>
            <Form.Control name="ownerEmail" type="email" placeholder="Email" required onChange={handleChange}
              isInvalid={!!errs.ownerEmail}/>
            <Form.Control.Feedback type="invalid">{errs.ownerEmail}</Form.Control.Feedback>
          </Col>
          <Col md={4}>
            <Form.Control name="ownerPhone" placeholder="Phone (10 digits)" required onChange={handleChange}
              isInvalid={!!errs.ownerPhone}/>
            <Form.Control.Feedback type="invalid">{errs.ownerPhone}</Form.Control.Feedback>
          </Col>
        </Row>

        <h5 className="mt-5">Business information</h5>
        <Row className="g-3">
          <Col md={6}>
            <Form.Control name="businessName" placeholder="Legal business name" required onChange={handleChange}
              isInvalid={!!errs.businessName}/>
            <Form.Control.Feedback type="invalid">{errs.businessName}</Form.Control.Feedback>
          </Col>
          <Col md={6}>
            <Form.Control name="tradeName" placeholder="Trade / operating name" onChange={handleChange}/>
          </Col>
          <Col md={4}>
            <Form.Control name="regNumber" placeholder="Registration / Incorporation #" required onChange={handleChange}
              isInvalid={!!errs.regNumber}/>
            <Form.Control.Feedback type="invalid">{errs.regNumber}</Form.Control.Feedback>
          </Col>
          <Col md={4}>
            <Form.Control name="industry" placeholder="Industry" required onChange={handleChange}
              isInvalid={!!errs.industry}/>
            <Form.Control.Feedback type="invalid">{errs.industry}</Form.Control.Feedback>
          </Col>
          <Col md={4}>
            <Form.Control name="startDate" type="date" placeholder="Business start date" required onChange={handleChange}
              isInvalid={!!errs.startDate}/>
            <Form.Control.Feedback type="invalid">{errs.startDate}</Form.Control.Feedback>
          </Col>
          <Col md={3}>
            <Form.Control name="employees" type="number" placeholder="# Employees" required onChange={handleChange}
              isInvalid={!!errs.employees}/>
            <Form.Control.Feedback type="invalid">{errs.employees}</Form.Control.Feedback>
          </Col>
          <Col md={3}>
            <Form.Control name="revenue" type="number" placeholder="Annual revenue (CAD)" required onChange={handleChange}
              isInvalid={!!errs.revenue}/>
            <Form.Control.Feedback type="invalid">{errs.revenue}</Form.Control.Feedback>
          </Col>
          <Col md={6}>
            <Form.Control name="street" placeholder="Business street address" required onChange={handleChange}
              isInvalid={!!errs.street}/>
            <Form.Control.Feedback type="invalid">{errs.street}</Form.Control.Feedback>
          </Col>
          <Col md={3}>
            <Form.Control name="city" placeholder="City" required onChange={handleChange}
              isInvalid={!!errs.city}/>
            <Form.Control.Feedback type="invalid">{errs.city}</Form.Control.Feedback>
          </Col>
          <Col md={3}>
            <Form.Control name="province" placeholder="Province" required onChange={handleChange}
              isInvalid={!!errs.province}/>
            <Form.Control.Feedback type="invalid">{errs.province}</Form.Control.Feedback>
          </Col>
          <Col md={3}>
            <Form.Control name="postalCode" placeholder="Postal Code" required onChange={handleChange}
              isInvalid={!!errs.postalCode}/>
            <Form.Control.Feedback type="invalid">{errs.postalCode}</Form.Control.Feedback>
          </Col>
        </Row>

        <h5 className="mt-5">Loan details</h5>
        <Row className="g-3">
          <Col md={4}>
            <Form.Control name="loanAmount" type="number" placeholder="Requested amount" required onChange={handleChange}
              isInvalid={!!errs.loanAmount}/>
            <Form.Control.Feedback type="invalid">{errs.loanAmount}</Form.Control.Feedback>
          </Col>
          <Col md={6}>
            <Form.Control name="purpose" placeholder="Purpose of funds" required onChange={handleChange}
              isInvalid={!!errs.purpose}/>
            <Form.Control.Feedback type="invalid">{errs.purpose}</Form.Control.Feedback>
          </Col>
          <Col md={4}>
            <Form.Control name="monthlyDebt" type="number" placeholder="Existing monthly debt payments" onChange={handleChange}
              isInvalid={!!errs.monthlyDebt}/>
            <Form.Control.Feedback type="invalid">{errs.monthlyDebt}</Form.Control.Feedback>
          </Col>
          <Col md={4}>
            <Form.Control name="repaymentYears" type="number" placeholder="Repayment years" onChange={handleChange}
              isInvalid={!!errs.repaymentYears}/>
            <Form.Control.Feedback type="invalid">{errs.repaymentYears}</Form.Control.Feedback>
          </Col>
        </Row>

        <Form.Check className="mt-4"
          type="checkbox" name="consent" label="I certify the information is accurate."
          checked={form.consent} onChange={handleChange} required
          isInvalid={!!errs.consent}/>
        <Form.Control.Feedback type="invalid" className="d-block">{errs.consent}</Form.Control.Feedback>

        <Form.Check
          type="checkbox" name="privacy" label="I agree to the Privacy Policy."
          checked={form.privacy} onChange={handleChange} required
          isInvalid={!!errs.privacy}/>
        <Form.Control.Feedback type="invalid" className="d-block">{errs.privacy}</Form.Control.Feedback>

        <Button className="mt-4" variant="primary" type="submit">Next</Button>
      </Form>
    </div>
  );
}
