/**
 * A single document type definition loaded from `src/definitions/*.json`.
 * This is the sole source of truth the processing pipeline consults to
 * classify and extract a given document type - no document fields are
 * hardcoded in application code. `documentTypeIdentifier` is derived from
 * the definition's file name, not stored redundantly inside the file.
 */
export interface DefinitionRegistryRow {
  documentTypeIdentifier: string;
  displayName: string;
  classificationExamples: string[];
  extractionPrompt: string;
  jsonSchema: Record<string, unknown>;
  databaseTable: string;
  version: number;
  isActive: boolean;
}
