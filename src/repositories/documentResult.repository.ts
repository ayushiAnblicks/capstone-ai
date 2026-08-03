import type { ResultSetHeader } from "mysql2";
import { pool } from "../config/db.js";

export interface InsertDocumentResultInput {
  documentType: string;
  fileName: string;
  extractedJson: Record<string, unknown>;
}

export interface DocumentResultRecord {
  id: number;
  documentType: string;
  fileName: string;
  extractedJson: Record<string, unknown>;
  createdAt: Date;
}

/** Persists the final normalized JSON for a processed document. */
export async function insertResult(
  input: InsertDocumentResultInput
): Promise<DocumentResultRecord> {
  const [result] = await pool.query<ResultSetHeader>(
    "INSERT INTO document_result (document_type, file_name, extracted_json) VALUES (?, ?, CAST(? AS JSON))",
    [input.documentType, input.fileName, JSON.stringify(input.extractedJson)]
  );

  return {
    id: result.insertId,
    documentType: input.documentType,
    fileName: input.fileName,
    extractedJson: input.extractedJson,
    createdAt: new Date(),
  };
}
