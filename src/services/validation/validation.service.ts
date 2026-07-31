import { Ajv } from "ajv";
import type { ValidateFunction } from "ajv";
import type { DefinitionRegistryRow } from "../../types/definition.types.js";
import { ValidationApiError } from "../../utils/apiError.js";

const ajv = new Ajv({ allErrors: true, strict: false });
const validatorCache = new Map<string, ValidateFunction>();

function getValidator(definition: DefinitionRegistryRow): ValidateFunction {
  const cacheKey = `${definition.documentTypeIdentifier}:${definition.version}`;
  let validator = validatorCache.get(cacheKey);
  if (!validator) {
    validator = ajv.compile(definition.jsonSchema);
    validatorCache.set(cacheKey, validator);
  }
  return validator;
}

/** Validates extracted data against the definition's JSON Schema, throwing on failure. */
export function validateExtractedData(
  definition: DefinitionRegistryRow,
  data: Record<string, unknown>
): void {
  const validate = getValidator(definition);
  const valid = validate(data);

  if (!valid) {
    const messages = (validate.errors ?? []).map((err) =>
      `${err.instancePath || "root"} ${err.message ?? ""}`.trim()
    );
    throw new ValidationApiError(
      `Extracted data failed schema validation for '${definition.documentTypeIdentifier}'`,
      messages
    );
  }
}
