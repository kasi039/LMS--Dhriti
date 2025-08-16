// src/pages/loan/CarLoanDetailsForm.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Row, Col, Button } from "react-bootstrap";

const reEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const rePhone10 = /^\d{10}$/;
const rePostalCA =
  /^[ABCEGHJ-NPRSTVXY]\d[ABCEGHJ-NPRSTV-Z][ -]?\d[ABCEGHJ-NPRSTV-Z]\d$/i;
const reVIN = /^[A-HJ-NPR-Z0-9]{17}$/i;

export default function CarLoanDetailsForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    /* personal */
    firstName: "",
    middleName: "",
    lastName: "",
    dob: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    province: "",
    postal: "",
    /* car */
    make: "",
    model: "",
    year: "",
    vin: "",
    purchasePrice: "",
    downPayment: "",
    dealer: "",
    /* loan */
    loanAmount: "",
    term: "",
    monthlyDebt: "",
    repaymentYears: "",
    /* consent */
    consent: false,
    privacy: false,
  });

  const [errs, setErrs] = useState({});

  const change = (e) => {
    const { name, value, type, checked } = e.target;
    const v = type === "checkbox" ? checked : value;
    setForm((prev) => ({ ...prev, [name]: v }));
  };

  const validate = () => {
    const e = {};
    // Personal
    if (!form.firstName.trim()) e.firstName = "First name is required.";
    if (!form.lastName.trim()) e.lastName = "Last name is required.";

    if (!form.dob) e.dob = "Date of birth is required.";
    else {
      const dob = new Date(form.dob);
      const today = new Date();
      if (dob > today) e.dob = "DOB cannot be in the future.";
      // age >= 18
      const age =
        today.getFullYear() -
        dob.getFullYear() -
        (today < new Date(today.getFullYear(), dob.getMonth(), dob.getDate())
          ? 1
          : 0);
      if (!e.dob && age < 18) e.dob = "Applicant must be at least 18 years old.";
    }

    if (!reEmail.test(form.email)) e.email = "Enter a valid email address.";

    const phoneDigits = String(form.phone || "").replace(/\D/g, "");
    if (!rePhone10.test(phoneDigits))
      e.phone = "Enter a 10-digit phone number.";

    if (!form.street.trim()) e.street = "Street address is required.";
    if (!form.city.trim()) e.city = "City is required.";
    if (!form.province.trim()) e.province = "Province is required.";
    if (!rePostalCA.test(form.postal || ""))
      e.postal = "Use a valid Canadian postal code (e.g., A1A 1A1).";

    // Vehicle
    if (!form.make.trim()) e.make = "Make is required.";
    if (!form.model.trim()) e.model = "Model is required.";
    const yearNum = Number(form.year);
    const currentYear = new Date().getFullYear();
    if (!yearNum) e.year = "Year is required.";
    else if (yearNum < 1980 || yearNum > currentYear + 1)
      e.year = `Year must be between 1980 and ${currentYear + 1}.`;

    if (!reVIN.test(form.vin || ""))
      e.vin = "VIN must be 17 characters (letters/numbers, no I/O/Q).";

    const price = Number(form.purchasePrice);
    if (!price || price <= 0)
      e.purchasePrice = "Enter purchase price greater than 0.";

    const dp = Number(form.downPayment);
    if (isNaN(dp) || dp < 0) e.downPayment = "Down-payment cannot be negative.";
    else if (!e.purchasePrice && dp > price)
      e.downPayment = "Down-payment cannot exceed purchase price.";

    if (!form.dealer.trim()) e.dealer = "Dealer name is required.";

    // Loan
    const loanAmt = Number(form.loanAmount);
    if (!loanAmt || loanAmt <= 0)
      e.loanAmount = "Enter a positive loan amount.";

    const termNum = Number(form.term);
    if (!termNum || termNum < 1 || termNum > 8)
      e.term = "Term must be between 1 and 8 years.";

    if (form.repaymentYears) {
      const rep = Number(form.repaymentYears);
      if (isNaN(rep) || rep < 1 || rep > 8)
        e.repaymentYears = "Repayment years must be 1–8.";
    }

    if (form.monthlyDebt) {
      const md = Number(form.monthlyDebt);
      if (isNaN(md) || md < 0)
        e.monthlyDebt = "Monthly debt cannot be negative.";
    }

    // Consent
    if (!form.consent) e.consent = "Please certify the information is accurate.";
    if (!form.privacy) e.privacy = "Please agree to the Privacy Policy.";

    setErrs(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const loanAmount = form.loanAmount;

    const details = { ...form };
    delete details.loanAmount;
    delete details.consent;
    delete details.privacy;

    try {
      const res = await fetch(
        "http://localhost:5000/api/applications/applyLoan",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            loanType: "car",
            amount: loanAmount,
            details: details,
          }),
          credentials: "include",
        }
      );
      if (!res.ok) {
        alert("Failed to submit application. Please try again later.");
        console.log("Error response:", res.status, res.statusText);
        return;
      }

      const data = await res.json();
      const applicationId = data.applicationId;

      if (!applicationId) {
        alert("Application ID missing from server response.");
        return;
      }
      alert("Application details saved successfully! Proceed to upload documents.");
      navigate(`/applyloan/docs/car?app=${applicationId}`);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container my-4">
      <h3 className="mb-3">Car Loan – Step 1: Details</h3>

      <Form noValidate onSubmit={submit}>
        {/* PERSONAL */}
        <h5>Personal information</h5>
        <Row className="g-3">
          <Col md={4}>
            <Form.Control
              name="firstName"
              placeholder="First name"
              required
              onChange={change}
              isInvalid={!!errs.firstName}
            />
            <Form.Control.Feedback type="invalid">
              {errs.firstName}
            </Form.Control.Feedback>
          </Col>
          <Col md={4}>
            <Form.Control
              name="middleName"
              placeholder="Middle name"
              onChange={change}
            />
          </Col>
          <Col md={4}>
            <Form.Control
              name="lastName"
              placeholder="Last name"
              required
              onChange={change}
              isInvalid={!!errs.lastName}
            />
            <Form.Control.Feedback type="invalid">
              {errs.lastName}
            </Form.Control.Feedback>
          </Col>

          <Col md={4}>
            <Form.Control
              name="dob"
              type="date"
              required
              onChange={change}
              isInvalid={!!errs.dob}
            />
            <Form.Control.Feedback type="invalid">
              {errs.dob}
            </Form.Control.Feedback>
          </Col>
          <Col md={4}>
            <Form.Control
              name="email"
              type="email"
              placeholder="Email"
              required
              onChange={change}
              isInvalid={!!errs.email}
            />
            <Form.Control.Feedback type="invalid">
              {errs.email}
            </Form.Control.Feedback>
          </Col>
          <Col md={4}>
            <Form.Control
              name="phone"
              placeholder="Mobile phone (10 digits)"
              required
              onChange={change}
              isInvalid={!!errs.phone}
            />
            <Form.Control.Feedback type="invalid">
              {errs.phone}
            </Form.Control.Feedback>
          </Col>

          <Col md={6}>
            <Form.Control
              name="street"
              placeholder="Street address"
              required
              onChange={change}
              isInvalid={!!errs.street}
            />
            <Form.Control.Feedback type="invalid">
              {errs.street}
            </Form.Control.Feedback>
          </Col>
          <Col md={3}>
            <Form.Control
              name="city"
              placeholder="City"
              required
              onChange={change}
              isInvalid={!!errs.city}
            />
            <Form.Control.Feedback type="invalid">
              {errs.city}
            </Form.Control.Feedback>
          </Col>
          <Col md={3}>
            <Form.Control
              name="province"
              placeholder="Province"
              required
              onChange={change}
              isInvalid={!!errs.province}
            />
            <Form.Control.Feedback type="invalid">
              {errs.province}
            </Form.Control.Feedback>
          </Col>
          <Col md={3}>
            <Form.Control
              name="postal"
              placeholder="Postal code"
              required
              onChange={change}
              isInvalid={!!errs.postal}
            />
            <Form.Control.Feedback type="invalid">
              {errs.postal}
            </Form.Control.Feedback>
          </Col>
        </Row>

        {/* CAR */}
        <h5 className="mt-5">Vehicle information</h5>
        <Row className="g-3">
          <Col md={3}>
            <Form.Control
              name="make"
              placeholder="Make"
              required
              onChange={change}
              isInvalid={!!errs.make}
            />
            <Form.Control.Feedback type="invalid">
              {errs.make}
            </Form.Control.Feedback>
          </Col>
          <Col md={3}>
            <Form.Control
              name="model"
              placeholder="Model"
              required
              onChange={change}
              isInvalid={!!errs.model}
            />
            <Form.Control.Feedback type="invalid">
              {errs.model}
            </Form.Control.Feedback>
          </Col>
          <Col md={2}>
            <Form.Control
              name="year"
              type="number"
              placeholder="Year"
              required
              onChange={change}
              isInvalid={!!errs.year}
            />
            <Form.Control.Feedback type="invalid">
              {errs.year}
            </Form.Control.Feedback>
          </Col>
          <Col md={4}>
            <Form.Control
              name="vin"
              placeholder="VIN (17 chars)"
              required
              onChange={change}
              isInvalid={!!errs.vin}
            />
            <Form.Control.Feedback type="invalid">
              {errs.vin}
            </Form.Control.Feedback>
          </Col>
          <Col md={4}>
            <Form.Control
              name="purchasePrice"
              type="number"
              placeholder="Purchase price (CAD)"
              required
              onChange={change}
              isInvalid={!!errs.purchasePrice}
            />
            <Form.Control.Feedback type="invalid">
              {errs.purchasePrice}
            </Form.Control.Feedback>
          </Col>
          <Col md={4}>
            <Form.Control
              name="downPayment"
              type="number"
              placeholder="Down-payment (CAD)"
              required
              onChange={change}
              isInvalid={!!errs.downPayment}
            />
            <Form.Control.Feedback type="invalid">
              {errs.downPayment}
            </Form.Control.Feedback>
          </Col>
          <Col md={4}>
            <Form.Control
              name="dealer"
              placeholder="Dealer name"
              required
              onChange={change}
              isInvalid={!!errs.dealer}
            />
            <Form.Control.Feedback type="invalid">
              {errs.dealer}
            </Form.Control.Feedback>
          </Col>
        </Row>

        {/* LOAN */}
        <h5 className="mt-5">Loan details</h5>
        <Row className="g-3">
          <Col md={4}>
            <Form.Control
              name="loanAmount"
              type="number"
              placeholder="Requested amount"
              required
              onChange={change}
              isInvalid={!!errs.loanAmount}
            />
            <Form.Control.Feedback type="invalid">
              {errs.loanAmount}
            </Form.Control.Feedback>
          </Col>
          <Col md={3}>
            <Form.Control
              name="term"
              type="number"
              placeholder="Term (years)"
              required
              onChange={change}
              isInvalid={!!errs.term}
            />
            <Form.Control.Feedback type="invalid">
              {errs.term}
            </Form.Control.Feedback>
          </Col>
          <Col md={3}>
            <Form.Control
              name="repaymentYears"
              type="number"
              placeholder="Preferred repayment years"
              onChange={change}
              isInvalid={!!errs.repaymentYears}
            />
            <Form.Control.Feedback type="invalid">
              {errs.repaymentYears}
            </Form.Control.Feedback>
          </Col>
          <Col md={4}>
            <Form.Control
              name="monthlyDebt"
              type="number"
              placeholder="Existing monthly debt"
              onChange={change}
              isInvalid={!!errs.monthlyDebt}
            />
            <Form.Control.Feedback type="invalid">
              {errs.monthlyDebt}
            </Form.Control.Feedback>
          </Col>
        </Row>

        {/* CONSENT */}
        <Form.Check
          className="mt-4"
          type="checkbox"
          name="consent"
          label="I certify the information is accurate."
          checked={form.consent}
          onChange={change}
          isInvalid={!!errs.consent}
          required
        />
        {errs.consent && (
          <div className="invalid-feedback d-block">{errs.consent}</div>
        )}

        <Form.Check
          type="checkbox"
          name="privacy"
          label="I agree to the Privacy Policy."
          checked={form.privacy}
          onChange={change}
          isInvalid={!!errs.privacy}
          required
        />
        {errs.privacy && (
          <div className="invalid-feedback d-block">{errs.privacy}</div>
        )}

        <Button className="mt-4" variant="primary" type="submit">
          Next
        </Button>
      </Form>
    </div>
  );
}
