import React from "react";
import { useState, useEffect } from "react";
import {Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function Allapprovedapplications(){
    const [applications, setApplications] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        const fetcApplicationsByUser = async () => {


                
                const appRes = await fetch("http://localhost:5000/api/applications/applicationsbyuser", {
                    credentials: "include"
                });
                if (!appRes.ok) throw new Error("Failed to fetch applications");
                const appData = await appRes.json();
                setApplications(appData);

            } 
        ;

        fetcApplicationsByUser();
    }, []);

    return(
        <>
        {applications.filter(app => app.status === 'approved').length === 0 ?
        <h1 className="headings text-center text-muted fw-bold">No Approved Applications for Payment</h1> :
        <>
        <h1 className="headings text-center">Select an Application To Pay the Installment</h1>
        {applications
        .filter(app => app.status === 'approved')
        .map(application => (
                <div key={application._id} className="mb-5 approved-div mx-auto rounded shadow py-5">
                <div className="row w-100 justify-content-end g-3">
                    <div className="col-8">
                    <p className="fs-5">
                        ApplicationId: <strong className="text-success fw-bold">{application._id}</strong>
                    </p>
                    <p className="fs-5">Loan Type: <strong>{application.loanType}</strong></p>
                    <p className="fs-5">
                        Loan Amount: <strong className="text-success fw-bold">${application.amount}</strong>
                    </p>
                    <p className="fs-5">Applied Date: <strong>{application.applicationDate.split('T')[0]}</strong></p>
                    <p className="fs-5">
                        Status: <strong className="text-success fw-bold">{application.status}</strong>
                    </p>
                    </div>
                    <div className="col-3 d-flex align-items-center h-50 justify-content-center">
                    <Button variant="success" onClick={() => navigate(`/paynow/${application._id}`)}>
                        Pay
                    </Button>
                    </div>
                </div>
            </div>
        ))}
        </>
    }

        </>

    )
}

export default Allapprovedapplications;


        