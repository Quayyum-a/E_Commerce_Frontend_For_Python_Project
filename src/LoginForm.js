import React, { useState } from "react";
import axios from "axios";

export default function LoginForm({ onLogin }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/auth/login", form);
      console.log("Login response:", res.data); // Log backend response
      // Accept both { token, user } and { token } responses
      // Flask returns { access_token, ... }
      if (res.data.access_token) {
        // Try to extract user info from JWT payload (sub field)
        let userObj;
        try {
          const payload = JSON.parse(atob(res.data.access_token.split(".")[1]));
          userObj = payload.sub || { email: form.email };
        } catch (e) {
          userObj = { email: form.email };
        }
        setMessage("Login successful!");
        if (onLogin) onLogin(userObj, res.data.access_token);
      } else if (res.data.token) {
        let userObj = res.data.user;
        if (!userObj) {
          userObj = { email: form.email };
        }
        setMessage("Login successful!");
        if (onLogin) onLogin(userObj, res.data.token);
      } else {
        setMessage("Login failed: Invalid response.");
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "Login failed.");
    }
  };

  return (
    <div className="form-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="email"
          type="email"
          placeholder="Email"
          onChange={handleChange}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          required
        />
        <button type="submit">Login</button>
      </form>
      <div className="message">{message}</div>
    </div>
  );
}
