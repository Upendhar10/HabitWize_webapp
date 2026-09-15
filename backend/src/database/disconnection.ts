import { logger } from "@/config/logger.config";
import mongoose from "mongoose";

export async function disconnectDatabase() {
  try {
    await mongoose.disconnect();

    logger.info("MongoDB disconnected successfully");
  } catch (error) {
    logger.error("MongoDB disconnection failed");
    throw error;
  }
}

// Mongoose establishes and manages the MongoDB connections/pool for the application.
// So we don't need to manually find individual MongoDB connections and close them ourselves.
