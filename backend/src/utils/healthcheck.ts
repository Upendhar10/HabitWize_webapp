import type { Response } from "express";

export function healthcheck(res: Response) {
  return res.status(200).json({
    status: "OK",
    timestamp: new Date(),
    uptime: process.uptime(),
  });
}
