import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Orders({ user }) {
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get("/api/orders", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setOrders(res.data))
      .catch((err) =>
        setMessage(err.response?.data?.message || "Failed to fetch orders.")
      );
  }, []);

  return (
    <div className="orders-page">
      <h2>My Orders</h2>
      <div className="orders-list">
        {orders.length === 0 && <p>No orders found.</p>}
        {orders.map((o) => (
          <div className="order-card" key={o.id}>
            <p>Order ID: {o.id}</p>
            <p>Product: {o.product_name || o.productId || "N/A"}</p>
            <p>Quantity: {o.quantity}</p>
            <p>Status: {o.status || "N/A"}</p>
          </div>
        ))}
      </div>
      {message && <div className="message">{message}</div>}
    </div>
  );
}
