import express from "express";
import crypto from "crypto";
import { Parcel } from "../models/Parcel.js";
import { asyncHandler } from "../middleware/error.js";
import { requireAuth } from "../middleware/auth.js";

export const paymentRouter = express.Router();

paymentRouter.use(requireAuth);

paymentRouter.post(
  "/:parcelId/pay",
  asyncHandler(async (req, res) => {
    const parcel = await Parcel.findById(req.params.parcelId);
    if (!parcel) return res.status(404).json({ message: "Parcel not found" });
    if (req.user.role !== "admin" && parcel.senderEmail !== req.user.email) {
      return res.status(403).json({ message: "Access denied" });
    }
    if (parcel.paymentStatus === "paid") {
      return res.status(409).json({ message: "This parcel is already paid", parcel });
    }

    parcel.paymentStatus = "paid";
    parcel.paidAt = new Date();
    parcel.transactionId = `TXN-${crypto.randomBytes(6).toString("hex").toUpperCase()}`;
    parcel.deliveryStatus = "paid";
    parcel.trackingHistory.push({
      status: "paid",
      note: `Payment received (${parcel.transactionId})`,
      updatedBy: req.user.email,
    });
    await parcel.save();

    res.json({ parcel, transactionId: parcel.transactionId, amount: parcel.cost });
  })
);

paymentRouter.get(
  "/history",
  asyncHandler(async (req, res) => {
    const filter = { paymentStatus: "paid" };
    if (req.user.role !== "admin") filter.senderEmail = req.user.email;

    const parcels = await Parcel.find(filter)
      .select("trackingId title cost transactionId paidAt senderEmail")
      .sort({ paidAt: -1 });
    res.json(parcels);
  })
);
