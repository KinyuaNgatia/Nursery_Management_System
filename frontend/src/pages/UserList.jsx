import React, { useEffect, useState } from "react";
import axios from "axios";
import UserForm from "./UserForm";

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const token = localStorage.getItem("token");

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users", err);
    }
  };
  const changeRole = async (id, newRole) => {
    try {
      await axios.put(
        `http://localhost:5000/api/users/${id}`,
        { role: newRole },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchUsers();
    } catch (err) {
      console.error("Error updating role", err);
    }
  };
  

  const deleteUser = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers();
    } catch (err) {
      console.error("Error deleting user", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">User Management</h1>

      {/* Add / Edit Form */}
      <UserForm
        refresh={fetchUsers}
        editingUser={editingUser}
        setEditingUser={setEditingUser}
      />

      {/* User List */}
      <ul className="mt-6 space-y-3">
        {users.map((user) => (
          <li
            key={user._id}
            className="p-4 border rounded-lg flex justify-between items-center"
          >
            <div>
              <h2 className="font-semibold">{user.name}</h2>
              <p className="text-sm text-gray-600">{user.email}</p>
              <p className="text-sm text-blue-700">Role: {user.role}</p>
            </div>

            <div className="flex gap-2">
              <select
                value={u.role}
                onChange={(e) => changeRole(u._id, e.target.value)}
                className="border p-1 rounded"
              >
                <option value="admin">Admin</option>
                <option value="planter">Planter</option>
                <option value="buyer">Buyer</option>
              </select>
              <button
                onClick={() => deleteUser(u._id)}
                className="px-3 py-1 bg-red-500 text-white rounded"
              >
                Delete
              </button>
            </div>
            
          </li>
        ))}
      </ul>
    </div>
  );
}
