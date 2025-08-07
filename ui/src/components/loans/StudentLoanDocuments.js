// src/pages/loan/StudentLoanDocuments.jsx
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Form, Button, ProgressBar } from "react-bootstrap";

export default function StudentLoanDocuments() {
  const [params]       = useSearchParams();
  const applicationId  = params.get("app");      // came from step-1
  const navigate       = useNavigate();

  /* four required docs */
  const [docs, setDocs] = useState({
    govID:          null,
    studentCard:    null,
    enrolment:      null,
    cosignerIncome: null,
  });
  
  const [busy, setBusy]  = useState(false);

  const handleFile = (e, key) => setDocs({ ...docs, [key]: e.target.files[0] });

  /* all four must be present */
  const ready =
    docs.govID && docs.studentCard && docs.enrolment && docs.cosignerIncome;

  const handleSubmit = async e => {
    e.preventDefault();
    if (!ready) return alert("Please upload every required document.");
    setBusy(true);

    /* multipart/form-data */
    const data = new FormData();
    data.append('applicationId', applicationId);
    Object.entries(docs).forEach(([k, file]) => data.append(k, file));

    try {
      await fetch(`http://localhost:5000/api/documents/upload`, {  
        method: "POST",
        body: data,
        credentials: "include",
      });
      navigate("/success");
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Upload failed – please try again.");
      setBusy(false);
      return;
    }
    
  };

  const uploaded = Object.values(docs).filter(Boolean).length;
  const progress  = Math.round((uploaded / 4) * 100);

  return (
    <div className="container my-4">
      <h3 className="mb-3">Student Loan – Step&nbsp;2: Documents & Amount</h3>

      <Form onSubmit={handleSubmit}>
 

        {/* file pickers */}
        <h5 className="mt-3">Upload required documents</h5>

        <DocInput label="Government photo ID"
                  onChange={e => handleFile(e,"govID")}          required />
        <DocInput label="Student ID card"
                  onChange={e => handleFile(e,"studentCard")}    required />
        <DocInput label="Current enrolment letter"
                  onChange={e => handleFile(e,"enrolment")}      required />
        <DocInput label="Co-signer income proof"
                  onChange={e => handleFile(e,"cosignerIncome")} required />

        <ProgressBar now={progress} className="my-3" />

        <Button variant="primary" type="submit" disabled={busy}>
          {busy ? "Uploading…" : "Submit application"}
        </Button>
      </Form>
    </div>
  );
}

/* helper for a single file input */
function DocInput({ label, required=false, onChange }) {
  return (
    <Form.Group className="mb-3">
      <Form.Label>{label} {required && <span className="text-danger">*</span>}</Form.Label>
      <Form.Control
        type="file"
        accept=".pdf,.jpg,.jpeg,.png"
        required={required}
        onChange={onChange}
      />
    </Form.Group>
  );
}
