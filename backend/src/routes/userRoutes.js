import express from "express";
import { authMiddleware, adminOnly } from "../middleware/authMiddleware.js";
import User from "../models/User.js";

const router = express.Router();

// Get all users (admin only)
router.get("/", authMiddleware, adminOnly, async (req, res) => {
  try {
    const users = await User.find().select("-password"); // exclude passwords
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Create new user (admin only)
router.post("/", authMiddleware, adminOnly, async (req, res) => {
  try {
    const { name, email, role, password } = req.body;
    const user = new User({ name, email, role, password });
    await user.save();
    res.json(user);
  } catch (err) {
    res.status(400).json({ message: "Error creating user" });
  }
});

// Update user (admin only)
router.put("/:id", authMiddleware, adminOnly, async (req, res) => {
  try {
    const { name, email, role } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, role },
      { new: true }
    ).select("-password");
    res.json(user);
  } catch (err) {
    res.status(400).json({ message: "Error updating user" });
  }
});

// Delete user (admin only)
router.delete("/:id", authMiddleware, adminOnly, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(400).json({ message: "Error deleting user" });
  }
});

export default router;
