export type ErrorCode =
  | "VALIDATION_ERROR"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "RESOURCE_NOT_FOUND"
  | "RESOURCE_CONFLICT"
  | "INTERNAL_SERVER_ERROR";

export interface ApiSuccessResponse<T> {
  success: true;
  message: string;
  data: T;
}
