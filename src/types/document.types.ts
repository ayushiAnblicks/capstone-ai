export enum DocumentType {
  INVOICE = "Invoice",

  PURCHASE_ORDER = "Purchase Order",

  UTILITY_BILL = "Utility Bill",

  BANK_STATEMENT = "Bank Statement",

  DRIVER_LICENSE = "Driver License",
}

export interface OCRResult {
  text: string;

  metadata?: Record<string, unknown>;
}

export interface DocumentDefinition {
  documentType: DocumentType;

  description: string;

  prompt: string;

  schema: Record<string, unknown>;

  databaseTable?: string;
}

export interface ProcessDocumentResult {
  documentType: DocumentType;

  fileName: string;

  extractedJson: Record<string, unknown>;
}
