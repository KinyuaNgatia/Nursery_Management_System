import express from "express";
import { authMiddleware, adminOnly } from "../middleware/authMiddleware.js";
import Order from "../models/Order.js";

const router = express.Router();

// Buyer: create new order
router.post("/", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "buyer") {
      return res.status(403).json({ message: "Only buyers can place orders" });
    }

    const { items, totalPrice } = req.body;
    const order = new Order({
      buyer: req.user.id,
      items,
      totalPrice,
    });

    await order.save();
    res.json(order);
  } catch (err) {
    res.status(400).json({ message: "Error creating order" });
  }
});

// Buyer: view own orders
router.get("/my-orders", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "buyer") {
      return res.status(403).json({ message: "Only buyers can view their orders" });
    }
    const orders = await Order.find({ buyer: req.user.id }).populate("items.plant");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Error fetching orders" });
  }
});

// Admin: view all orders
router.get("/", authMiddleware, adminOnly, async (req, res) => {
  try {
    const orders = await Order.find().populate("buyer").populate("items.plant");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Error fetching all orders" });
  }
});

// Admin: update order status
router.put("/:id/status", authMiddleware, adminOnly, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json(order);
  } catch (err) {
    res.status(400).json({ message: "Error updating order status" });
  }
});

export default router;
