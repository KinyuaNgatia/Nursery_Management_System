import express from "express";
import cors from "cors";

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Simple test route
app.get("/", (req, res) => {
  res.send("✅ Backend is running!");
});

// Dummy register endpoint
app.post("/api/auth/register", (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields required" });
  }
  // For demo, just return success
  res.json({ message: "User registered successfully", user: { name, email, role } });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
