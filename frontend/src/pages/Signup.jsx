import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password) {
      setMessage("All fields are required");
      return;
    }

    try {
      const response = await API.post("/users/signup", formData);

      setMessage(response.data.message);

      setFormData({
        name: "",
        email: "",
        password: "",
      });

      // Signup successful → Login page
      navigate("/");
    } catch (error) {
      console.error("Signup Error:", error);

      setMessage(error.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div>
      <h2>Signup</h2>

      <form onSubmit={handleSignup}>
        <div>
          <label>Name</label>

          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter name"
          />
        </div>

        <div>
          <label>Email</label>

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter email"
          />
        </div>

        <div>
          <label>Password</label>

          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter password"
          />
        </div>

        <button type="submit">Signup</button>
      </form>

      {/* Login Link */}
      <p>
        Already have an account? <Link to="/">Login</Link>
      </p>

      {message && <p>{message}</p>}
    </div>
  );
};

export default Signup;
