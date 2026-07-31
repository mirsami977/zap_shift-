import express from "express";
import bcrypt from "bcryptjs";
import { User } from "../models/User.js";
import { asyncHandler } from "../middleware/error.js";
import { requireAuth, signToken } from "../middleware/auth.js";

export const authRouter = express.Router();

authRouter.post(
  "/register",
  asyncHandler(async (req, res) => {
    const { name, email, password, photoURL = "", phone = "" } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "name, email and password are required" });
    }
    if (String(password).length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const existing = await User.findOne({ email: String(email).toLowerCase() });
    if (existing) return res.status(409).json({ message: "An account with this email already exists" });

    const user = await User.create({
      name,
      email,
      photoURL,
      phone,
      passwordHash: await bcrypt.hash(password, 10),
      lastLoginAt: new Date(),
    });

    res.status(201).json({ token: signToken(user), user: user.toPublic() });
  })
);

authRouter.post(
  "/login",
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "email and password are required" });

    const user = await User.findOne({ email: String(email).toLowerCase() });
    if (!user || !(await bcrypt.compare(String(password), user.passwordHash))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    user.lastLoginAt = new Date();
    await user.save();

    res.json({ token: signToken(user), user: user.toPublic() });
  })
);

authRouter.get(
  "/me",
  requireAuth,
  asyncHandler(async (req, res) => {
    res.json({ user: req.user.toPublic() });
  })
);
