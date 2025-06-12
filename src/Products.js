import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Products({ user }) {
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios.get("/api/products").then((res) => setProducts(res.data));
  }, []);

  // Admin: add/edit/delete product (UI not shown here for brevity)

  // Customer: order product
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
      setMessage("Order failed.");
    }
  };

  return (
    <div className="products-page">
      <h2>Products</h2>
      <div className="products-list">
        {products.map((p) => (
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
      <div>{message}</div>
    </div>
  );
}
