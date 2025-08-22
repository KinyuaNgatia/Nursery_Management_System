import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AllOrders() {
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem("token");

  const fetchOrders = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data);
    } catch (err) {
      console.error("Error fetching orders", err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">📦 All Orders</h1>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <ul className="space-y-4">
          {orders.map((order) => (
            <li key={order._id} className="p-4 border rounded bg-white shadow">
              <p className="font-semibold">Order ID: {order._id}</p>
              <p className="text-sm">Buyer: {order.buyer?.name} ({order.buyer?.email})</p>
              <ul className="ml-4 mt-2 list-disc">
                {order.items.map((item, idx) => (
                  <li key={idx}>
                    {item.plant?.name || "Plant"} – ${item.price}
                  </li>
                ))}
              </ul>
              <p className="text-sm text-gray-600 mt-2">
                Ordered on {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
