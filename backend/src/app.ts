import express from "express";
import cors from "cors";

import { errorHandler } from "@/middleware/error.middleware";

const app = express();

// Global Middleware
app.use(cors());
app.use(express.json());

// Routes

// Error Handling middleware
app.use(errorHandler);

export default app;
