import express from "express";
import { Review } from "../models/Review.js";
import { asyncHandler } from "../middleware/error.js";
import { requireAuth } from "../middleware/auth.js";

export const reviewRouter = express.Router();

reviewRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const limit = Math.min(Number(req.query.limit) || 20, 100);
    res.json(await Review.find().sort({ createdAt: -1 }).limit(limit));
  })
);

reviewRouter.post(
  "/",
  requireAuth,
  asyncHandler(async (req, res) => {
    const { ratings, review, parcelId = "" } = req.body;
    if (!ratings || !review) return res.status(400).json({ message: "ratings and review are required" });

    const created = await Review.create({
      userName: req.user.name,
      userEmail: req.user.email,
      userPhotoURL: req.user.photoURL,
      ratings,
      review,
      parcelId,
    });
    res.status(201).json(created);
  })
);
