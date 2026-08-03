export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly details?: unknown;

  constructor(statusCode: number, message: string, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.details = details;
  }
}

export class ValidationApiError extends ApiError {
  constructor(message: string, details?: unknown) {
    super(422, message, details);
    this.name = "ValidationApiError";
  }
}
