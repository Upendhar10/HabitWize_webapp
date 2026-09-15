import { Router } from "express";
import { NotFoundError } from "@/errors/not-found.errors.js";
import { healthcheck } from "@/utils/health.js";

const router = Router();

// Infra Routes
router.get("/infra/healthcheck", healthcheck);

// Application Routes

// If no route matched
router.use((_req, _res, next) => {
  next(new NotFoundError("Route not found"));
});

export default router;
