import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { connectDB } from "./config/db.js";
import { Warehouse } from "./models/Warehouse.js";
import { Review } from "./models/Review.js";
import { User } from "./models/User.js";
import { Rider } from "./models/Rider.js";
import { Parcel } from "./models/Parcel.js";

const here = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.resolve(here, "../../public");

const readJson = async (file) => {
  try {
    const filePath = path.join(publicDir, file);
    const content = await fs.readFile(filePath, "utf8");
    return JSON.parse(content);
  } catch (err) {
    console.warn(`Could not read ${file}: ${err.message}`);
    return [];
  }
};

export const seedDatabase = async (force = false) => {
  try {
    const userCount = await User.countDocuments();
    if (!force && userCount > 0) {
      console.log("Database already contains data, skipping seed.");
      return;
    }

    console.log("Seeding database with default data...");

    // 1. Seed Warehouses
    const warehouses = await readJson("warehouses.json");
    if (warehouses.length > 0) {
      await Warehouse.deleteMany({});
      await Warehouse.insertMany(warehouses);
      console.log(`Seeded ${warehouses.length} warehouses`);
    }

    // 2. Seed Reviews
    const reviews = await readJson("reviews.json");
    if (reviews.length > 0) {
      await Review.deleteMany({});
      await Review.insertMany(
        reviews.map((review) => ({
          userName: review.userName || review.name || "Customer",
          userEmail: review.user_email || review.email || "customer@example.com",
          userPhotoURL: review.user_photoURL || review.photo || "",
          ratings: Math.max(1, Math.round(Number(review.ratings) || 5)),
          review: review.review || review.comment || "Great delivery service!",
          parcelId: review.parcel_id || "",
        }))
      );
      console.log(`Seeded ${reviews.length} reviews`);
    }

    // 3. Seed Users (Admin, Rider, Demo User)
    const passwordHash = await bcrypt.hash("123456", 10);
    const adminPasswordHash = await bcrypt.hash("admin123", 10);

    const adminEmail = (process.env.ADMIN_EMAIL || "admin@zapshift.com").toLowerCase();

    // Ensure admin user exists
    let admin = await User.findOne({ email: adminEmail });
    if (!admin) {
      admin = await User.create({
        name: "ZapShift Admin",
        email: adminEmail,
        passwordHash: adminPasswordHash,
        role: "admin",
        phone: "01711000000",
      });
      console.log(`Created admin user: ${adminEmail} (password: admin123)`);
    }

    // Demo Rider user
    const riderEmail = "rider@zapshift.com";
    let riderUser = await User.findOne({ email: riderEmail });
    if (!riderUser) {
      riderUser = await User.create({
        name: "Rahim Delivery Rider",
        email: riderEmail,
        passwordHash,
        role: "rider",
        phone: "01812345678",
      });
      console.log(`Created demo rider user: ${riderEmail} (password: 123456)`);
    }

    // Create Rider application & profile
    let riderProfile = await Rider.findOne({ email: riderEmail });
    if (!riderProfile) {
      riderProfile = await Rider.create({
        name: "Rahim Delivery Rider",
        email: riderEmail,
        phone: "01812345678",
        age: 28,
        nid: "1995123456789",
        region: "Dhaka",
        district: "Dhaka",
        bikeBrand: "Yamaha FZ",
        bikeRegistration: "DHAKA-METRO-LA-12-3456",
        note: "Experienced courier rider in Dhaka central",
        status: "approved",
        workStatus: "available",
      });
      console.log(`Created approved rider profile for ${riderEmail}`);
    }

    // Demo Normal User
    const demoUserEmail = "user@zapshift.com";
    let demoUser = await User.findOne({ email: demoUserEmail });
    if (!demoUser) {
      demoUser = await User.create({
        name: "Samiul Islam",
        email: demoUserEmail,
        passwordHash,
        role: "user",
        phone: "01912345678",
      });
      console.log(`Created demo customer user: ${demoUserEmail} (password: 123456)`);
    }

    // 4. Seed Demo Parcels
    const parcelCount = await Parcel.countDocuments();
    if (parcelCount === 0) {
      await Parcel.create([
        {
          trackingId: "ZP-1001-DHAKA",
          type: "document",
          title: "Important Legal Documents",
          weight: 0.5,
          senderName: "Samiul Islam",
          senderEmail: demoUserEmail,
          senderPhone: "01912345678",
          senderRegion: "Dhaka",
          senderDistrict: "Dhaka",
          senderAddress: "House 12, Road 5, Dhanmondi",
          receiverName: "Kareem Chowdhury",
          receiverPhone: "01788888888",
          receiverRegion: "Chattogram",
          receiverDistrict: "Chattogram",
          receiverAddress: "GEC Circle, Nasirabad",
          cost: 120,
          costBreakdown: ["Base fee (document): 60 BDT", "Inter-district delivery: 60 BDT"],
          paymentStatus: "paid",
          paidAt: new Date(),
          transactionId: "TXN-8823190A",
          deliveryStatus: "in_transit",
          assignedRider: {
            riderId: riderProfile._id,
            name: riderProfile.name,
            email: riderProfile.email,
            phone: riderProfile.phone,
          },
          trackingHistory: [
            { status: "unpaid", note: "Parcel booked", updatedBy: demoUserEmail, at: new Date(Date.now() - 86400000 * 2) },
            { status: "paid", note: "Payment received (TXN-8823190A)", updatedBy: demoUserEmail, at: new Date(Date.now() - 86400000) },
            { status: "rider_assigned", note: "Rider assigned: Rahim Delivery Rider", updatedBy: adminEmail, at: new Date(Date.now() - 43200000) },
            { status: "in_transit", note: "Parcel picked up by rider and in transit", updatedBy: riderEmail, at: new Date() },
          ],
        },
        {
          trackingId: "ZP-1002-SYLHET",
          type: "non-document",
          title: "Electronics & Gadgets Box",
          weight: 2.5,
          senderName: "Samiul Islam",
          senderEmail: demoUserEmail,
          senderPhone: "01912345678",
          senderRegion: "Dhaka",
          senderDistrict: "Dhaka",
          senderAddress: "Mirpur 10, Dhaka",
          receiverName: "Anisur Rahman",
          receiverPhone: "01677777777",
          receiverRegion: "Sylhet",
          receiverDistrict: "Sylhet",
          receiverAddress: "Zindabazar, Sylhet",
          cost: 250,
          costBreakdown: ["Base fee (non-document): 100 BDT", "Weight charge (2.5 kg): 90 BDT", "Inter-district: 60 BDT"],
          paymentStatus: "unpaid",
          deliveryStatus: "unpaid",
          trackingHistory: [
            { status: "unpaid", note: "Parcel booked", updatedBy: demoUserEmail, at: new Date() },
          ],
        },
      ]);
      console.log("Seeded demo parcels!");
    }

    console.log("Database seed completed successfully!");
  } catch (err) {
    console.error("Error during database seed:", err);
  }
};

const isDirectRun = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];
if (isDirectRun) {
  connectDB()
    .then(() => seedDatabase(true))
    .then(() => mongoose.disconnect())
    .catch((err) => {
      console.error("Seed execution failed:", err);
      process.exit(1);
    });
}
