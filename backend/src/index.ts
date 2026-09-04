import "dotenv/config";
import { env } from "@/config/env.config.js";

import app from "@/app";
import { connectDatabase } from "@/database/connection.js";

const PORT = env.port;

async function startServer() {
  try {
    await connectDatabase();
    app.listen(PORT, () => {
      console.log(`Server is running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed", error);
  }
}

startServer();
