import React from "react";
import { useState, useEffect } from "react";
import { Button } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";

function AllApplications() {
    
    const[applications, setApplications] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        
        const fetchApplications = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/applications/allapplications", {credentials:"include"});
                if (!response.ok) {
                    throw new Error("Failed to fetch applications");
                }
                const data = await response.json();
                setApplications(data);
            } catch (error) {
                console.error("Error fetching applications:", error);
            }
        };

        fetchApplications();

    }, []);

    

    return (
        <div className="user-accounts-container container">
            <h1 className="mb-5">User Applications</h1>
            <table className="table table-striped w-100 mx-auto mt-5">
                <thead>
                    <tr>
                        <th>Application ID</th>
                        <th>Loan Type</th>
                        <th>Amount</th>
                        <th>Date Applied</th>
                        <th>Applicant Name</th>
                        <th>Status</th>
                        <th>Documents</th>
                    </tr>
                </thead>
                <tbody>
                    {applications.map((application) => (
                        <tr key={application._id}>
                            <td className={application.status === 'pending'? 'text-warning': application.status==='approved'? 'text-success': application.status === 'rejected'? 'text-danger' : ''}><b>{application._id}</b></td>
                            <td>{application.loantype}</td>
                            <td>$ {application.amount}</td>
                            <td>{application.applicationDate}</td>
                            <td>{application.userId.name}</td>
                            <td className={application.status === 'pending'? 'text-warning': application.status==='approved'? 'text-success': application.status === 'rejected'? 'text-danger' : ''}><b>{application.status}</b></td>
                            <td>
                                <Button variant="primary" onClick={() => navigate(`/userdocuments/${application._id}`)} >View Documents Uploaded</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table> 
        </div>
    );
}

export default AllApplications;