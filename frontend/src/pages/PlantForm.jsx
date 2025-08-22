import React, { useState, useEffect } from "react";
import axios from "axios";

export default function PlantForm({ refresh, editingPlant, setEditingPlant }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (editingPlant) {
      setName(editingPlant.name || "");
      setDescription(editingPlant.description || "");
      setPrice(editingPlant.price || "");
    }
  }, [editingPlant]);

  const resetForm = () => {
    setEditingPlant(null);
    setName("");
    setDescription("");
    setPrice("");
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (editingPlant) {
        // ✅ Update existing plant
        await axios.put(
          `http://localhost:5000/api/plants/${editingPlant._id}`,
          { name, description, price },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        // ✅ Add new plant
        await axios.post(
          "http://localhost:5000/api/plants",
          { name, description, price },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      refresh();
      resetForm();
    } catch (err) {
      console.error("Error saving plant", err);
      setError("Failed to save plant. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-3 p-4 bg-gray-50 border rounded shadow-sm"
    >
      <h2 className="text-lg font-semibold mb-2">
        {editingPlant ? "✏️ Edit Plant" : "➕ Add New Plant"}
      </h2>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <input
        type="text"
        placeholder="Plant name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full p-2 border rounded"
        required
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full p-2 border rounded"
        rows={3}
        required
      />
      <input
        type="number"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        className="w-full p-2 border rounded"
        min="0"
        step="0.01"
        required
      />

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
        >
          {loading
            ? "Saving..."
            : editingPlant
            ? "Update Plant"
            : "Add Plant"}
        </button>

        {editingPlant && (
          <button
            type="button"
            onClick={resetForm}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
