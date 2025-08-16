import React from 'react';
import { useParams } from 'react-router-dom';
import {useState, useEffect} from "react";
import { Button } from 'react-bootstrap';
import HelpFab from './HelpFab'; 


function LoanPayment() {
    const {id: applicationId} = useParams();
    const [Loan, setLoan] = useState(null);


    useEffect(() => {
        fetch(`http://localhost:5000/api/applications/getapplicationdetails/${applicationId}`, {credentials: "include"})
        .then(res => res.json())
        .then(data => setLoan(data));
    },[applicationId]);

    if (!Loan) {
        return <p>Loading...</p>;
    }

    const repaymentMonths = 24; 
    const totalWithInterest = Loan.remainingAmount + (Loan.remainingAmount * Loan.interestRate / 100);
    const installmentAmount = Math.round(totalWithInterest / repaymentMonths);

    const payInstallment = async() => { 
        const amount = installmentAmount;
        const res = await fetch("http://localhost:5000/api/payments/create-TheStripe-Section",
            {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({applicationId, amount}),
            }
        );

        const data = await res.json();
        window.location.href = data.url;
    };

    return(
        <>
        <h1 className="headings text-center">Payment for application: {applicationId}</h1>
        <div className="pay-div mx-auto bg-light rounded mb-5 p-5 shadow">
            <div class="row w-100 justify-content-end g-3">
                <h4 className="text-center mb-5 fw-bold">Payment Details</h4>
                <div className="col-12">
                    <p className="fs-5 pay-text">Loan type: <strong>{Loan.loanType}</strong></p>
                </div>
                <div className="col-12">
                    <p className="fs-5 pay-text">Loan Amount: <strong className="text-success">${Loan.amount}</strong></p>
                </div>
                <div className="col-12">
                    <p className="fs-5 pay-text">Remaining Amount: <strong className="text-warning">${Loan.remainingAmount}</strong></p>
                </div>
                <div className="col-12">
                    <p className="fs-5 pay-text">Interest Rate: <strong>{Loan.interestRate}%</strong></p>
                </div>
                <div className="col-12">
                    <p className="fs-5 pay-text">Installment Amount: <strong>${installmentAmount}</strong></p>
                </div>
                <div className="col-12 d-flex justify-content-center">
                    {(Loan.remainingAmount === 0 ? <p className="text-success text-center fw-bold fs-6">You have Cleared all your dues!</p>:
                    <Button variant="success" onClick = {() => payInstallment() }>Pay Installment Now</Button>)}
                </div>
            </div>
        </div>
        <div style={{ padding: "2rem", textAlign: "center" }}>
                  {/* your existing UI */}
                  <HelpFab /> {/* ← floating button */}
                </div>
        <div>
        </div>
        
        </>
    )    
}

export default LoanPayment;