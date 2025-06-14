import React, { useState } from "react";
import axios from "axios";
export default function RegisterForm() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  });
  const [message, setMessage] = useState("");
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username || !form.email || !form.password) {
      setMessage("All fields except role are required.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }
    
    const submitForm = { ...form };
    delete submitForm.confirmPassword;
    // If role is empty or only whitespace, don't send it
    if (!submitForm.role || submitForm.role.trim() === "")
      delete submitForm.role;
    try {
      const res = await axios.post("/api/auth/register", submitForm);
      setMessage(res.data.message || "Registration successful!");
    } catch (err) {
      // Show backend validation errors if present
      if (err.response?.data?.message) {
        setMessage(err.response.data.message);
      } else if (err.response?.data?.detail) {
        setMessage(err.response.data.detail);
      } else {
        setMessage("Registration failed.");
      }
    }
  };
  return (
    <div className="form-container">
      {" "}
      <h2>Register</h2>{" "}
      <form onSubmit={handleSubmit}>
        {" "}
        <input
          name="username"
          placeholder="Username"
          onChange={handleChange}
          required
        />{" "}
        <input
          name="email"
          type="email"
          placeholder="Email"
          onChange={handleChange}
          required
        />{" "}
        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          required
        />{" "}
        <input
          name="confirmPassword"
          type="password"
          placeholder="Confirm Password"
          onChange={handleChange}
          required
        />{" "}
        <input
          name="role"
          type="text"
          placeholder="Role (optional, e.g., admin)"
          onChange={handleChange}
        />{" "}
        <button type="submit">Register</button>{" "}
      </form>{" "}
      <div className="message">{message}</div>{" "}
    </div>
  );
}
