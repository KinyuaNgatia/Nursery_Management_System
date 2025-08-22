import express from "express";
import Plant from "../models/Plant.js";
import { authMiddleware, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Get all plants
router.get("/", async (req, res) => {
  try {
    const plants = await Plant.find();
    res.json(plants);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Add plant (admin/planter only)
router.post("/", authMiddleware, authorizeRoles("admin", "planter"), async (req, res) => {
  try {
    const plant = new Plant({ ...req.body, createdBy: req.user._id });
    await plant.save();
    res.status(201).json(plant);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Update plant
router.put("/:id", authMiddleware, authorizeRoles("admin", "planter"), async (req, res) => {
  try {
    const updatedPlant = await Plant.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedPlant);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Delete plant
router.delete("/:id", authMiddleware, authorizeRoles("admin", "planter"), async (req, res) => {
  try {
    await Plant.findByIdAndDelete(req.params.id);
    res.json({ message: "Plant deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
