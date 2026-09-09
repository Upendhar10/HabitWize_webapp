import type { Response } from "express";
import { ApiSuccessResponse } from "@/utils/types.js";

export function sendSuccessResponse<T>(
  res: Response,
  data: T,
  message = "Success",
  statusCode = 200,
) {
  const response: ApiSuccessResponse<T> = {
    success: true,
    message,
    data,
  };

  return res.status(statusCode).json(response);
}
