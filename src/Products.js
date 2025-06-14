import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Products({ user }) {
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios.get("/api/products").then((res) => {
      
      if (Array.isArray(res.data)) {
        setProducts(res.data);
      } else if (Array.isArray(res.data.products)) {
        setProducts(res.data.products);
      } else {
        setProducts([]);
      }
    });
  }, []);

  const orderProduct = async (product_id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "/api/orders",
        { product_id, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("Order placed!");
    } catch (err) {
      setMessage(err.response?.data?.message || "Order failed.");
    }
  };

  return (
    <div className="products-page">
      <h2>Products</h2>
      <div className="products-list">
        {(!products || products.length === 0) && <p>No products available.</p>}
        {Array.isArray(products) &&
          products.map((p) => (
            <div className="product-card" key={p.id}>
              <img src={p.image_url} alt={p.name} />
              <h3>{p.name}</h3>
              <p>${p.price}</p>
              <p>{p.description}</p>
              {user && user.role === "customer" && (
                <button onClick={() => orderProduct(p.id)}>Order</button>
              )}
            </div>
          ))}
      </div>
      {message && <div className="message">{message}</div>}
    </div>
  );
}
