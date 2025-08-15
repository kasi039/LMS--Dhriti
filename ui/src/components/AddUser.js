import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function AddUser(){
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert(" Passwords do not match");
            return;
        }

        try {
            const res = await fetch("http://localhost:5000/api/users/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name, email, phone, password }),
                credentials: 'include',
            });

            const data = await res.json();

            if (res.status === 201) {
            alert(" User Added successfully!");
            navigate("/useraccounts"); 
            } else {
            alert(` ${data.message || "Error Adding user"}`);
            }
        } catch (error) {
            alert(" Network or server error");
            console.error(error);
        }
    }
    
  return (
    <>
    <h1 className="headings text-center">Add User</h1>
    <div className="auth-container">


      <form onSubmit={handleSubmit}>


        <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />

        
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />



        <input type="tel" placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} required />


        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />

          
        <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
          


        <button type="submit" className="form-button">
          Add User
        </button>
      </form>
    </div>
    </>
  );
}

export default AddUser;
