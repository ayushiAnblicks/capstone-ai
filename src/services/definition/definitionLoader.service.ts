import {
  findByIdentifier,
  getActiveDefinitions,
} from "../../repositories/definitionRegistry.repository.js";
import type { DefinitionRegistryRow } from "../../types/definition.types.js";
import { ApiError } from "../../utils/apiError.js";

const CACHE_TTL_MS = 60_000;

let cachedDefinitions: DefinitionRegistryRow[] | null = null;
let cachedAt = 0;

async function loadActiveDefinitions(): Promise<DefinitionRegistryRow[]> {
  const now = Date.now();
  if (cachedDefinitions && now - cachedAt < CACHE_TTL_MS) {
    return cachedDefinitions;
  }
  cachedDefinitions = await getActiveDefinitions();
  cachedAt = now;
  return cachedDefinitions;
}

/** All active definitions, used to build the dynamic classification prompt. */
export async function getActiveDefinitionList(): Promise<DefinitionRegistryRow[]> {
  const definitions = await loadActiveDefinitions();
  if (definitions.length === 0) {
    throw new ApiError(500, "No active document definitions configured in definition_registry");
  }
  return definitions;
}

/** Looks up a single definition by identifier, throwing a 422 if unsupported. */
export async function getDefinitionOrThrow(
  documentTypeIdentifier: string
): Promise<DefinitionRegistryRow> {
  const definitions = await loadActiveDefinitions();
  const cached = definitions.find((d) => d.documentTypeIdentifier === documentTypeIdentifier);
  if (cached) {
    return cached;
  }

  // Fall back to a direct DB lookup in case the in-memory cache is stale.
  const fresh = await findByIdentifier(documentTypeIdentifier);
  if (!fresh) {
    throw new ApiError(422, `No active definition found for document type '${documentTypeIdentifier}'`);
  }
  return fresh;
}
