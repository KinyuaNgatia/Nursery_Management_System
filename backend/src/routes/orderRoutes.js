import express from "express";
import Order from "../models/Order.js";
import { authMiddleware, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// Create order (buyer only)
router.post("/", authMiddleware, authorizeRoles("buyer"), async (req, res) => {
  try {
    const newOrder = new Order({
      buyer: req.user._id,
      items: req.body.items,
    });
    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get all orders (admin/planter)
router.get("/", authMiddleware, authorizeRoles("admin", "planter"), async (req, res) => {
  try {
    const orders = await Order.find().populate("buyer", "name email");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get my orders (buyer)
router.get("/my", authMiddleware, authorizeRoles("buyer"), async (req, res) => {
  try {
    const orders = await Order.find({ buyer: req.user._id });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
