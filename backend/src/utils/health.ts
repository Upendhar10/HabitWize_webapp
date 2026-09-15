import type { Request, Response } from "express";

export function healthcheck(_req: Request, res: Response) {
  return res.status(200).json({
    status: "OK",
    timestamp: new Date(),
    uptime: process.uptime(),
  });
}
