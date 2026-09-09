// Represents validation failure inside the application

import { ApplicationError } from "@/errors/application.errors.js";

export class ValidationError extends ApplicationError {
  constructor(
    message: string,
    details?: unknown, // allows Zod issues actually make it to the error middleware.
  ) {
    super(400, "VALIDATION_ERROR", message, details);
  }
}
