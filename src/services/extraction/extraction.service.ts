import { openaiClient } from "../../config/openaiClient.js";
import type { DefinitionRegistryRow } from "../../types/definition.types.js";
import { ApiError } from "../../utils/apiError.js";

const EXTRACTION_MODEL = "gpt-4o";

/**
 * Runs structured extraction against the OCR text using the matched
 * definition's prompt and JSON Schema. No document fields are hardcoded -
 * both the instructions and the response schema come from the registry.
 */
export async function extractStructuredData(
  ocrText: string,
  definition: DefinitionRegistryRow
): Promise<Record<string, unknown>> {
  const response = await openaiClient.responses.create({
    model: EXTRACTION_MODEL,
    instructions: definition.extractionPrompt,
    input: ocrText,
    text: {
      format: {
        type: "json_schema",
        name: `${definition.documentTypeIdentifier}_extraction`,
        strict: true,
        schema: definition.jsonSchema,
      },
    },
  });

  try {
    return JSON.parse(response.output_text) as Record<string, unknown>;
  } catch {
    throw new ApiError(502, "Extraction model returned invalid JSON");
  }
}
