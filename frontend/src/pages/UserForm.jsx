import React, { useState, useEffect } from "react";
import axios from "axios";

export default function UserForm({ refresh, editingUser, setEditingUser }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("buyer");
  const [password, setPassword] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (editingUser) {
      setName(editingUser.name);
      setEmail(editingUser.email);
      setRole(editingUser.role);
      setPassword(""); // don’t show old password
    }
  }, [editingUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        await axios.put(
          `http://localhost:5000/api/users/${editingUser._id}`,
          { name, email, role },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post(
          "http://localhost:5000/api/users",
          { name, email, role, password },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      refresh();
      setEditingUser(null);
      setName("");
      setEmail("");
      setRole("buyer");
      setPassword("");
    } catch (err) {
      console.error("Error saving user", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        type="text"
        placeholder="Full Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full p-2 border rounded"
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-2 border rounded"
        required
      />
      {!editingUser && (
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
      )}
      <select
        value={role}
        onChange={(e) => setRole(e.target.value)}
        className="w-full p-2 border rounded"
      >
        <option value="admin">Admin</option>
        <option value="planter">Planter</option>
        <option value="buyer">Buyer</option>
      </select>
      <button
        type="submit"
        className="px-4 py-2 bg-green-500 text-white rounded"
      >
        {editingUser ? "Update User" : "Add User"}
      </button>
    </form>
  );
}
