// src/pages/loan/GoldLoanDocuments.jsx
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Form, Button, ProgressBar } from "react-bootstrap";

export default function GoldLoanDocuments() {
  const [params]=useSearchParams();
  const applicationIdId=params.get("app");
  const navigate=useNavigate();

  const [docs,setDocs]=useState({
    govID:null, goldPhotos:null, purityCert:null,
    incomeProof:null, creditConsent:null
  });
  
  const [busy,setBusy]=useState(false);

  const file=(e,k)=>setDocs({...docs,[k]:e.target.files[0]});
  const ready=Object.values(docs).every(Boolean);

  const submit=async e=>{
    e.preventDefault();
    if(!ready) return alert("Upload every required doc.");
    setBusy(true);

    const data=new FormData();
    data.append('applicationId', applicationIdId);
    Object.entries(docs).forEach(([k,f])=>data.append(k,f));

    try{
      await fetch(`http://localhost:5000/api/documents/upload`,{method:"POST",body:data, credentials:"include"});
      navigate("/success");
    }catch(err){
      console.error(err); alert("Upload failed"); setBusy(false); return;
    }
  };

  const progress=Math.round((Object.values(docs).filter(Boolean).length/5)*100);

  return(
    <div className="container my-4">
      <h3 className="mb-3">Gold Loan – Step 2: Documents & Amount</h3>

      <Form onSubmit={submit}>


        <h5 className="mt-3">Upload required documents</h5>
        <Doc label="Government photo ID"              onChange={e=>file(e,"govID")}         />
        <Doc label="Photos of gold items"             onChange={e=>file(e,"goldPhotos")}    />
        <Doc label="Gold purity certificate"          onChange={e=>file(e,"purityCert")}    />
        <Doc label="Income proof (pay stub / bank stmt)" onChange={e=>file(e,"incomeProof")}/>
        <Doc label="Credit-check consent form"        onChange={e=>file(e,"creditConsent")} />

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
