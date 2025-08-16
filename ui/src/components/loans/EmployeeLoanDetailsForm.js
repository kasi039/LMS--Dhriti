// src/pages/loan/EmployeeLoanDetailsForm.jsx
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Row, Col, Button } from "react-bootstrap";

const emailRe   = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const nameRe    = /^[A-Za-z][A-Za-z\s'.-]{1,49}$/; // 2–50, letters/spaces/'/.- allowed
const phoneDigitsRe = /^\d{10}$/;                   // 10 digits (strip non-digits first)
const postalCARe = /^[A-Za-z]\d[A-Za-z][ ]?\d[A-Za-z]\d$/; // A1A 1A1 (space optional)

function ageFrom(d) {
  const dob = new Date(d);
  if (isNaN(dob)) return -1;
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
  return age;
}

function notFuture(dateStr) {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  const today = new Date();
  d.setHours(0,0,0,0);
  today.setHours(0,0,0,0);
  return d <= today;
}

function toNumber(val) {
  if (val === "" || val === null || typeof val === "undefined") return null;
  const n = Number(val);
  return Number.isFinite(n) ? n : null;
}

export default function EmployeeLoanDetailsForm() {
  const navigate = useNavigate();
  const firstInvalidRef = useRef(null);

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

  const [errors, setErrors]   = useState({});
  const [touched, setTouched] = useState({});

  const setField = (name, value) => {
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setField(name, type==="checkbox" ? checked : value);
  };

  const handleBlur = e => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    const nextErrors = validate({ ...form });
    setErrors(nextErrors);
  };

  const validate = (f) => {
    const errs = {};

    // PERSONAL
    if (!f.firstName || !nameRe.test(f.firstName.trim()))
      errs.firstName = "Enter a valid first name (2–50 letters).";

    if (f.middleName && !/^[A-Za-z\s'.-]{1,50}$/.test(f.middleName.trim()))
      errs.middleName = "Middle name can include letters, spaces, ' . -";

    if (!f.lastName || !nameRe.test(f.lastName.trim()))
      errs.lastName = "Enter a valid last name (2–50 letters).";

    if (!f.dob) errs.dob = "Date of birth is required.";
    else if (ageFrom(f.dob) < 18) errs.dob = "You must be at least 18 years old.";

    if (!f.email || !emailRe.test(f.email.trim()))
      errs.email = "Enter a valid email.";

    const justDigits = String(f.phone || "").replace(/\D/g, "");
    if (!phoneDigitsRe.test(justDigits))
      errs.phone = "Enter a 10-digit phone number.";

    if (!f.street || f.street.trim().length < 5)
      errs.street = "Enter a valid street address.";

    if (!f.city || !/^[A-Za-z\s'.-]{2,50}$/.test(f.city.trim()))
      errs.city = "Enter a valid city.";

    if (!f.province || f.province.trim().length < 2)
      errs.province = "Province is required.";

    if (!f.postalCode || !postalCARe.test(f.postalCode.trim()))
      errs.postalCode = "Enter a valid Canadian postal code (e.g., K1A 0B1).";

    // EMPLOYMENT
    if (!f.employer || f.employer.trim().length < 2)
      errs.employer = "Employer name is required.";

    if (!f.employerAddress || f.employerAddress.trim().length < 5)
      errs.employerAddress = "Employer address is required.";

    if (!f.jobTitle || f.jobTitle.trim().length < 2)
      errs.jobTitle = "Job title is required.";

    if (!f.employmentType)
      errs.employmentType = "Select employment type.";

    if (!f.startDate) errs.startDate = "Start date is required.";
    else if (!notFuture(f.startDate)) errs.startDate = "Start date cannot be in the future.";

    const salary = toNumber(f.salary);
    if (salary === null) errs.salary = "Enter your annual salary.";
    else if (salary < 1000 || salary > 1000000) errs.salary = "Salary must be between 1,000 and 1,000,000.";

    if (!f.payFreq) errs.payFreq = "Select pay frequency.";

    // FINANCIAL
    const loanAmount = toNumber(f.loanAmount);
    if (loanAmount === null || loanAmount <= 0) errs.loanAmount = "Enter a positive requested amount.";

    const housingCost = f.housingCost === "" ? 0 : toNumber(f.housingCost);
    if (housingCost === null || housingCost < 0) errs.housingCost = "Enter a valid monthly housing cost (>= 0).";

    const monthlyDebt = f.monthlyDebt === "" ? 0 : toNumber(f.monthlyDebt);
    if (monthlyDebt === null || monthlyDebt < 0) errs.monthlyDebt = "Enter a valid monthly debt (>= 0).";

    const repaymentYears = toNumber(f.repaymentYears);
    if (repaymentYears === null || repaymentYears < 1 || repaymentYears > 30)
      errs.repaymentYears = "Repayment years must be between 1 and 30.";

    // CONSENT
    if (!f.consent) errs.consent = "You must certify the information is accurate.";
    if (!f.privacy) errs.privacy = "You must agree to the Privacy Policy.";

    return errs;
  };

  const focusFirstInvalid = (errs) => {
    // Match keys to input names; focus the first with an error
    const order = [
      "firstName","middleName","lastName","dob","email","phone","street","city","province","postalCode",
      "employer","employerAddress","jobTitle","employmentType","startDate","salary","payFreq",
      "loanAmount","housingCost","monthlyDebt","repaymentYears","consent","privacy"
    ];
    for (const key of order) {
      if (errs[key]) {
        const el = document.querySelector(`[name="${key}"]`);
        if (el && typeof el.focus === "function") el.focus();
        break;
      }
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const nextErrors = validate(form);
    setErrors(nextErrors);
    setTouched(Object.fromEntries(Object.keys(form).map(k => [k, true])));
    if (Object.keys(nextErrors).length) {
      focusFirstInvalid(nextErrors);
      return;
    }

    const loanAmount = form.loanAmount;
    const details = { ...form };
    delete details.loanAmount;
    delete details.consent;
    delete details.privacy;

    try {
      const res = await fetch('http://localhost:5000/api/applications/applyLoan', {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body:JSON.stringify({ loanType:"employee", amount:loanAmount, details }),
        credentials: "include"
      });

      if (!res.ok) {
        console.log("Error response:", res.status, res.statusText);
        alert("Failed to submit application. Please try again later.");
        return;
      }

      const data = await res.json();
      const applicationId = data?.applicationId;
      if (!applicationId) {
        alert("Application ID missing from server response.");
        return;
      }

      alert("Application submitted successfully! Proceed to upload documents.");
      navigate(`/applyloan/docs/employee?app=${applicationId}`);
    } catch (err) {
      console.error("Loan POST failed", err);
      alert("Network error. Please try again.");
    }
  };

  const show = (name) => touched[name] && errors[name];

  return (
    <div className="container my-4">
      <h3 className="mb-3">Employee Loan – Step 1: Details</h3>

      <Form noValidate onSubmit={handleSubmit}>
        {/* PERSONAL */}
        <h5>Personal information</h5>
        <Row className="g-3">
          <Col md={4}>
            <Form.Control
              name="firstName" placeholder="First name" required
              value={form.firstName} onChange={handleChange} onBlur={handleBlur}
              isInvalid={!!show("firstName")} />
            <Form.Control.Feedback type="invalid">{errors.firstName}</Form.Control.Feedback>
          </Col>

          <Col md={4}>
            <Form.Control
              name="middleName" placeholder="Middle name"
              value={form.middleName} onChange={handleChange} onBlur={handleBlur}
              isInvalid={!!show("middleName")} />
            <Form.Control.Feedback type="invalid">{errors.middleName}</Form.Control.Feedback>
          </Col>

          <Col md={4}>
            <Form.Control
              name="lastName" placeholder="Last name" required
              value={form.lastName} onChange={handleChange} onBlur={handleBlur}
              isInvalid={!!show("lastName")} />
            <Form.Control.Feedback type="invalid">{errors.lastName}</Form.Control.Feedback>
          </Col>

          <Col md={4}>
            <Form.Control
              name="dob" type="date" required
              value={form.dob} onChange={handleChange} onBlur={handleBlur}
              isInvalid={!!show("dob")} />
            <Form.Control.Feedback type="invalid">{errors.dob}</Form.Control.Feedback>
          </Col>

          <Col md={4}>
            <Form.Control
              name="email" type="email" placeholder="Email" required
              value={form.email} onChange={handleChange} onBlur={handleBlur}
              isInvalid={!!show("email")} />
            <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
          </Col>

          <Col md={4}>
            <Form.Control
              name="phone" placeholder="Mobile phone" required
              value={form.phone} onChange={handleChange} onBlur={handleBlur}
              isInvalid={!!show("phone")} />
            <Form.Text muted>10 digits (numbers only)</Form.Text>
            <Form.Control.Feedback type="invalid">{errors.phone}</Form.Control.Feedback>
          </Col>

          <Col md={6}>
            <Form.Control
              name="street" placeholder="Street address" required
              value={form.street} onChange={handleChange} onBlur={handleBlur}
              isInvalid={!!show("street")} />
            <Form.Control.Feedback type="invalid">{errors.street}</Form.Control.Feedback>
          </Col>

          <Col md={3}>
            <Form.Control
              name="city" placeholder="City" required
              value={form.city} onChange={handleChange} onBlur={handleBlur}
              isInvalid={!!show("city")} />
            <Form.Control.Feedback type="invalid">{errors.city}</Form.Control.Feedback>
          </Col>

          <Col md={3}>
            <Form.Control
              name="province" placeholder="Province" required
              value={form.province} onChange={handleChange} onBlur={handleBlur}
              isInvalid={!!show("province")} />
            <Form.Control.Feedback type="invalid">{errors.province}</Form.Control.Feedback>
          </Col>

          <Col md={3}>
            <Form.Control
              name="postalCode" placeholder="Postal Code" required
              value={form.postalCode} onChange={handleChange} onBlur={handleBlur}
              isInvalid={!!show("postalCode")} />
            <Form.Text muted>Format: A1A 1A1</Form.Text>
            <Form.Control.Feedback type="invalid">{errors.postalCode}</Form.Control.Feedback>
          </Col>
        </Row>

        {/* EMPLOYMENT */}
        <h5 className="mt-5">Employment information</h5>
        <Row className="g-3">
          <Col md={6}>
            <Form.Control
              name="employer" placeholder="Employer name" required
              value={form.employer} onChange={handleChange} onBlur={handleBlur}
              isInvalid={!!show("employer")} />
            <Form.Control.Feedback type="invalid">{errors.employer}</Form.Control.Feedback>
          </Col>

          <Col md={6}>
            <Form.Control
              name="employerAddress" placeholder="Employer address" required
              value={form.employerAddress} onChange={handleChange} onBlur={handleBlur}
              isInvalid={!!show("employerAddress")} />
            <Form.Control.Feedback type="invalid">{errors.employerAddress}</Form.Control.Feedback>
          </Col>

          <Col md={4}>
            <Form.Control
              name="jobTitle" placeholder="Job title" required
              value={form.jobTitle} onChange={handleChange} onBlur={handleBlur}
              isInvalid={!!show("jobTitle")} />
            <Form.Control.Feedback type="invalid">{errors.jobTitle}</Form.Control.Feedback>
          </Col>

          <Col md={4}>
            <Form.Select
              name="employmentType" required
              value={form.employmentType} onChange={handleChange} onBlur={handleBlur}
              isInvalid={!!show("employmentType")}>
              <option value="">Employment type</option>
              <option>Full-time</option>
              <option>Part-time</option>
              <option>Contract</option>
            </Form.Select>
            <Form.Control.Feedback type="invalid">{errors.employmentType}</Form.Control.Feedback>
          </Col>

          <Col md={4}>
            <Form.Control
              name="startDate" type="date" placeholder="Start date" required
              value={form.startDate} onChange={handleChange} onBlur={handleBlur}
              isInvalid={!!show("startDate")} />
            <Form.Control.Feedback type="invalid">{errors.startDate}</Form.Control.Feedback>
          </Col>

          <Col md={4}>
            <Form.Control
              name="salary" type="number" placeholder="Annual salary (CAD)" required
              value={form.salary} onChange={handleChange} onBlur={handleBlur}
              isInvalid={!!show("salary")} />
            <Form.Text muted>Between 1,000 and 1,000,000</Form.Text>
            <Form.Control.Feedback type="invalid">{errors.salary}</Form.Control.Feedback>
          </Col>

          <Col md={4}>
            <Form.Select
              name="payFreq" required
              value={form.payFreq} onChange={handleChange} onBlur={handleBlur}
              isInvalid={!!show("payFreq")}>
              <option value="">Pay frequency</option>
              <option>Weekly</option>
              <option>Bi-weekly</option>
              <option>Monthly</option>
            </Form.Select>
            <Form.Control.Feedback type="invalid">{errors.payFreq}</Form.Control.Feedback>
          </Col>
        </Row>

        {/* FINANCIAL */}
        <h5 className="mt-5">Loan & financials</h5>
        <Row className="g-3">
          <Col md={4}>
            <Form.Control
              name="loanAmount" type="number" placeholder="Requested amount" required
              value={form.loanAmount} onChange={handleChange} onBlur={handleBlur}
              isInvalid={!!show("loanAmount")} />
            <Form.Control.Feedback type="invalid">{errors.loanAmount}</Form.Control.Feedback>
          </Col>

          <Col md={4}>
            <Form.Control
              name="housingCost" type="number" placeholder="Monthly housing cost"
              value={form.housingCost} onChange={handleChange} onBlur={handleBlur}
              isInvalid={!!show("housingCost")} />
            <Form.Control.Feedback type="invalid">{errors.housingCost}</Form.Control.Feedback>
          </Col>

          <Col md={4}>
            <Form.Control
              name="monthlyDebt" type="number" placeholder="Other monthly debt payments"
              value={form.monthlyDebt} onChange={handleChange} onBlur={handleBlur}
              isInvalid={!!show("monthlyDebt")} />
            <Form.Control.Feedback type="invalid">{errors.monthlyDebt}</Form.Control.Feedback>
          </Col>

          <Col md={4}>
            <Form.Control
              name="repaymentYears" type="number" placeholder="Repayment years"
              value={form.repaymentYears} onChange={handleChange} onBlur={handleBlur}
              isInvalid={!!show("repaymentYears")} />
            <Form.Text muted>1–30 years</Form.Text>
            <Form.Control.Feedback type="invalid">{errors.repaymentYears}</Form.Control.Feedback>
          </Col>
        </Row>

        {/* CONSENT */}
        <Form.Check className="mt-4"
          type="checkbox" name="consent"  label="I certify the information is accurate."
          checked={form.consent}  onChange={handleChange} onBlur={handleBlur}
          isInvalid={!!show("consent")} />
        {show("consent") && <div className="invalid-feedback d-block">{errors.consent}</div>}

        <Form.Check
          type="checkbox" name="privacy"  label="I agree to the Privacy Policy."
          checked={form.privacy} onChange={handleChange} onBlur={handleBlur}
          isInvalid={!!show("privacy")} />
        {show("privacy") && <div className="invalid-feedback d-block">{errors.privacy}</div>}

        <Button className="mt-4" variant="primary" type="submit">Next</Button>
      </Form>
    </div>
  );
}
