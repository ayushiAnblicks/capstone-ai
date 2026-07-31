/**
 * A single row from `definition_registry`, mapped to camelCase.
 * This is the sole source of truth the processing pipeline consults to
 * classify and extract a given document type - no document fields are
 * hardcoded in application code.
 */
export interface DefinitionRegistryRow {
  id: number;
  documentTypeIdentifier: string;
  displayName: string;
  classificationExamples: string[];
  extractionPrompt: string;
  jsonSchema: Record<string, unknown>;
  databaseTable: string;
  version: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
