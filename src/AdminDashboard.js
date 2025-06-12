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

  // Admin: delete product
  const handleDeleteProduct = async (productId) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`/api/products/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(products.filter((p) => p.id !== productId));
      setMessage("Product deleted successfully.");
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to delete product.");
    }
  };

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>
      <h3>Products</h3>
      <div className="products-list">
        {products.length === 0 && <p>No products available.</p>}
        {products.map((p) => (
          <div className="product-card" key={p.id}>
            <img src={p.image_url} alt={p.name} />
            <h3>{p.name}</h3>
            <p>${p.price}</p>
            <p>{p.description}</p>
            <button onClick={() => handleDeleteProduct(p.id)}>Delete</button>
          </div>
        ))}
      </div>
      <h3>Orders</h3>
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
