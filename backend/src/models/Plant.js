import mongoose from "mongoose";

const plantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String,
    category: { type: String, enum: ["flower", "tree", "shrub", "vegetable", "herb"], required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    image: { type: String }, // URL to plant image
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // admin/planter who added it
  },
  { timestamps: true }
);

export default mongoose.model("Plant", plantSchema);
