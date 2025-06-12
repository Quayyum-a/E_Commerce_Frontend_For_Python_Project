import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Orders({ user }) {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get("/api/orders", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setOrders(res.data));
  }, []);

  return (
    <div className="orders-page">
      <h2>My Orders</h2>
      <div className="orders-list">
        {orders.map((o) => (
          <div className="order-card" key={o.id}>
            <p>Order ID: {o.id}</p>
            <p>Product: {o.product_name}</p>
            <p>Quantity: {o.quantity}</p>
            <p>Status: {o.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
