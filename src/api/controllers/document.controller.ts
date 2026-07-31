import { Request, Response } from "express";

import { processDocument } from "../../services/document-processing.service";

export async function processDocumentController(
  req: Request,

  res: Response,
) {
  if (!req.file) {
    return res.status(400).json({
      success: false,

      message: "File is required",
    });
  }

  try {
    const result = await processDocument(
      req.file.path,

      req.file.originalname,
    );

    return res.status(200).json({
      success: true,

      data: result,
    });
  } catch (error) {
    console.error("Document processing failed:", error);

    return res.status(500).json({
      success: false,

      message:
        error instanceof Error ? error.message : "Document processing failed",
    });
  }
}
