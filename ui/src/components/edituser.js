import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

function EditUserPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ name: "", email: "", phone: "", role: "user" });

  useEffect(() => {
    fetch(`http://localhost:5000/api/users/${id}`)
      .then((res) => res.json())
      .then((user) => {
        setFormData({
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
        });
      });
  }, [id]);

  const handleChange = (e) => {
    setFormData ({ ...formData, [e.target.name]: e.target.value });
  }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
        const response = await fetch(`http://localhost:5000/api/users/update/${id}`, {
            method: "PUT",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
            credentials: 'include',
        });
    
        if (response.ok) {
            alert("User updated successfully");
            navigate("/useraccounts");
        } else {
            const errorData = await response.json();
            alert(`Error updating user: ${errorData.message}`);
        }
        } catch (error) {
        console.error("Error updating user:", error);
        alert("Error updating user");
        }
    };

    return (
        <div className="edit-user-container">
            <form onSubmit={handleSubmit} className="w-25 mx-auto mt-5">
                <h2 className="mb-5 heading-edit">Edit User</h2>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Name</label>
                    <input type="text" name="name" className="form-control" value={formData.name} onChange={handleChange}/>
                </div>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input type="email" name="email" className="form-control" value={formData.email} onChange={handleChange}/>
                </div>
                <div className="mb-3">
                    <label htmlFor="phone" className="form-label">Phone</label>
                    <input type="text" name="phone" className="form-control" value={formData.phone} onChange={handleChange}/>
                </div>
                <div className="mb-3">
                    <label htmlFor="role" className="form-label">Role</label>
                    <select className="form-select" name="role" value={formData.role} onChange={handleChange}>
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
                <button type="submit" className="btn btn-primary">Update User</button>
            </form>
        </div>
    );
        
        
}

export default EditUserPage;