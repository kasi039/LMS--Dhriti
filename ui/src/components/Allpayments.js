import React from "react";
import { useState, useEffect } from "react";


function Allpayments() {
    const [payments, setPayments] = useState([]);

    useEffect(() => {
        const getThePayments = async() => {
            try{
                const res = await fetch("http://localhost:5000/api/payments/getallpayments");
                const data = await res.json();
                setPayments(data);
            }
            catch(error){
                alert('Problem Occured Fetching Payments', error);
            }
        }
        getThePayments();
    },[]);

    return(

        <div className="user-accounts-container">
        <h1 className="headings text-center">Payments</h1>
        {payments.length === 0 ? <h2 className="text-center fw-bold text-muted">No Payments Available</h2>:
        <>
        <table className="table table-striped w-75 mx-auto">
            <thead>
            <tr>
                <th>Applicant Name</th>
                <th>Payment Id</th>
                <th>Remaining Amount</th>
                <th>Payment Method</th>
                <th>Payment Date</th>
                <th>Paid Amount</th>
            </tr>
            </thead>
            <tbody>
            {payments.map((payment) => (
                <tr key={payment._id}>
                <td>{payment.userId.name}</td>
                <td className="fw-bold">{payment._id}</td>
                <td className="fw-bold text-warning">${payment.applicationId.remainingAmount}</td>
                <td className="fw-bold text-success">{payment.paymentMethod}</td>
                <td>{payment.paymentDate.split('T')[0]}</td>
                <td className="fw-bold text-success">${payment.amount}</td>
                </tr>
            ))}
            </tbody>
        </table>
        
        </>
}
        </div>
    )
        
    
}

export default Allpayments;
