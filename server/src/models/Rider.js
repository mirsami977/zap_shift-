import mongoose from "mongoose";

const riderSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, required: true },
    age: { type: Number, required: true, min: 18 },
    nid: { type: String, required: true },
    region: { type: String, required: true },
    district: { type: String, required: true },
    bikeBrand: { type: String, default: "" },
    bikeRegistration: { type: String, default: "" },
    note: { type: String, default: "" },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending", index: true },
    workStatus: { type: String, enum: ["available", "busy"], default: "available" },
  },
  { timestamps: true }
);

export const Rider = mongoose.model("Rider", riderSchema);
