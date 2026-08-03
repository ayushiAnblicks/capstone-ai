import { openaiClient } from "../../config/openaiClient.js";
import type { DefinitionRegistryRow } from "../../types/definition.types.js";
import { ApiError } from "../../utils/apiError.js";

const CLASSIFICATION_MODEL = "gpt-4o-mini";
const OCR_TEXT_PREVIEW_LENGTH = 8000;

interface ClassificationOutput {
  documentType: string;
}

/**
 * Classifies OCR text into one of the active document type identifiers.
 * The prompt and allowed values are built entirely from the definition
 * registry - no document type is hardcoded here.
 */
export async function classifyDocument(
  ocrText: string,
  definitions: DefinitionRegistryRow[]
): Promise<string> {
  const UNKNOWN_TYPE = "unknown";
  const allowedIdentifiers = [...definitions.map((d) => d.documentTypeIdentifier), UNKNOWN_TYPE];

  const definitionsSummary = definitions
    .map((d) => {
      const examples = d.classificationExamples.map((example) => `  - ${example}`).join("\n");
      return `${d.documentTypeIdentifier} (${d.displayName}):\n${examples}`;
    })
    .join("\n\n");

  const instructions = [
    "You are a document classification engine.",
    "Classify the provided document text into exactly one of the supported document types below.",
    "Use the classification hints as guidance for identifying each type.",
    `If the document does not clearly match any type below, classify it as "${UNKNOWN_TYPE}" rather than forcing the closest match.`,
    "",
    definitionsSummary,
  ].join("\n");

  const response = await openaiClient.responses.create({
    model: CLASSIFICATION_MODEL,
    instructions,
    input: ocrText.slice(0, OCR_TEXT_PREVIEW_LENGTH),
    text: {
      format: {
        type: "json_schema",
        name: "document_classification",
        strict: true,
        schema: {
          type: "object",
          properties: {
            documentType: {
              type: "string",
              enum: allowedIdentifiers,
            },
          },
          required: ["documentType"],
          additionalProperties: false,
        },
      },
    },
  });

  let parsed: ClassificationOutput;
  try {
    parsed = JSON.parse(response.output_text) as ClassificationOutput;
  } catch {
    throw new ApiError(502, "Classifier returned invalid JSON");
  }

  if (!allowedIdentifiers.includes(parsed.documentType)) {
    throw new ApiError(502, `Classifier returned an unsupported document type: ${parsed.documentType}`);
  }

  if (parsed.documentType === UNKNOWN_TYPE) {
    throw new ApiError(422, "Document does not match any supported document type");
  }

  return parsed.documentType;
}
