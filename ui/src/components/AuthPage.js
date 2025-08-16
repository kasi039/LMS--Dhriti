import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // 👈 Eye icons

function AuthPage({ onUserChange }) {
  const [isSignUp, setIsSignUp] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // 👇 visibility states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSignUp && password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const url = isSignUp
        ? "http://localhost:5000/api/users/signup"
        : "http://localhost:5000/api/users/login";

      const body = isSignUp
        ? { name, email, phone, password }
        : { email, password };

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok) {
        alert(isSignUp ? "User registered successfully!" : "Login successful!");
        onUserChange(data.user);
        navigate(data.user?.role === "admin" ? "/admin" : "/services");
      } else {
        alert(data.message || "Error occurred");
      }
    } catch (error) {
      alert("Network or server error");
      console.error(error);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-bar">
        <span
          className={isSignUp ? "active" : ""}
          onClick={() => setIsSignUp(true)}
        >
          Sign Up
        </span>
        <span
          className={!isSignUp ? "active" : ""}
          onClick={() => setIsSignUp(false)}
        >
          Sign In
        </span>
      </div>
      <br />

      <form onSubmit={handleSubmit}>
        {isSignUp && (
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {isSignUp && (
          <input
            type="tel"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        )}

        {/* Password field with eye icon */}
        <div className="password-field">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <span onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        {isSignUp && (
          <div className="password-field">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <span onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
        )}

        <button type="submit" className="form-button">
          {isSignUp ? "Register" : "Login"}
        </button>
      </form>
    </div>
  );
}

export default AuthPage;
