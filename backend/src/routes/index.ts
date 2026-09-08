import { Router } from "express";
import { NotFoundError } from "@/errors/not-found.errors.js";
import { healthcheck } from "@/utils/healthcheck.js";

const router = Router();

router.get("/healthcheck", healthcheck);

// If no route matched
router.use((_req, _res, next) => {
  next(new NotFoundError("Route not found"));
});

export default router;
