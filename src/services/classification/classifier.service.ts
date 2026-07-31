import OpenAI from "openai";

import { config } from "../../config/env";

import { DocumentType } from "../../types/document.types";

const openai = new OpenAI({
  apiKey: config.openai.apiKey,
});

const DOCUMENT_TYPES = [
  DocumentType.INVOICE,

  DocumentType.PURCHASE_ORDER,

  DocumentType.UTILITY_BILL,

  DocumentType.BANK_STATEMENT,

  DocumentType.DRIVER_LICENSE,
];

export async function classifyDocument(ocrText: string): Promise<DocumentType> {
  const prompt = `
Classify the following document
into exactly ONE of these document types:

${DOCUMENT_TYPES.map((type) => `- ${type}`).join("\n")}

Return ONLY the document type.

Do not return JSON.

Do not return an explanation.

Document:
----------------------------

${ocrText}

----------------------------
`;

  const response = await openai.responses.create({
    model: config.openai.model,

    input: prompt,
  });

  const result = response.output_text.trim();

  const documentType = DOCUMENT_TYPES.find(
    (type) => type.toLowerCase() === result.toLowerCase(),
  );

  if (!documentType) {
    throw new Error(`Unsupported document classification: ${result}`);
  }

  return documentType;
}
