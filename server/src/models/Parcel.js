import mongoose from "mongoose";

export const PARCEL_STATUSES = [
  "unpaid",
  "paid",
  "rider_assigned",
  "in_transit",
  "delivered",
  "cancelled",
];

const trackingEventSchema = new mongoose.Schema(
  {
    status: { type: String, enum: PARCEL_STATUSES, required: true },
    note: { type: String, default: "" },
    updatedBy: { type: String, default: "" },
    at: { type: Date, default: Date.now },
  },
  { _id: false }
);

const parcelSchema = new mongoose.Schema(
  {
    trackingId: { type: String, required: true, unique: true, index: true },
    type: { type: String, enum: ["document", "non-document"], required: true },
    title: { type: String, required: true, trim: true },
    weight: { type: Number, default: 0, min: 0 },

    senderName: { type: String, required: true },
    senderEmail: { type: String, required: true, lowercase: true, index: true },
    senderPhone: { type: String, required: true },
    senderRegion: { type: String, required: true },
    senderDistrict: { type: String, required: true },
    senderAddress: { type: String, required: true },
    pickupInstruction: { type: String, default: "" },

    receiverName: { type: String, required: true },
    receiverPhone: { type: String, required: true },
    receiverRegion: { type: String, required: true },
    receiverDistrict: { type: String, required: true },
    receiverAddress: { type: String, required: true },
    deliveryInstruction: { type: String, default: "" },

    cost: { type: Number, required: true, min: 0 },
    costBreakdown: { type: [String], default: [] },
    paymentStatus: { type: String, enum: ["unpaid", "paid"], default: "unpaid" },
    paidAt: { type: Date, default: null },
    transactionId: { type: String, default: "" },

    deliveryStatus: { type: String, enum: PARCEL_STATUSES, default: "unpaid", index: true },
    assignedRider: {
      riderId: { type: mongoose.Schema.Types.ObjectId, ref: "Rider", default: null },
      name: { type: String, default: "" },
      email: { type: String, default: "" },
      phone: { type: String, default: "" },
    },
    trackingHistory: { type: [trackingEventSchema], default: [] },
  },
  { timestamps: true }
);

export const Parcel = mongoose.model("Parcel", parcelSchema);
