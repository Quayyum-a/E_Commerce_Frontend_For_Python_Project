import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Cart({ user }) {
  const [cart, setCart] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
    if (!user) return;
    // Try to fetch cart by user_id (assume 1 cart per user)
    const fetchOrCreateCart = async () => {
      try {
        // Try to get cart by user_id (you may need a /api/cart/user/<user_id> endpoint, else create)
        let cartId = localStorage.getItem("cart_id");
        let cartData = null;
        if (cartId) {
          try {
            const res = await axios.get(`/api/cart/${cartId}`);
            cartData = res.data.cart;
          } catch (err) {
            // If not found, create new cart
            cartData = null;
          }
        }
        if (!cartData) {
          const res = await axios.post("/api/cart/", { user_id: user.id });
          cartData = res.data.cart;
        }
        setCart(cartData);
        localStorage.setItem("cart_id", cartData.id);
      } catch (err) {
        setMessage("Could not create or fetch cart.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrCreateCart();
  }, [user]);

  const addToCart = async (product_id, quantity = 1) => {
    if (!cart) return;
    try {
      const res = await axios.post(`/api/cart/${cart.id}/items`, {
        product_id,
        quantity,
      });
      setCart(res.data.cart);
      setMessage("Added to cart!");
    } catch (err) {
      setMessage("Failed to add to cart.");
    }
  };

  const removeFromCart = async (item_id) => {
    if (!cart) return;
    try {
      const res = await axios.delete(`/api/cart/${cart.id}/items/${item_id}`);
      setCart(res.data.cart);
      setMessage("Removed from cart.");
    } catch (err) {
      setMessage("Failed to remove item.");
    }
  };

  if (loading) return <div>Loading cart...</div>;
  if (!cart) return <div>No cart found.</div>;

  return (
    <div className="cart-page">
      <h2>My Cart</h2>
      {cart.items.length === 0 && <p>Your cart is empty.</p>}
      <ul>
        {cart.items.map((item) => (
          <li key={item.id}>
            Product ID: {item.product_id} | Quantity: {item.quantity}
            <button onClick={() => removeFromCart(item.id)}>Remove</button>
          </li>
        ))}
      </ul>
      {message && <div className="message">{message}</div>}
    </div>
  );
}
