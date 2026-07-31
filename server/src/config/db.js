import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { seedDatabase } from "../seed.js";

let memoryServer = null;

export const connectDB = async () => {
  if (process.env.MONGODB_URI) {
    try {
      const conn = await mongoose.connect(process.env.MONGODB_URI, {
        serverSelectionTimeoutMS: 4000,
      });
      console.log(`MongoDB Connected: ${conn.connection.host}`);
      await seedDatabase();
      return;
    } catch (error) {
      console.warn(`Could not connect to MONGODB_URI (${error.message}). Falling back to In-Memory MongoDB...`);
    }
  }

  try {
    memoryServer = await MongoMemoryServer.create();
    const uri = memoryServer.getUri();
    await mongoose.connect(uri);
    console.log(`In-Memory MongoDB Started & Connected at ${uri}`);
    await seedDatabase();
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};
