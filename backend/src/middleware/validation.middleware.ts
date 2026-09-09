// # Request Validation Middleware

// This middleware runs Zod against the incoming request

import type { RequestHandler } from "express";
import type { ZodType } from "zod";

import { ValidationError } from "@/errors/validation.error.js";

export function validate(schema: ZodType): RequestHandler {
  return (req, _res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return next(
        new ValidationError(
          "Request validation failed",
          // result.error outputs a ZodError
          // Basically converting zodError into ValidationError
          result.error.issues,
        ),
      );
    }

    // Rather than throwing the Zod parsed result away,
    // it's better to put the parsed result back into the request.
    req.body = result.data;

    next();
  };
}

/*
    Future validations
    req.body
    req.params
    req.query
    req.headers
*/
