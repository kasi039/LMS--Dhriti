import {React, useEffect, useRef} from "react";
import { useSearchParams } from "react-router-dom";
import { ReactComponent as Successphoto } from '../assets/success.svg';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const applicationId = searchParams.get("applicationId");
  const navigate = useNavigate();
  const hasPostedRef = useRef(false);

  useEffect(() => {
    if (hasPostedRef.current) return;
    hasPostedRef.current = true;
    const postPayment = async () => {
    const res = await fetch(`http://localhost:5000/api/applications/getapplicationdetails/${applicationId}`, { credentials: "include" });
    const loan = await res.json();
    if (!loan) return;
    const repaymentMonths = 24;
    const totalWithInterest = loan.remainingAmount + (loan.remainingAmount * loan.interestRate / 100);
    const installmentAmount = Math.round(totalWithInterest / repaymentMonths);
        await fetch("http://localhost:5000/api/payments/createPayment",
            {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({applicationId, amount: installmentAmount, method: "stripe"}),
                credentials: 'include'
            }
        );
     
    };

    postPayment();
  },[applicationId]);

    return(
        <div className="admin-page-container">
            <h1 className="text-center success-head">Payment Successfull</h1>
            <div className="d-flex justify-content-center mt-5">
                <Successphoto className="success-img" />
            </div>
            
            
            <div className="d-flex justify-content-center mt-4">
                <Button variant="primary" className="bigButton" onClick={() => navigate("/")} >Go to Dashboard</Button>
            </div>
        </div>
    );
}
