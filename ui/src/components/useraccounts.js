import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import {Button} from 'react-bootstrap';

function UserAccounts() {
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();
    
    useEffect(() => {
        const fetchUsers = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/users/alluseraccounts");
            if (!response.ok) {
            throw new Error("Failed to fetch users");
            }
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
        };
    
        fetchUsers();
    }, []);

        const deleteUser = async (id) => {
            
            const confirmation = window.confirm("Are you sure you want to delete this user?")

            if (!confirmation) {
                return;
            }

            const res = await fetch(`http://localhost:5000/api/users/${id}`, {
            method: "DELETE",
            });
            if (res.ok) {
            alert("User deleted");
            setUsers(users.filter((user) => user._id !== id));
            }
        };
    
    return (
        <div className="user-accounts-container">
        <h1 className="headings">User Accounts</h1>
        <Button variant="primary" onClick={()=> navigate('/AddUserByAdmin')} className="mb-5">Add User</Button>
        <div className="table-responsive">
        <table className="table table-striped w-75 mx-auto">
            <thead>
            <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Delete</th>
                <th>Edit</th>
            </tr>
            </thead>
            <tbody>
            {users.map((user) => (
                <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
                <td>{user.role}</td>
                <td>
                    <button className="btn btn-warning" onClick={() => navigate(`/editform/${user._id}`) }>Edit</button>
                </td>
                <td>
                    <button className="btn btn-danger" onClick={() => deleteUser(user._id)}>Delete</button>
                </td>
                </tr>
            ))}
            </tbody>
        </table>
        </div>
        </div>
    );
}

export default UserAccounts;