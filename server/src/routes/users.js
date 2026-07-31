import express from "express";
import { User } from "../models/User.js";
import { asyncHandler } from "../middleware/error.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

export const userRouter = express.Router();

userRouter.use(requireAuth);

userRouter.patch(
  "/me",
  asyncHandler(async (req, res) => {
    const { name, photoURL, phone } = req.body;
    const updates = {};
    if (name !== undefined) updates.name = name;
    if (photoURL !== undefined) updates.photoURL = photoURL;
    if (phone !== undefined) updates.phone = phone;

    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true });
    res.json({ user: user.toPublic() });
  })
);

userRouter.get(
  "/",
  requireRole("admin"),
  asyncHandler(async (req, res) => {
    const { search, role } = req.query;
    const filter = {};
    if (role) filter.role = role;
    if (search) filter.email = { $regex: String(search), $options: "i" };
    const users = await User.find(filter).sort({ createdAt: -1 }).limit(100);
    res.json(users.map((user) => user.toPublic()));
  })
);

userRouter.patch(
  "/:id/role",
  requireRole("admin"),
  asyncHandler(async (req, res) => {
    const { role } = req.body;
    if (!["user", "rider", "admin"].includes(role)) {
      return res.status(400).json({ message: "role must be user, rider or admin" });
    }
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ user: user.toPublic() });
  })
);
