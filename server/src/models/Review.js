import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    userName: { type: String, required: true },
    userEmail: { type: String, required: true, lowercase: true },
    userPhotoURL: { type: String, default: "" },
    ratings: { type: Number, required: true, min: 1, max: 5 },
    review: { type: String, required: true },
    parcelId: { type: String, default: "" },
  },
  { timestamps: true }
);

export const Review = mongoose.model("Review", reviewSchema);
