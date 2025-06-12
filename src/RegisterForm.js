import React, { useState } from "react";
import axios from "axios";
export default function RegisterForm() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "customer", // default to customer
  });
  const [message, setMessage] = useState("");
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/auth/register", form);
      setMessage(res.data.message || "Registration successful!");
    } catch (err) {
      setMessage(err.response?.data?.message || "Registration failed.");
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
        {/* Hide role input from user, default to customer */}
        <button type="submit">Register</button>{" "}
      </form>{" "}
      <div className="message">{message}</div>{" "}
    </div>
  );
}
