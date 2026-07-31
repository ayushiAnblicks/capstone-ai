import type { DocumentResultRecord } from "../../repositories/documentResult.repository.js";
import { insertResult } from "../../repositories/documentResult.repository.js";
import { classifyDocument } from "../classification/classifier.service.js";
import { getActiveDefinitionList, getDefinitionOrThrow } from "../definition/definitionLoader.service.js";
import { extractStructuredData } from "../extraction/extraction.service.js";
import { extractText } from "../ocr/datalab.service.js";
import { validateExtractedData } from "../validation/validation.service.js";

export interface ProcessDocumentInput {
  buffer: Buffer;
  originalName: string;
  mimeType: string;
}

/**
 * Orchestrates the full pipeline: OCR -> classify -> load definition ->
 * extract -> validate -> persist. This is the single generic engine that
 * replaces per-document-type conditional logic.
 */
export async function processDocument(
  input: ProcessDocumentInput
): Promise<DocumentResultRecord> {
  const ocrText = await extractText({
    buffer: input.buffer,
    fileName: input.originalName,
    mimeType: input.mimeType,
  });

  const definitions = await getActiveDefinitionList();
  const documentType = await classifyDocument(ocrText, definitions);
  const definition = await getDefinitionOrThrow(documentType);

  const extractedData = await extractStructuredData(ocrText, definition);
  validateExtractedData(definition, extractedData);

  return insertResult({
    documentType: definition.documentTypeIdentifier,
    fileName: input.originalName,
    extractedJson: extractedData,
  });
}
