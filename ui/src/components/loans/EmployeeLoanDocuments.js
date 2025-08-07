// src/pages/loan/EmployeeLoanDocuments.jsx
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Form, Button, ProgressBar } from "react-bootstrap";

export default function EmployeeLoanDocuments() {
  const [params]      = useSearchParams();
  const applicationId  = params.get("app");
  const navigate      = useNavigate();

  const [docs, setDocs] = useState({
    govID:null, employmentProof:null, bankStmt:null,
    voidCheque:null, creditConsent:null
  });
  
  const [busy, setBusy] = useState(false);

  const handleFile = (e,k)=> setDocs({ ...docs, [k]:e.target.files[0] });
  const ready = Object.values(docs).every(Boolean);

  const handleSubmit = async e=>{
    e.preventDefault();
    if(!ready) return alert("Upload every required document.");
    setBusy(true);

    const data = new FormData();
    data.append('applicationId', applicationId);
    Object.entries(docs).forEach(([k,f])=>data.append(k,f));

    try{
      await fetch(`http://localhost:5000/api/documents/upload`,{method:"POST",body:data, credentials:"include"});
      navigate("/success");
    }catch(err){
      console.error(err); alert("Upload failed"); setBusy(false); return;
    }
  };

  const progress = Math.round((Object.values(docs).filter(Boolean).length/5)*100);

  return (
    <div className="container my-4">
      <h3 className="mb-3">Employee Loan – Step 2: Documents & Amount</h3>

      <Form onSubmit={handleSubmit}>


        <h5 className="mt-3">Upload required documents</h5>
        <DocInput label="Government photo ID"
          onChange={e=>handleFile(e,"govID")}          required/>
        <DocInput label="Employment letter / Pay stub"
          onChange={e=>handleFile(e,"employmentProof")} required/>
        <DocInput label="Bank statement (last 90 days)"
          onChange={e=>handleFile(e,"bankStmt")}       required/>
        <DocInput label="Void cheque / Direct-deposit form"
          onChange={e=>handleFile(e,"voidCheque")}     required/>
        <DocInput label="Credit-check consent form"
          onChange={e=>handleFile(e,"creditConsent")}  required/>

        <ProgressBar now={progress} className="my-3"/>
        <Button variant="primary" type="submit" disabled={busy}>
          {busy ? "Uploading…" : "Submit application"}
        </Button>
      </Form>
    </div>
  );
}

function DocInput({label,required=false,onChange}){
  return(
    <Form.Group className="mb-3">
      <Form.Label>{label} {required && <span className="text-danger">*</span>}</Form.Label>
      <Form.Control type="file" accept=".pdf,.jpg,.jpeg,.png"
        required={required} onChange={onChange}/>
    </Form.Group>
  );
}
