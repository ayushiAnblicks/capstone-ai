import type { RowDataPacket } from "mysql2";
import { pool } from "../config/db.js";
import type { DefinitionRegistryRow } from "../types/definition.types.js";

interface DefinitionRegistryRecord extends RowDataPacket {
  id: number;
  document_type_identifier: string;
  display_name: string;
  classification_examples: string[];
  extraction_prompt: string;
  json_schema: Record<string, unknown>;
  database_table: string;
  version: number;
  is_active: number;
  created_at: Date;
  updated_at: Date;
}

function mapRow(row: DefinitionRegistryRecord): DefinitionRegistryRow {
  return {
    id: row.id,
    documentTypeIdentifier: row.document_type_identifier,
    displayName: row.display_name,
    classificationExamples: row.classification_examples,
    extractionPrompt: row.extraction_prompt,
    jsonSchema: row.json_schema,
    databaseTable: row.database_table,
    version: row.version,
    isActive: Boolean(row.is_active),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/** All active document type definitions, used to build the classification prompt. */
export async function getActiveDefinitions(): Promise<DefinitionRegistryRow[]> {
  const [rows] = await pool.query<DefinitionRegistryRecord[]>(
    "SELECT * FROM definition_registry WHERE is_active = 1 ORDER BY document_type_identifier ASC"
  );
  return rows.map(mapRow);
}

/** A single active definition by its identifier, or null if not found/inactive. */
export async function findByIdentifier(
  documentTypeIdentifier: string
): Promise<DefinitionRegistryRow | null> {
  const [rows] = await pool.query<DefinitionRegistryRecord[]>(
    "SELECT * FROM definition_registry WHERE document_type_identifier = ? AND is_active = 1 LIMIT 1",
    [documentTypeIdentifier]
  );
  const row = rows[0];
  return row ? mapRow(row) : null;
}
