// src/pages/loan/HomeLoanDocuments.jsx
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Form, Button, ProgressBar } from "react-bootstrap";

export default function HomeLoanDocuments() {
  const [params]=useSearchParams();
  const applicationId=params.get("app");
  const navigate=useNavigate();

  const [docs,setDocs]=useState({
    govID:null, purchaseAgmt:null, payStubs:null,
    bankStmt:null, appraisal:null, creditConsent:null
  });
  
  const [busy,setBusy]=useState(false);

  const file=(e,k)=>setDocs({...docs,[k]:e.target.files[0]});
  const ready=Object.values(docs).every(Boolean);

  const submit=async e=>{
    e.preventDefault();
    if(!ready) return alert("Upload every required doc.");
    setBusy(true);
    const data=new FormData();
    data.append('applicationId', applicationId);
    Object.entries(docs).forEach(([k,f])=>data.append(k,f));
    try{
      await fetch(`http://localhost:5000/api/documents/upload`,{method:"POST",body:data, credentials:"include"});
      navigate("/success");
    }catch(err){
      console.error(err); alert("Upload failed"); setBusy(false); return;
    }
  };

  const progress=Math.round((Object.values(docs).filter(Boolean).length/6)*100);

  return(
    <div className="container my-4">
      <h3 className="mb-3">Home Loan – Step 2: Documents & Amount</h3>

      <Form onSubmit={submit}>


        <h5 className="mt-3">Upload required documents</h5>
        <Doc label="Government photo ID"     onChange={e=>file(e,"govID")}          />
        <Doc label="Signed purchase agreement" onChange={e=>file(e,"purchaseAgmt")}/>
        <Doc label="Pay stubs / Employment letter" onChange={e=>file(e,"payStubs")} />
        <Doc label="Bank statements (3 months)" onChange={e=>file(e,"bankStmt")}    />
        <Doc label="Property appraisal report"  onChange={e=>file(e,"appraisal")}   />
        <Doc label="Credit-check consent form"  onChange={e=>file(e,"creditConsent")}/>

        <ProgressBar now={progress} className="my-3"/>
        <Button variant="primary" type="submit" disabled={busy}>
          {busy?"Uploading…":"Submit application"}
        </Button>
      </Form>
    </div>
  );
}

function Doc({label,onChange}){
  return(
    <Form.Group className="mb-3">
      <Form.Label>{label} <span className="text-danger">*</span></Form.Label>
      <Form.Control type="file" accept=".pdf,.jpg,.jpeg,.png" required onChange={onChange}/>
    </Form.Group>
  );
}
