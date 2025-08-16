import React from 'react'
import { Button } from 'react-bootstrap';
import { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';


function GetTheApplicationDetails(){

    const [applicationDetails, setApplicationDetails] = useState({});
    const{id: applicationId} = useParams()
    const navigate = useNavigate();


    useEffect(() => {
        const GetApplicationDetails = async () => {
            try{
                const res = await fetch(`http://localhost:5000/api/applications/getapplicationdetails/${applicationId}`, {credentials: "include"});
                if(!res.ok){
                    alert("Problem occured while fetching data");
                }

                const data = await res.json();
                setApplicationDetails(data);
            }
            catch(error){
                alert("Server erro", error);
            }
        }

        GetApplicationDetails();
    }, [applicationId]);

    const Approve = async (id) => {
        const res = await fetch(`http://localhost:5000/api/applications/statusupdate/${id}`, {
            method: 'PUT',
            credentials: 'include',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ status: 'approved' }),
        });

        if (res.ok) {
            alert(`Application Approved with ID: ${id}`);
            setApplicationDetails(prev => ({
                ...prev,
                status: "approved"
            }));
        }
    }

    const Reject = async (id) => {
        const res = await fetch(`http://localhost:5000/api/applications/statusupdate/${id}`, {
            method: 'PUT',
            credentials: 'include',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ status: 'rejected' }),
        }); 
        if (res.ok) {
            alert(`Application Rejected with ID: ${id}`);
            setApplicationDetails(prev => ({
                ...prev,
                status: "rejected"
            }));
        }
    }

    const Pending = async (id) => {
        const res = await fetch(`http://localhost:5000/api/applications/statusupdate/${id}`, {
            method: 'PUT',
            credentials: 'include',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ status: 'pending' }),
        }); 
        if (res.ok) {
            alert(`Application status changed to Pending with ID: ${id}`);
            setApplicationDetails(prev => ({
                ...prev,
                status: "pending"
            }));
        }
    }

    return(
    <>
    <h1 className="text-center headings">Application Details of : <span className="fw-bold">{applicationId}</span></h1>
    <div className=" mx-auto app-details py-5 mb-0">
        <div className="row w-100 justify-content-center p-3 g-2 bg-light shadow">
            <div className="col-12 text-center p-2">
                <p className="fs-4">Loan Type: <span className="fw-bold">{applicationDetails.loanType}</span> </p>
                <p className="fs-4 mb-5">Loan Amount: <span className="fw-bold">${applicationDetails.amount}</span> </p>
            </div>
            
            {applicationDetails.details && typeof applicationDetails.details === "object" && (
                    
                                
                Object.entries(applicationDetails.details).map(([key, value]) => (
                    <div className="col-12 col-md-6">
                        <p key={key} className="fs-5 ms-5">
                            <strong>{key}:</strong>
                            {String(value)? String(value) : <>Not Provided</>}
                        </p>
                    </div>
                ))
                                
                    
            )}
            <div className="col-12 text-center p-2">
                <p className="fs-4">Loan Status: <span className={`fw-bold ${(applicationDetails.status === 'pending'? 'text-warning' : (applicationDetails.status === 'approved'? 'text-success' : (applicationDetails.status === 'rejected')? 'text-danger' : 'text-white')) }`}>{applicationDetails.status}</span> </p>
            </div>
            
            <div className="mt-5 col-12 d-flex justify-content-center">
                <Button variant="primary" className="w-50" onClick={() => navigate(`/userdocuments/${applicationId}`)}>View Documents Provided</Button>

            </div>
            <div className="mt-4 col-12 d-flex justify-content-center">
                {applicationDetails.status === 'pending' && (
                    <>
                        <Button variant="success" onClick={() => Approve(applicationId)}>Approve</Button>
                        <Button variant="danger" onClick={() => Reject(applicationId)} className="ms-2">Reject</Button>
                    </>
                )}
                {applicationDetails.status === 'rejected' && (
                    <>
                        <Button variant="success" onClick={() => Approve(applicationId)}>Approve</Button>
                        <Button variant="warning" onClick={() => Pending(applicationId)} className="ms-1">Pend</Button>
                    </>
                )}
                {applicationDetails.status === 'approved' && (
                    <>
                        <Button variant="danger" onClick={() => Reject(applicationId)} >Reject</Button>
                        <Button variant="warning" onClick={() => Pending(applicationId)} className="ms-2">Pend</Button>
                    </>
                )}
            </div>
        </div>
    </div>
    <div className="last-button d-flex justify-content-center">
        <Button variant="info" className="w-25" onClick={() => navigate('/allapplications')}>Go back</Button>
    </div>
    </>
)
}

export default GetTheApplicationDetails;


