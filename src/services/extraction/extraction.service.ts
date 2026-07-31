import OpenAI from "openai";

import { config } from "../../config/env";

import { DocumentDefinition } from "../../types/document.types";

const openai = new OpenAI({
  apiKey: config.openai.apiKey,
});

export async function extractStructuredData(
  ocrText: string,

  definition: DocumentDefinition,
): Promise<Record<string, unknown>> {
  const prompt = `
You are a structured document
extraction system.

Document Type:
${definition.documentType}

Extraction Instructions:
${definition.prompt}

Rules:

1. Extract only information explicitly
   present in the document.

2. Do not invent or guess values.

3. If information is missing,
   return null.

4. Return data matching the
   provided JSON schema.

Document:
----------------------------

${ocrText}

----------------------------
`;

  const response = await openai.responses.create({
    model: config.openai.model,

    input: prompt,

    text: {
      format: {
        type: "json_schema",

        name: `${definition.documentType
          .toLowerCase()
          .replaceAll(" ", "_")}_extraction`,

        strict: true,

        schema: definition.schema,
      },
    },
  });

  const output = response.output_text;

  if (!output) {
    throw new Error("ChatGPT returned empty extraction result");
  }

  try {
    return JSON.parse(output);
  } catch {
    throw new Error("ChatGPT returned invalid JSON");
  }
}
