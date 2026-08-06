import type { NextFunction, Request, Response } from "express";
import { processDocument } from "../../services/pipeline/documentProcessing.service.js";
import { findAll, findById } from "../../repositories/documentResult.repository.js";
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

export async function getDocumentsHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const page = Math.max(1, parseInt(req.query.page as string, 10) || 1);
    const limit = Math.max(1, Math.min(100, parseInt(req.query.limit as string, 10) || 20));

    const { data, total } = await findAll(page, limit);
    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function getDocumentByIdHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const rawId = req.params.id as string;
    const id = parseInt(rawId, 10);

    if (isNaN(id)) {
      throw new ApiError(400, "Invalid document id. Must be a numeric value.");
    }

    const result = await findById(id);

    res.status(200).json({ data: result });
  } catch (error) {
    next(error);
  }
}
