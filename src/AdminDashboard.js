import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AdminDashboard({ user }) {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios.get("/api/products").then((res) => {
      // Ensure products is always an array
      if (Array.isArray(res.data)) {
        setProducts(res.data);
      } else if (Array.isArray(res.data.products)) {
        setProducts(res.data.products);
      } else {
        setProducts([]);
      }
    });
    axios
      .get("/api/orders", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setOrders(res.data));
  }, []);

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

  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    stock: "",
    description: "",
    image_url: "",
  });
  const handleProductChange = (e) =>
    setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
  const handleCreateProduct = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    // Validate required fields
    if (!newProduct.name || !newProduct.price || !newProduct.stock) {
      setMessage("Name, price, and stock are required.");
      return;
    }
    // Remove empty optional fields
    const submitProduct = { ...newProduct };
    if (!submitProduct.description) delete submitProduct.description;
    if (!submitProduct.image_url) delete submitProduct.image_url;
    try {
      const res = await axios.post(
        "/api/products",
        {
          ...submitProduct,
          price: parseFloat(submitProduct.price),
          stock: parseInt(submitProduct.stock),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Accept both { product } and product object responses
      const created = res.data.product || res.data;
      setProducts([...products, created]);
      setMessage("Product created successfully.");
      setNewProduct({
        name: "",
        price: "",
        stock: "",
        description: "",
        image_url: "",
      });
    } catch (err) {
      if (err.response?.data?.message) {
        setMessage(err.response.data.message);
      } else if (err.response?.data?.detail) {
        setMessage(err.response.data.detail);
      } else {
        setMessage("Failed to create product.");
      }
    }
  };

  const [editingId, setEditingId] = useState(null);
  const [editProduct, setEditProduct] = useState({
    name: "",
    price: "",
    stock: "",
    description: "",
    image_url: "",
  });
  const startEdit = (product) => {
    setEditingId(product.id);
    setEditProduct({ ...product });
  };
  const handleEditChange = (e) =>
    setEditProduct({ ...editProduct, [e.target.name]: e.target.value });
  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    // Validate required fields
    if (!editProduct.name || !editProduct.price || !editProduct.stock) {
      setMessage("Name, price, and stock are required.");
      return;
    }
    // Remove empty optional fields
    const submitEdit = { ...editProduct };
    if (!submitEdit.description) delete submitEdit.description;
    if (!submitEdit.image_url) delete submitEdit.image_url;
    try {
      const res = await axios.put(
        `/api/products/${editingId}`,
        {
          ...submitEdit,
          price: parseFloat(submitEdit.price),
          stock: parseInt(submitEdit.stock),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Accept both { product } and product object responses
      const updated = res.data.product || res.data;
      setProducts(products.map((p) => (p.id === editingId ? updated : p)));
      setMessage("Product updated successfully.");
      setEditingId(null);
      setEditProduct({
        name: "",
        price: "",
        stock: "",
        description: "",
        image_url: "",
      });
    } catch (err) {
      if (err.response?.data?.message) {
        setMessage(err.response.data.message);
      } else if (err.response?.data?.detail) {
        setMessage(err.response.data.detail);
      } else {
        setMessage("Failed to update product.");
      }
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
            {editingId === p.id ? (
              <form onSubmit={handleUpdateProduct} className="form-container">
                <input
                  name="name"
                  value={editProduct.name}
                  onChange={handleEditChange}
                  required
                />
                <input
                  name="price"
                  type="number"
                  value={editProduct.price}
                  onChange={handleEditChange}
                  required
                />
                <input
                  name="stock"
                  type="number"
                  value={editProduct.stock}
                  onChange={handleEditChange}
                  required
                />
                <input
                  name="description"
                  value={editProduct.description}
                  onChange={handleEditChange}
                />
                <input
                  name="image_url"
                  value={editProduct.image_url}
                  onChange={handleEditChange}
                />
                <button type="submit">Save</button>
                <button type="button" onClick={() => setEditingId(null)}>
                  Cancel
                </button>
              </form>
            ) : (
              <>
                <img src={p.image_url} alt={p.name} />
                <h3>{p.name}</h3>
                <p>${p.price}</p>
                <p>{p.description}</p>
                <button onClick={() => startEdit(p)}>Edit</button>
                <button onClick={() => handleDeleteProduct(p.id)}>
                  Delete
                </button>
              </>
            )}
          </div>
        ))}
      </div>
      <h3>Add Product</h3>
      <form onSubmit={handleCreateProduct} className="form-container">
        <input
          name="name"
          placeholder="Name"
          value={newProduct.name}
          onChange={handleProductChange}
          required
        />
        <input
          name="price"
          type="number"
          placeholder="Price"
          value={newProduct.price}
          onChange={handleProductChange}
          required
        />
        <input
          name="stock"
          type="number"
          placeholder="Stock"
          value={newProduct.stock}
          onChange={handleProductChange}
          required
        />
        <input
          name="description"
          placeholder="Description"
          value={newProduct.description}
          onChange={handleProductChange}
        />
        <input
          name="image_url"
          placeholder="Image URL"
          value={newProduct.image_url}
          onChange={handleProductChange}
        />
        <button type="submit">Create Product</button>
      </form>
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
