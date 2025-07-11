import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function AuthPage({ onUserChange }) {
  const [isSignUp, setIsSignUp] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSignUp) {
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
          alert(" User registered successfully!");
          onUserChange(data.user); 
          navigate("/services"); //  Go to Services page after registration
        } else {
          alert(` ${data.message || "Error registering user"}`);
        }
      } catch (error) {
        alert(" Network or server error");
        console.error(error);
      }
    } 

    else {
        if (!email || !password) {
          alert(" Please enter email and password");
          return;
        }
      try {
        const res = await fetch("http://localhost:5000/api/users/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
          credentials: 'include',
        });

        const data = await res.json();

        if (res.status === 200) {
          alert(" Login successful!");
          onUserChange(data.user);
          if(data.user?.role === 'admin') {
            navigate("/admin"); 
          } else{
            navigate("/services");
          }
        }

         else {
          alert(` ${data.message || "Error logging in"}`);
        }
      }
      catch (error) {
        alert(" Network or server error");
        console.error(error);
      }
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-bar">
        <span className={isSignUp ? "active" : ""} onClick={() => setIsSignUp(true)}>Sign Up</span>
        <span className={!isSignUp ? "active" : ""} onClick={() => setIsSignUp(false)}>Sign In</span>
      </div>
      <br />

      <form onSubmit={handleSubmit}>

        {isSignUp && (
          <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
        )}
        
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />


        {isSignUp && (
          <input type="tel" placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} required />
        )}

        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />

        {isSignUp && (
          <>
            <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
          </>
        )}

        <button type="submit" className="form-button">
          {isSignUp ? "Register" : "Login"}
        </button>
      </form>
    </div>
  );
}

export default AuthPage;
