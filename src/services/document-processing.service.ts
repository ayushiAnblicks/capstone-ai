import fs from "fs/promises";

import { extractText } from "./ocr/datalab.service";

import { classifyDocument } from "./classification/classifier.service";

import { loadDefinition } from "./definition/definition.loader";

import { extractStructuredData } from "./extraction/extraction.service";

import { validateJson } from "./validation/validation.service";

import { saveDocumentResult } from "../database/repositories/document.repository";

import { ProcessDocumentResult } from "../types/document.types";

// Upload
//   ↓
// OCR
//   ↓
// Classification
//   ↓
// Definition Loader
//   ↓
// Extraction
//   ↓
// Validation
//   ↓
// MySQL
export async function processDocument(
  filePath: string,

  fileName: string,
): Promise<ProcessDocumentResult> {
  try {
    // ========================================
    // STEP 1: OCR
    // ========================================

    console.log(`[1/6] Starting OCR: ${fileName}`);

    const ocrResult = await extractText(filePath);

    if (!ocrResult.text || !ocrResult.text.trim()) {
      throw new Error("OCR returned empty text");
    }

    console.log("[1/6] OCR completed");

    // ========================================
    // STEP 2: CLASSIFICATION
    // ========================================

    console.log("[2/6] Classifying document");

    const documentType = await classifyDocument(ocrResult.text);

    console.log(`[2/6] Document Type: ${documentType}`);

    // ========================================
    // STEP 3: LOAD DEFINITION
    // ========================================

    console.log("[3/6] Loading definition");

    const definition = loadDefinition(documentType);

    // ========================================
    // STEP 4: STRUCTURED EXTRACTION
    // ========================================

    console.log("[4/6] Extracting structured data");

    const extractedJson = await extractStructuredData(
      ocrResult.text,

      definition,
    );

    // ========================================
    // STEP 5: VALIDATION
    // ========================================

    console.log("[5/6] Validating JSON");

    const validation = validateJson(
      extractedJson,

      definition.schema,
    );

    if (!validation.valid) {
      console.error("Validation errors:", validation.errors);

      throw new Error("Extracted JSON failed schema validation");
    }

    // ========================================
    // STEP 6: SAVE TO DATABASE
    // ========================================

    console.log("[6/6] Saving result to MySQL");

    await saveDocumentResult(
      documentType,

      fileName,

      extractedJson,
    );

    console.log("Document processing completed");

    return {
      documentType,

      fileName,

      extractedJson,
    };
  } finally {
    // ========================================
    // CLEANUP UPLOADED FILE
    // ========================================

    try {
      await fs.unlink(filePath);
    } catch {
      console.warn(`Could not delete temporary file: ${filePath}`);
    }
  }
}
