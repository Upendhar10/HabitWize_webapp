import express from "express";
import cors from "cors";

import { errorHandler } from "@/middleware/error.middleware";
import { NotFoundError } from "@/errors/not-found.errors.js";

const app = express();

// Global Middleware
app.use(cors());
app.use(express.json());

// Routes

// If no route matched
app.use((_req, _res, next) => {
  next(new NotFoundError("Route not found"));
});

// Error Handling middleware
app.use(errorHandler);

export default app;
