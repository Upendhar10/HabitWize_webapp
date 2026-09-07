/*
  # Used whenever a requested resource doesn't exist.
  Eg: user not found
*/

import { ApplicationError } from "@/errors/application.errors";

export class NotFoundError extends ApplicationError {
  constructor(message = "Resource not found") {
    super(404, "RESOURCE_NOT_FOUND", message);
  }
}
