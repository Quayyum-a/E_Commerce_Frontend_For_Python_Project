import React, { useState, useEffect } from "react";
import {

  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Navbar from "./Navbar";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import Products from "./Products";
import Orders from "./Orders";
import AdminDashboard from "./AdminDashboard";
import "./App.css";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    
    const token = localStorage.getItem("token");
    const userInfo = localStorage.getItem("user");
    if (token && userInfo) setUser(JSON.parse(userInfo));
  }, []);

  const handleLogin = (user, token) => {
    setUser(user);
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
      <>
        <Navbar user={user} onLogout={handleLogout} />
        <Routes>
          <Route
            path="/"
            element={
              <Navigate
                to={
                  user
                    ? user.role === "admin"
                      ? "/admin"
                      : "/products"
                    : "/login"
                }
              />
            }
          />
          <Route path="/login" element={<LoginForm onLogin={handleLogin} />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route
            path="/products"
            element={user ? <Products user={user} /> : <Navigate to="/login" />}
          />
          <Route
            path="/orders"
            element={user ? <Orders user={user} /> : <Navigate to="/login" />}
          />
          <Route
            path="/admin"
            element={
              user && user.role === "admin" ? (
                <AdminDashboard user={user} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
        </Routes>
      </>
  );
}

export default App;
