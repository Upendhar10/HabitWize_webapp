import mongoose from "mongoose";
import { env } from "@/config/env.config.js";
import { logger } from "@/config/logger.config";

export async function connectDatabase() {
  try {
    await mongoose.connect(env.mongoUrl);
    logger.info("MongoDB connected successfully");
  } catch (error) {
    logger.error("MongoDB connection failed");
    throw error;
  }
}
