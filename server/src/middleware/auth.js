import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

const getSecret = () => process.env.JWT_SECRET || "zapshift-dev-secret";

export const signToken = (user) =>
  jwt.sign({ sub: user._id.toString(), email: user.email, role: user.role }, getSecret(), {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

export const requireAuth = async (req, res, next) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ message: "Authorization token missing" });

  try {
    const payload = jwt.verify(token, getSecret());
    const user = await User.findById(payload.sub);
    if (!user) return res.status(401).json({ message: "User no longer exists" });
    req.user = user;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export const requireRole =
  (...roles) =>
  (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: "Authentication required" });
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "You do not have access to this resource" });
    }
    next();
  };
