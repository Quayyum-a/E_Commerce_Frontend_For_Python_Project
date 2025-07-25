import React from "react";
import { Link } from "react-router-dom";

export default function Navbar({ user, onLogout }) {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">E-Commerce</Link>
      </div>
      <ul className="navbar-links">
        {user ? (
          <>
            {user.role === "admin" ? (
              <>
                <li>
                  <Link to="/admin">Dashboard</Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/products">Products</Link>
                </li>
                <li>
                  <Link to="/orders">My Orders</Link>
                </li>
                {user.role === "customer" && (
                  <li>
                    <Link to="/cart">Cart</Link>
                  </li>
                )}
              </>
            )}
            <li>
              <button onClick={onLogout}>Logout</button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/register">Register</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}
