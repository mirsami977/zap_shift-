import express from "express";
import { Parcel, PARCEL_STATUSES } from "../models/Parcel.js";
import { Rider } from "../models/Rider.js";
import { asyncHandler } from "../middleware/error.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { calculateCost } from "../utils/pricing.js";
import { generateTrackingId } from "../utils/tracking.js";

export const parcelRouter = express.Router();

const canSeeParcel = (user, parcel) =>
  user.role === "admin" ||
  parcel.senderEmail === user.email ||
  parcel.assignedRider?.email === user.email;

parcelRouter.post(
  "/quote",
  asyncHandler(async (req, res) => {
    const { type, weight, senderDistrict, receiverDistrict } = req.body;
    if (!type || !senderDistrict || !receiverDistrict) {
      return res
        .status(400)
        .json({ message: "type, senderDistrict and receiverDistrict are required" });
    }
    res.json(calculateCost({ type, weight, senderDistrict, receiverDistrict }));
  })
);

parcelRouter.get(
  "/track/:trackingId",
  asyncHandler(async (req, res) => {
    const parcel = await Parcel.findOne({ trackingId: req.params.trackingId.toUpperCase() }).select(
      "trackingId title deliveryStatus paymentStatus senderDistrict receiverDistrict trackingHistory createdAt"
    );
    if (!parcel) return res.status(404).json({ message: "No parcel found with this tracking id" });
    res.json(parcel);
  })
);

parcelRouter.use(requireAuth);

parcelRouter.post(
  "/",
  asyncHandler(async (req, res) => {
    const payload = req.body;
    const { cost, breakdown } = calculateCost(payload);
    const parcel = await Parcel.create({
      ...payload,
      senderEmail: req.user.email,
      senderName: payload.senderName || req.user.name,
      trackingId: generateTrackingId(),
      cost,
      costBreakdown: breakdown,
      paymentStatus: "unpaid",
      deliveryStatus: "unpaid",
      trackingHistory: [
        { status: "unpaid", note: "Parcel booked, awaiting payment", updatedBy: req.user.email },
      ],
    });
    res.status(201).json(parcel);
  })
);

parcelRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const { status, paymentStatus, email } = req.query;
    const filter = {};

    if (req.user.role === "admin") {
      if (email) filter.senderEmail = String(email).toLowerCase();
    } else if (req.user.role === "rider") {
      filter["assignedRider.email"] = req.user.email;
    } else {
      filter.senderEmail = req.user.email;
    }

    if (status) filter.deliveryStatus = status;
    if (paymentStatus) filter.paymentStatus = paymentStatus;

    const parcels = await Parcel.find(filter).sort({ createdAt: -1 });
    res.json(parcels);
  })
);

parcelRouter.get(
  "/stats",
  asyncHandler(async (req, res) => {
    const match =
      req.user.role === "admin"
        ? {}
        : req.user.role === "rider"
          ? { "assignedRider.email": req.user.email }
          : { senderEmail: req.user.email };

    const [byStatus, totals] = await Promise.all([
      Parcel.aggregate([
        { $match: match },
        { $group: { _id: "$deliveryStatus", count: { $sum: 1 } } },
      ]),
      Parcel.aggregate([
        { $match: match },
        {
          $group: {
            _id: null,
            parcels: { $sum: 1 },
            revenue: { $sum: { $cond: [{ $eq: ["$paymentStatus", "paid"] }, "$cost", 0] } },
          },
        },
      ]),
    ]);

    res.json({
      byStatus: Object.fromEntries(byStatus.map(({ _id, count }) => [_id, count])),
      totalParcels: totals[0]?.parcels ?? 0,
      totalRevenue: totals[0]?.revenue ?? 0,
    });
  })
);

parcelRouter.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const parcel = await Parcel.findById(req.params.id);
    if (!parcel) return res.status(404).json({ message: "Parcel not found" });
    if (!canSeeParcel(req.user, parcel)) return res.status(403).json({ message: "Access denied" });
    res.json(parcel);
  })
);

parcelRouter.patch(
  "/:id/assign",
  requireRole("admin"),
  asyncHandler(async (req, res) => {
    const { riderId } = req.body;
    const [parcel, rider] = await Promise.all([Parcel.findById(req.params.id), Rider.findById(riderId)]);
    if (!parcel) return res.status(404).json({ message: "Parcel not found" });
    if (!rider || rider.status !== "approved") {
      return res.status(400).json({ message: "Rider not found or not approved" });
    }
    if (parcel.paymentStatus !== "paid") {
      return res.status(400).json({ message: "Parcel must be paid before assigning a rider" });
    }

    parcel.assignedRider = {
      riderId: rider._id,
      name: rider.name,
      email: rider.email,
      phone: rider.phone,
    };
    parcel.deliveryStatus = "rider_assigned";
    parcel.trackingHistory.push({
      status: "rider_assigned",
      note: `Assigned to rider ${rider.name}`,
      updatedBy: req.user.email,
    });
    await parcel.save();

    rider.workStatus = "busy";
    await rider.save();

    res.json(parcel);
  })
);

parcelRouter.patch(
  "/:id/status",
  requireRole("admin", "rider"),
  asyncHandler(async (req, res) => {
    const { status, note = "" } = req.body;
    if (!PARCEL_STATUSES.includes(status)) {
      return res.status(400).json({ message: `status must be one of ${PARCEL_STATUSES.join(", ")}` });
    }

    const parcel = await Parcel.findById(req.params.id);
    if (!parcel) return res.status(404).json({ message: "Parcel not found" });
    if (req.user.role === "rider" && parcel.assignedRider?.email !== req.user.email) {
      return res.status(403).json({ message: "This parcel is not assigned to you" });
    }

    parcel.deliveryStatus = status;
    parcel.trackingHistory.push({ status, note, updatedBy: req.user.email });
    await parcel.save();

    if (status === "delivered" && parcel.assignedRider?.riderId) {
      await Rider.findByIdAndUpdate(parcel.assignedRider.riderId, { workStatus: "available" });
    }

    res.json(parcel);
  })
);

parcelRouter.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const parcel = await Parcel.findById(req.params.id);
    if (!parcel) return res.status(404).json({ message: "Parcel not found" });
    if (req.user.role !== "admin" && parcel.senderEmail !== req.user.email) {
      return res.status(403).json({ message: "Access denied" });
    }
    if (parcel.paymentStatus === "paid" && req.user.role !== "admin") {
      return res.status(400).json({ message: "Paid parcels can only be cancelled by an admin" });
    }
    await parcel.deleteOne();
    res.json({ message: "Parcel deleted", _id: parcel._id });
  })
);
