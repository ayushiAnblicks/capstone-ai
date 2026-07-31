import fs from "fs";

import path from "path";

import { DocumentDefinition, DocumentType } from "../../types/document.types";

function getDefinitionFileName(documentType: DocumentType): string {
  const definitionMap: Record<DocumentType, string> = {
    [DocumentType.INVOICE]: "invoice.json",

    [DocumentType.PURCHASE_ORDER]: "purchase-order.json",

    [DocumentType.UTILITY_BILL]: "utility-bill.json",

    [DocumentType.BANK_STATEMENT]: "bank-statement.json",

    [DocumentType.DRIVER_LICENSE]: "driver-license.json",
  };

  return definitionMap[documentType];
}

export function loadDefinition(documentType: DocumentType): DocumentDefinition {
  const fileName = getDefinitionFileName(documentType);

  const filePath = path.join(
    process.cwd(),

    "src",

    "definitions",

    fileName,
  );

  if (!fs.existsSync(filePath)) {
    throw new Error(`Definition file not found: ${fileName}`);
  }

  const content = fs.readFileSync(
    filePath,

    "utf-8",
  );

  return JSON.parse(content);
}
