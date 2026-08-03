import { readFileSync, readdirSync, watch } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { DefinitionRegistryRow } from "../../types/definition.types.js";
import { ApiError } from "../../utils/apiError.js";

const DEFINITIONS_DIR = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "..",
  "definitions"
);

let cachedDefinitions: DefinitionRegistryRow[] | null = null;

// Any add/change/remove under definitions/ invalidates the cache immediately.
watch(DEFINITIONS_DIR, () => {
  cachedDefinitions = null;
});

type DefinitionFileContents = Omit<DefinitionRegistryRow, "documentTypeIdentifier">;

function loadDefinitionsFromDisk(): DefinitionRegistryRow[] {
  const files = readdirSync(DEFINITIONS_DIR).filter((file) => file.endsWith(".json"));

  const definitions: DefinitionRegistryRow[] = [];
  for (const file of files) {
    try {
      const raw = readFileSync(path.join(DEFINITIONS_DIR, file), "utf8");
      const parsed = JSON.parse(raw) as DefinitionFileContents;
      definitions.push({ documentTypeIdentifier: path.basename(file, ".json"), ...parsed });
    } catch (error) {
      // A malformed definition file should not take down the whole registry.
      console.error(`Skipping invalid definition file '${file}':`, error);
    }
  }
  return definitions;
}

function getAllDefinitions(): DefinitionRegistryRow[] {
  if (!cachedDefinitions) {
    cachedDefinitions = loadDefinitionsFromDisk();
  }
  return cachedDefinitions;
}

/** All active definitions, used to build the dynamic classification prompt. */
export function getActiveDefinitionList(): DefinitionRegistryRow[] {
  const active = getAllDefinitions().filter((d) => d.isActive);
  if (active.length === 0) {
    throw new ApiError(500, "No active document definitions found under src/definitions");
  }
  return active;
}

/** Looks up a single active definition by identifier, throwing a 422 if unsupported. */
export function getDefinitionOrThrow(documentTypeIdentifier: string): DefinitionRegistryRow {
  const match = getAllDefinitions().find(
    (d) => d.documentTypeIdentifier === documentTypeIdentifier && d.isActive
  );
  if (!match) {
    throw new ApiError(422, `No active definition found for document type '${documentTypeIdentifier}'`);
  }
  return match;
}

