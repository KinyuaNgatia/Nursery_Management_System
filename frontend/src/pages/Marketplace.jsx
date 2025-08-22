import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Marketplace() {
  const [plants, setPlants] = useState([]);
  const [cart, setCart] = useState(
    JSON.parse(localStorage.getItem("cart")) || []
  );

  const token = localStorage.getItem("token");

  const fetchPlants = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/plants", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPlants(res.data);
    } catch (err) {
      console.error("Error fetching plants", err);
    }
  };

  const addToCart = (plant) => {
    const updatedCart = [...cart, plant];
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  useEffect(() => {
    fetchPlants();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">🛒 Marketplace</h1>

      {plants.length === 0 ? (
        <p>No plants available right now.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {plants.map((plant) => (
            <div
              key={plant._id}
              className="p-4 border rounded shadow bg-white flex flex-col justify-between"
            >
              <div>
                <h2 className="font-semibold text-lg">{plant.name}</h2>
                <p className="text-sm text-gray-600">{plant.description}</p>
                <p className="mt-2 text-green-700 font-bold">
                  ${plant.price}
                </p>
              </div>

              <button
                onClick={() => addToCart(plant)}
                className="mt-4 px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Buy
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
