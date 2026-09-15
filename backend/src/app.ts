import express from "express";
import cors from "cors";
import helmet from "helmet";

import { errorHandler } from "@/middleware/error.middleware";
import { env } from "@/config/env.config.js";
import { limiter } from "@/config/rate-limiter.config.js";
import apiRouter from "@/routes/index.js";

const app = express();

// Global Security Middleware
app.use(helmet());
app.use(
  cors({
    origin: env.clientUrl,
    credentials: true,
  }),
);

// Request Parsing middlewares with Rate Limiting
app.use(limiter);
app.use(
  express.json({
    limit: "10kb",
  }),
);

// Routes
app.use("/api/v1", apiRouter);

// Error Handling middleware
app.use(errorHandler);

export default app;
