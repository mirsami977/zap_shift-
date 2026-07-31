import express from "express";
import cors from "cors";
import morgan from "morgan";
import { authRouter } from "./routes/auth.js";
import { userRouter } from "./routes/users.js";
import { parcelRouter } from "./routes/parcels.js";
import { riderRouter } from "./routes/riders.js";
import { reviewRouter } from "./routes/reviews.js";
import { warehouseRouter } from "./routes/warehouses.js";
import { paymentRouter } from "./routes/payments.js";
import { errorHandler } from "./middleware/error.js";

export const createApp = () => {
  const app = express();

  app.use(cors({ origin: true, credentials: true }));
  app.use(express.json({ limit: "10mb" }));
  app.use(morgan("dev"));

  app.get("/api/health", (req, res) => res.json({ status: "ok", uptime: process.uptime() }));
  app.use("/api/auth", authRouter);
  app.use("/api/users", userRouter);
  app.use("/api/parcels", parcelRouter);
  app.use("/api/riders", riderRouter);
  app.use("/api/reviews", reviewRouter);
  app.use("/api/warehouses", warehouseRouter);
  app.use("/api/payments", paymentRouter);

  app.use("/api/*all", (req, res) => {
    res.status(404).json({ message: `API route not found: ${req.originalUrl}` });
  });

  app.use(errorHandler);

  return app;
};
