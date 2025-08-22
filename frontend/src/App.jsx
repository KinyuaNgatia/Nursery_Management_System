import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Marketplace from "./pages/Marketplace";
import Cart from "./pages/Cart";
import MyOrders from "./pages/MyOrders";
import AllOrders from "./pages/AllOrders";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Redirect root to dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Auth-protected routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute roles={["admin", "planter", "buyer"]}>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Buyer-only */}
          <Route
            path="/marketplace"
            element={
              <ProtectedRoute roles={["buyer"]}>
                <Marketplace />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cart"
            element={
              <ProtectedRoute roles={["buyer"]}>
                <Cart />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-orders"
            element={
              <ProtectedRoute roles={["buyer"]}>
                <MyOrders />
              </ProtectedRoute>
            }
          />

          {/* Admin & Planter */}
          <Route
            path="/orders"
            element={
              <ProtectedRoute roles={["admin", "planter"]}>
                <AllOrders />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
