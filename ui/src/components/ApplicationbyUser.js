import React from "react";
import { useState, useEffect } from "react";
import { Form, Row, Col, Button, Image, Spinner } from "react-bootstrap";
import defaultAvatar from '../assets/account.png';
import { useNavigate } from "react-router-dom";


function UserApplications() {
    const [user, setUser] = useState(null);
    const [form, setForm] = useState({ name: "", email: "", phone: "" });
    const [preview, setPreview] = useState(null); 
    const [applications, setApplications] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userRes = await fetch('http://localhost:5000/api/users/session-user', {
                    credentials: 'include',
                });
                if (!userRes.ok) throw new Error('Not logged in');
                const userData = await userRes.json();
                console.log("Fetched session user:", userData);
                setUser(userData.user);
                setForm({ ...userData.user });

                // Fetch applications
                const appRes = await fetch("http://localhost:5000/api/applications/applicationsbyuser", {
                    credentials: "include"
                });
                if (!appRes.ok) throw new Error("Failed to fetch applications");
                const appData = await appRes.json();
                setApplications(appData);

            } catch (error) {
                console.error("Error fetching data:", error);
                setUser(null);
            }
        };

        fetchData();
    }, []);

    const change = e => setForm({ ...form, [e.target.name]: e.target.value });

    const pickPhoto = e => {
        const file = e.target.files[0];
        if (!file) return;
        setForm({ ...form, avatar: file });
        setPreview(URL.createObjectURL(file));
    };

        const handleSubmit = async (e) => {
        e.preventDefault();
        try {
        const response = await fetch(`http://localhost:5000/api/users/update/${user.id}`, {
            method: "PUT",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify(form),
            credentials: 'include',
        });
    
        if (response.ok) {
            alert("User details updated successfully");
            
        } else {
            const errorData = await response.json();
            alert(`Error updating user: ${errorData.message}`);
        }
        } catch (error) {
        console.error("Error updating user:", error);
        alert("Error updating user");
        }
    };

    if (!user) return <div className="text-center my-5"><Spinner /></div>;

    return (
        <>
            <div className="container mt-5" style={{ maxWidth: "600px", marginBottom: "10rem" }}>
                <h3 className="mb-4 text-center">My profile</h3>

                <Form onSubmit={handleSubmit}>
                    <div className="text-center mb-4">
                        <Image
                            src={preview || user.avatar || defaultAvatar}
                            roundedCircle
                            width={120}
                            height={120}
                        />
                        <Form.Control
                            type="file"
                            accept="image/*"
                            onChange={pickPhoto}
                            className="mt-2"
                        />
                    </div>

                    <Row className="g-3">
                        <Col md={6}>
                            <Form.Control
                                name="name"
                                placeholder="Name"
                                value={form.name || ""}
                                onChange={change}
                            />
                        </Col>
                        <Col md={6}>
                            <Form.Control
                                name="email"
                                type="email"
                                value={form.email || ""}
                                onChange={change}
                            />
                        </Col>
                        <Col md={6} className="mx-auto">
                            <Form.Control
                                name="phone"
                                placeholder="Phone"
                                value={form.phone || ""}
                                onChange={change}
                            />
                        </Col>
                    </Row>

                    <div className="d-flex justify-content-center mt-4">
                        <Button type="submit" variant="primary">
                            Save changes
                        </Button>
                    </div>
                </Form>
            </div>

            <div className="mt-5 user-accounts-container container">
                <h1 className="mt-5 mb-5">Applications Submitted</h1>
                {applications.length === 0 ? (
                    <h3 className="text-muted mt-5"><b>No Applications Submitted</b></h3>
                ) : (
                    <div className="table-responsive">
                    <table className="table table-striped w-100 mx-auto mt-5">
                        <thead>
                            <tr>
                                <th>Application ID</th>
                                <th>Loan Type</th>
                                <th>Amount</th>
                                <th>Date Applied</th>
                                <th>Status</th>
                                <th>Payment</th>
                                <th>Amount Due</th>
                            </tr>
                        </thead>
                        <tbody>
                            {applications.map((application) => (
                                <tr key={application._id}>
                                    <td className={
                                        application.status === 'pending' ? 'text-warning' :
                                            application.status === 'approved' ? 'text-success' :
                                                application.status === 'rejected' ? 'text-danger' : ''
                                    }>
                                        <b>{application._id}</b>
                                    </td>
                                    <td>{application.loanType}</td>
                                    <td>$ {application.amount}</td>
                                    <td>{application.applicationDate.split('T')[0]}</td>
                                    <td className={
                                        application.status === 'pending' ? 'text-warning' :
                                            application.status === 'approved' ? 'text-success' :
                                                application.status === 'rejected' ? 'text-danger' : ''
                                    }>
                                        <b>{application.status}</b>
                                    </td>
                                    <td>
                                        {(application.status === 'approved')? <Button variant="success" onClick={() => navigate(`/paynow/${application._id}`)}>Pay</Button> : <p className="text-muted">Not Applicable</p>}
                                    </td>
                                    <td>
                                        {(application.status === 'approved')? <p className="text-danger fw-bold">${application.remainingAmount}</p> : <p className="text-muted">Not Applicable</p>}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    </div>
                )}
            </div>
        </>
    );
}

export default UserApplications;