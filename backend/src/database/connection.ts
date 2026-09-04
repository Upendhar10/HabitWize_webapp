import mongoose from "mongoose";
import { env } from "@/config/env.config.js";

export async function connectDatabase() {
  try {
    await mongoose.connect(env.mongoUrl);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed", error);
    throw error;
  }
}
