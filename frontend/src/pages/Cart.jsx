import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const [cart, setCart] = useState(
    JSON.parse(localStorage.getItem("cart")) || []
  );
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const removeFromCart = (id) => {
    const updatedCart = cart.filter((item) => item._id !== id);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const placeOrder = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/orders",
        { items: cart.map((p) => ({ plant: p._id, price: p.price })) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      localStorage.removeItem("cart");
      setCart([]);
      alert("✅ Order placed successfully!");
      navigate("/dashboard");
    } catch (err) {
      console.error("Error placing order", err);
      alert("❌ Failed to place order");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">🛍️ Your Cart</h1>

      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="space-y-4">
          {cart.map((item) => (
            <div
              key={item._id}
              className="p-4 border rounded flex justify-between items-center"
            >
              <div>
                <h2 className="font-semibold">{item.name}</h2>
                <p>${item.price}</p>
              </div>
              <button
                onClick={() => removeFromCart(item._id)}
                className="px-3 py-1 bg-red-500 text-white rounded"
              >
                Remove
              </button>
            </div>
          ))}

          <div className="mt-6">
            <button
              onClick={placeOrder}
              className="px-4 py-2 bg-green-600 text-white rounded"
            >
              Place Order
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
