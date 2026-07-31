import { db } from "../db";

export async function saveDocumentResult(
  documentType: string,

  fileName: string,

  extractedJson: Record<string, unknown>,
): Promise<number> {
  const [result] = await db.execute(
    `
      INSERT INTO document_result
      (
        document_type,
        file_name,
        extracted_json
      )

      VALUES (?, ?, ?)
    `,
    [documentType, fileName, JSON.stringify(extractedJson)],
  );

  const insertResult = result as {
    insertId: number;
  };

  return insertResult.insertId;
}
