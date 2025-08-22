import React, { useEffect, useState } from "react";
import axios from "axios";
import PlantForm from "./PlantForm";

/**
 * Props:
 *  - readOnly: boolean → if true, hides Add/Edit/Delete features
 */
export default function PlantList({ readOnly = false }) {
  const [plants, setPlants] = useState([]);
  const [editingPlant, setEditingPlant] = useState(null);
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

  const deletePlant = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/plants/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchPlants();
    } catch (err) {
      console.error("Error deleting plant", err);
    }
  };

  useEffect(() => {
    fetchPlants();
  }, []);

  return (
    <div className="p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-4">🌿 Plant Management</h1>

      {/* ✅ Show form only if not readOnly */}
      {!readOnly && (
        <PlantForm
          refresh={fetchPlants}
          editingPlant={editingPlant}
          setEditingPlant={setEditingPlant}
        />
      )}

      {/* Plant List */}
      <ul className="mt-6 space-y-3">
        {plants.map((plant) => (
          <li
            key={plant._id}
            className="p-4 border rounded-lg flex justify-between items-center"
          >
            <div>
              <h2 className="font-semibold">{plant.name}</h2>
              <p className="text-sm text-gray-600">{plant.description}</p>
              <p className="text-sm text-green-700">
                Price: ${plant.price}
              </p>
            </div>

            {/* ✅ Show action buttons only if not readOnly */}
            {!readOnly && (
              <div className="flex gap-2">
                <button
                  onClick={() => setEditingPlant(plant)}
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => deletePlant(plant._id)}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>

      {/* Optional message for buyers */}
      {readOnly && plants.length === 0 && (
        <p className="mt-4 text-gray-500 text-center">
          No plants available at the moment 🌱
        </p>
      )}
    </div>
  );
}
