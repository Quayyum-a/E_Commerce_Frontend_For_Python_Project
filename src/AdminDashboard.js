import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AdminDashboard({ user }) {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios.get("/api/products").then((res) => setProducts(res.data));
    axios
      .get("/api/orders", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setOrders(res.data));
  }, []);



  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>
      <h3>Products</h3>
      <div className="products-list">
        {products.map((p) => (
          <div className="product-card" key={p.id}>
            <img src={p.image_url} alt={p.name} />
            <h3>{p.name}</h3>
            <p>${p.price}</p>
            <p>{p.description}</p>
            {/* Add edit/delete buttons here */}
          </div>
        ))}
      </div>
      <h3>Orders</h3>
      <div className="orders-list">
        {orders.map((o) => (
          <div className="order-card" key={o.id}>
            <p>Order ID: {o.id}</p>
            <p>Product: {o.product_name}</p>
            <p>Quantity: {o.quantity}</p>
            <p>Status: {o.status}</p>
            {/* Add order management here */}
          </div>
        ))}
      </div>
      <div>{message}</div>
    </div>
  );
}
