import type { ErrorRequestHandler } from "express";

import { ApplicationError } from "@/errors/application.errors.js";

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof ApplicationError) {
    return res.status(error.statusCode).json({
      success: false,
      error: {
        code: error.errorCode,
        message: error.message,
      },
    });
  }

  console.error(error);

  return res.status(500).json({
    success: false,
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: "Something went wrong.",
    },
  });
};

/*
  ErrorRequestHandler : 
    - Instead of manually writing types for every parameter
    - (error:unknown, req:Request, res: Response, next: NextFunction)
    - we let Express provide the correct type.
    
  _req and _res :
    - '_' communicates to readers (and satisfies many linters) that they're intentionally unused.
  
*/
