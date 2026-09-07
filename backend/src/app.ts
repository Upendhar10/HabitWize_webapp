import express from "express";
import cors from "cors";
import helmet from "helmet";

import { errorHandler } from "@/middleware/error.middleware";
import { NotFoundError } from "@/errors/not-found.errors.js";
import { env } from "@/config/env.config.js";
import { limiter } from "@/config/rate-limiter.config.js";

const app = express();

// Global Security Middleware
app.use(helmet());
app.use(
  cors({
    origin: env.clientUrl,
    credentials: true,
  }),
);

app.use(limiter);

// Request Parsing middlewares (Global)
app.use(
  express.json({
    limit: "10kb",
  }),
);

// Request Parsing middlewares (Global)
app.use(
  express.json({
    limit: "10kb",
  }),
);

// Routes

// If no route matched
app.use((_req, _res, next) => {
  next(new NotFoundError("Route not found"));
});

// Error Handling middleware
app.use(errorHandler);

export default app;
