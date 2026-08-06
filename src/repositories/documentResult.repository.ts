import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { pool } from "../config/db.js";
import { ApiError } from "../utils/apiError.js";

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

export interface PaginatedResult {
  data: DocumentResultRecord[];
  total: number;
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

/** Retrieves a paginated list of document results, ordered by most recent first. */
export async function findAll(
  page: number,
  limit: number
): Promise<PaginatedResult> {
  const offset = (page - 1) * limit;

  const [rows] = await pool.query<RowDataPacket[]>(
    "SELECT id, document_type, file_name, extracted_json, created_at FROM document_result ORDER BY created_at DESC LIMIT ? OFFSET ?",
    [limit, offset]
  );

  const [countRows] = await pool.query<RowDataPacket[]>(
    "SELECT COUNT(*) AS total FROM document_result"
  );

  const countRow = countRows[0] as { total: number } | undefined;
  const total = countRow?.total ?? 0;

  const data: DocumentResultRecord[] = rows.map((row) => {
    const r = row as RowDataPacket;
    return {
      id: r.id as number,
      documentType: r.document_type as string,
      fileName: r.file_name as string,
      extractedJson: typeof r.extracted_json === "string" ? JSON.parse(r.extracted_json) as Record<string, unknown> : r.extracted_json as Record<string, unknown>,
      createdAt: r.created_at as Date,
    };
  });

  return { data, total };
}

/** Retrieves a single document result by ID, or throws a 404 ApiError if not found. */
export async function findById(id: number): Promise<DocumentResultRecord> {
  const [rows] = await pool.query<RowDataPacket[]>(
    "SELECT id, document_type, file_name, extracted_json, created_at FROM document_result WHERE id = ?",
    [id]
  );

  if (rows.length === 0) {
    throw new ApiError(404, `Document with id ${id} not found.`);
  }

  const row = rows[0]!;
  return {
    id: row.id,
    documentType: row.document_type,
    fileName: row.file_name,
    extractedJson: typeof row.extracted_json === "string" ? JSON.parse(row.extracted_json) : row.extracted_json,
    createdAt: row.created_at,
  };
}
