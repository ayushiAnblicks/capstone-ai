import multer from "multer";
import type { NextFunction, Request, Response } from "express";
import { ApiError } from "../../utils/apiError.js";

/** Centralized error handler mapping ApiError/MulterError to structured JSON responses. */
export function errorHandlerMiddleware(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      error: {
        message: err.message,
        details: err.details ?? null,
      },
    });
    return;
  }

  if (err instanceof multer.MulterError) {
    res.status(400).json({ error: { message: err.message } });
    return;
  }

  console.error(err);
  res.status(500).json({
    error: { message: "Internal server error" },
  });
}
