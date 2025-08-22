import React from "react";
import { useNavigate } from "react-router-dom";
import PlantList from "./PlantList";
import UserList from "./UserList";

const Dashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user")); // get user info

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-red-50">
        <p className="text-red-600 text-lg font-semibold">
          You are not logged in!
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Topbar */}
      <header className="bg-green-600 text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">🌱 Nursery Management</h1>
        <button
          onClick={() => {
            localStorage.removeItem("user");
            localStorage.removeItem("token");
            navigate("/login");
          }}
          className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </header>

      {/* Dashboard body */}
      <main className="flex-1 p-6 bg-green-50">
        <h2 className="text-2xl font-semibold mb-4">
          Welcome, {user.name} 👋
        </h2>
        <p className="mb-6">
          Role: <span className="font-bold">{user.role}</span>
        </p>
        {user.role === "buyer" && (
          <button
            onClick={() => navigate("/cart")}
            className="mt-2 px-3 py-1 bg-purple-500 text-white rounded"
          >
            View Cart
          </button>
        )}

        {/* Role-based panels */}
        {user.role === "admin" && (
          <div className="space-y-6">
            {/* Admin Panel */}
            <div className="p-4 bg-white shadow rounded">
              <h3 className="font-semibold text-lg">Admin Panel</h3>
              <p className="text-gray-600 mb-3">
                Manage users, plants, and orders.
              </p>
              {/* Manage Users */}
              <UserList />
            </div>

            <div className="p-4 bg-white shadow rounded">
              {/* Manage Plants */}
              <PlantList />
            </div>
          </div>
        )}

        {user.role === "planter" && (
          <div className="p-4 bg-white shadow rounded mb-4">
            <h3 className="font-semibold text-lg">Planter Panel</h3>
            <p className="text-gray-600 mb-3">
              Add, update, and track your plants.
            </p>
            <PlantList />
          </div>
        )}

        {user.role === "buyer" && (
          <div className="p-4 bg-white shadow rounded mb-4">
            <h3 className="font-semibold text-lg">Buyer Panel</h3>
            <p className="text-gray-600">
              Browse and purchase plants from the marketplace.
            </p>
            <button
              onClick={() => navigate("/marketplace")}
              className="mt-2 px-3 py-1 bg-blue-500 text-white rounded"
            >
              Go to Marketplace
            </button>
            <PlantList readOnly />
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
