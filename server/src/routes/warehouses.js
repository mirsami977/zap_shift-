import express from "express";
import { Warehouse } from "../models/Warehouse.js";
import { asyncHandler } from "../middleware/error.js";

export const warehouseRouter = express.Router();

warehouseRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const { search, region } = req.query;
    const filter = {};
    if (region) filter.region = region;
    if (search) {
      const regex = { $regex: String(search), $options: "i" };
      filter.$or = [{ district: regex }, { city: regex }, { region: regex }, { covered_area: regex }];
    }
    res.json(await Warehouse.find(filter).sort({ region: 1, district: 1 }));
  })
);

warehouseRouter.get(
  "/regions",
  asyncHandler(async (req, res) => {
    const regions = await Warehouse.aggregate([
      { $group: { _id: "$region", districts: { $addToSet: "$district" } } },
      { $sort: { _id: 1 } },
    ]);
    res.json(regions.map(({ _id, districts }) => ({ region: _id, districts: districts.sort() })));
  })
);
