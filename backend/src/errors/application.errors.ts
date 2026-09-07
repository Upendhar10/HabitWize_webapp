/*
  # represents a predictable application error.
  flow : JavaScript Error -> ApplicationError
  ApplicationError
  │
  ├── statusCode
  ├── errorCode
  ├── message
  └── isOperational
*/

import { ErrorCode } from "@/utils/types";

export class ApplicationError extends Error {
  public readonly statusCode: number;
  public readonly errorCode: ErrorCode;
  public readonly isOperational: boolean;

  constructor(statusCode: number, errorCode: ErrorCode, message: string) {
    super(message);
    this.name = this.constructor.name;

    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.isOperational = true;

    // Ensures instanceof works correctly across runtimes/transpilation targets.
    Object.setPrototypeOf(this, new.target.prototype);

    // Removes 'this constructor' from the stack trace (Node.js / V8).
    Error.captureStackTrace?.(this, this.constructor);
  }
}
