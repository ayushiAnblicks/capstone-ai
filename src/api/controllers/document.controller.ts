import type { NextFunction, Request, Response } from "express";
import { processDocument } from "../../services/pipeline/documentProcessing.service.js";
import { ApiError } from "../../utils/apiError.js";

export async function uploadDocumentHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.file) {
      throw new ApiError(400, "No file uploaded. Attach a file under the 'file' field.");
    }

    const result = await processDocument({
      buffer: req.file.buffer,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
    });

    res.status(201).json({ data: result });
  } catch (error) {
    next(error);
  }
}
