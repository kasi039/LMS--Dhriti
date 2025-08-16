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

    const DeleteApplication = async (id) => {
        const confirmation = window.confirm(`Are you sure you want to delete this application with id ${id}`);

        if (!confirmation) {
            return;
        }
        
        const res = await fetch(`http://localhost:5000/api/applications/applicationdelete/${id}`, {method: "DELETE"})
        if(res.ok){
            alert(`deleted application with ${id} successfully`);
            setApplications(applications.filter((application) => application._id !== id));
        }
        else{
            alert(`error deleting application with ${id}`)
        }
        

    } 



    

    return (
        <div className="user-accounts-container container">
            <h1 className="headings">All Users Applications</h1>
            {applications.length === 0 ? <h2 className="mb-5 text-muted fw-bold">No Applications Submitted</h2>:
            <>
            <table className="table table-striped w-100 mx-auto mt-5">
                <thead>
                    <tr>
                        <th>Application ID</th>
                        <th>Loan Type</th>
                        <th>Amount</th>
                        <th>Amount Due</th>
                        <th>Date Applied</th>
                        <th>Applicant Name</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {applications.map((application) => (
                        <tr key={application._id}>
                            <td className={application.status === 'pending'? 'text-warning': application.status==='approved'? 'text-success': application.status === 'rejected'? 'text-danger' : ''}><b>{application._id}</b></td>
                            <td>{application.loanType}</td>
                            <td>$ {application.amount}</td>
                            <td>{application.status === 'approved'? <p className="text-danger fw-bold">${application.remainingAmount}</p> : <p className="text-muted">Not Applicable</p>}</td>
                            <td>{application.applicationDate.split('T')[0]}</td>
                            <td>{application.userId.name}</td>
                            <td className={application.status === 'pending'? 'text-warning': application.status==='approved'? 'text-success': application.status === 'rejected'? 'text-danger' : ''}><b>{application.status}</b></td>
                            <td>
                                <Button variant="primary" onClick={() => navigate(`/applicationdetails/${application._id}`)} >View Details</Button>
                                <Button variant="danger" className="ms-2" onClick={() => DeleteApplication(application._id) } >Delete Application</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table> 
            </>
            }
        </div>
    );
}


export default AllApplications;