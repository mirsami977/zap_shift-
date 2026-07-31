import express from "express";
import { Rider } from "../models/Rider.js";
import { User } from "../models/User.js";
import { asyncHandler } from "../middleware/error.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

export const riderRouter = express.Router();

riderRouter.use(requireAuth);

riderRouter.post(
  "/apply",
  asyncHandler(async (req, res) => {
    const existing = await Rider.findOne({ email: req.user.email });
    if (existing) {
      return res.status(409).json({ message: "You already have a rider application", application: existing });
    }
    const rider = await Rider.create({
      ...req.body,
      name: req.body.name || req.user.name,
      email: req.user.email,
      status: "pending",
    });
    res.status(201).json(rider);
  })
);

riderRouter.get(
  "/me",
  asyncHandler(async (req, res) => {
    const rider = await Rider.findOne({ email: req.user.email });
    if (!rider) return res.status(404).json({ message: "No rider application found" });
    res.json(rider);
  })
);

riderRouter.get(
  "/",
  requireRole("admin"),
  asyncHandler(async (req, res) => {
    const { status, district } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (district) filter.district = district;
    res.json(await Rider.find(filter).sort({ createdAt: -1 }));
  })
);

riderRouter.patch(
  "/:id/status",
  requireRole("admin"),
  asyncHandler(async (req, res) => {
    const { status } = req.body;
    if (!["pending", "approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "status must be pending, approved or rejected" });
    }

    const rider = await Rider.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!rider) return res.status(404).json({ message: "Rider not found" });

    await User.findOneAndUpdate(
      { email: rider.email },
      { role: status === "approved" ? "rider" : "user" }
    );

    res.json(rider);
  })
);
