import mongoose from "mongoose";

const warehouseSchema = new mongoose.Schema(
  {
    region: { type: String, required: true, index: true },
    district: { type: String, required: true },
    city: { type: String, default: "" },
    covered_area: { type: [String], default: [] },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    status: { type: String, default: "active" },
    flowchart: { type: String, default: "" },
  },
  { timestamps: true }
);

export const Warehouse = mongoose.model("Warehouse", warehouseSchema);
