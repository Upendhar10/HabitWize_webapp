import "dotenv/config";
import { env } from "@/config/env.config.js";

import app from "@/app";
import { connectDatabase } from "@/database/connection.js";
import { logger } from "@/config/logger.config.js";

const PORT = env.port;

async function startServer() {
  try {
    await connectDatabase();
    app.listen(PORT, () => {
      logger.info(
        {
          env: env.nodeEnv,
          port: env.port,
        },
        "Server started successfully",
      );
    });
  } catch (error) {
    if (error instanceof Error) {
      logger.error(
        {
          type: error.name,
          message: error.message,
        },
        "Failed to start the application",
      );
    } else {
      logger.error("An unknown error occurred while starting the application");
    }
    process.exit(1);
  }
}

startServer();
