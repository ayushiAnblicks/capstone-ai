-- ============================================================================
-- Definition-Based Document Processing Engine
-- Schema + seed data (target: MySQL 8.0)
--
-- Tables:
--   document_result     Central ledger of normalized extraction results.
--   definition_registry Dynamic, metadata-driven registry of supported
--                       document types (classification hints, extraction
--                       prompt and JSON Schema). Adding a new document type
--                       only requires a new row here - no application code
--                       changes are required.
--
-- Safe to re-run: tables use CREATE TABLE IF NOT EXISTS and seed rows use
-- INSERT ... ON DUPLICATE KEY UPDATE.
-- ============================================================================

CREATE TABLE IF NOT EXISTS document_result (
  id             BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  document_type  VARCHAR(100)    NOT NULL,
  file_name      VARCHAR(255)    NOT NULL,
  extracted_json JSON            NOT NULL,
  created_at     DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at     DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_document_result_document_type (document_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS definition_registry (
  id                        BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  document_type_identifier VARCHAR(100)    NOT NULL,
  display_name              VARCHAR(150)    NOT NULL,
  classification_examples   JSON            NOT NULL,
  extraction_prompt         TEXT            NOT NULL,
  json_schema                JSON            NOT NULL,
  -- Informational mapping only: every definition currently persists into the
  -- single `document_result` ledger table above (see project decision log).
  database_table             VARCHAR(100)    NOT NULL DEFAULT 'document_result',
  version                     INT UNSIGNED    NOT NULL DEFAULT 1,
  is_active                   TINYINT(1)      NOT NULL DEFAULT 1,
  created_at                  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at                  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_definition_registry_document_type_identifier (document_type_identifier)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- Seed data: 5 supported document types
-- ============================================================================

INSERT INTO definition_registry
  (document_type_identifier, display_name, classification_examples, extraction_prompt, json_schema, database_table, version, is_active)
VALUES
(
  'invoice',
  'Invoice',
  '[
    "Contains an Invoice Number and Invoice Date near the top of the document",
    "Has a Bill To section and a Vendor or Remit To section",
    "Lists line items with description, quantity, unit price and line total",
    "Shows a subtotal, tax amount and a final Total Due"
  ]',
  'Extract the following fields from the invoice text and return JSON only: Invoice Number, Invoice Date, Vendor Name, Customer Name, line Items (each with description, quantity, unit price and line total), Taxes and Total. Use null for any field that cannot be found in the text.',
  '{
    "type": "object",
    "properties": {
      "invoiceNumber": {"type": ["string", "null"]},
      "invoiceDate": {"type": ["string", "null"], "description": "ISO 8601 date (YYYY-MM-DD) if determinable"},
      "vendorName": {"type": ["string", "null"]},
      "customerName": {"type": ["string", "null"]},
      "items": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "description": {"type": ["string", "null"]},
            "quantity": {"type": ["number", "null"]},
            "unitPrice": {"type": ["number", "null"]},
            "lineTotal": {"type": ["number", "null"]}
          },
          "required": ["description", "quantity", "unitPrice", "lineTotal"],
          "additionalProperties": false
        }
      },
      "taxes": {"type": ["number", "null"]},
      "total": {"type": ["number", "null"]}
    },
    "required": ["invoiceNumber", "invoiceDate", "vendorName", "customerName", "items", "taxes", "total"],
    "additionalProperties": false
  }',
  'document_result',
  1,
  1
),
(
  'purchase_order',
  'Purchase Order',
  '[
    "Contains a PO Number or Purchase Order Number",
    "Issued by a Buyer to a Vendor requesting goods or services",
    "Lists ordered items with quantity and unit price, with no indication payment has already been made",
    "May include a requested delivery date"
  ]',
  'Extract the following fields from the purchase order text and return JSON only: PO Number, PO Date, Vendor Name, Buyer Name, line Items (each with description, quantity, unit price and line total), requested Delivery Date and Total. Use null for any field that cannot be found in the text.',
  '{
    "type": "object",
    "properties": {
      "poNumber": {"type": ["string", "null"]},
      "poDate": {"type": ["string", "null"]},
      "vendorName": {"type": ["string", "null"]},
      "buyerName": {"type": ["string", "null"]},
      "items": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "description": {"type": ["string", "null"]},
            "quantity": {"type": ["number", "null"]},
            "unitPrice": {"type": ["number", "null"]},
            "lineTotal": {"type": ["number", "null"]}
          },
          "required": ["description", "quantity", "unitPrice", "lineTotal"],
          "additionalProperties": false
        }
      },
      "deliveryDate": {"type": ["string", "null"]},
      "total": {"type": ["number", "null"]}
    },
    "required": ["poNumber", "poDate", "vendorName", "buyerName", "items", "deliveryDate", "total"],
    "additionalProperties": false
  }',
  'document_result',
  1,
  1
),
(
  'utility_bill',
  'Utility Bill',
  '[
    "Issued by a utility or service provider such as electricity, water, gas or internet",
    "Contains an Account Number and a Service Address",
    "Shows a billing period start and end date",
    "Shows an Amount Due and a payment Due Date"
  ]',
  'Extract the following fields from the utility bill text and return JSON only: Account Number, Service Provider, Service Address, Billing Period Start, Billing Period End, Due Date and Amount Due. Use null for any field that cannot be found in the text.',
  '{
    "type": "object",
    "properties": {
      "accountNumber": {"type": ["string", "null"]},
      "serviceProvider": {"type": ["string", "null"]},
      "serviceAddress": {"type": ["string", "null"]},
      "billingPeriodStart": {"type": ["string", "null"]},
      "billingPeriodEnd": {"type": ["string", "null"]},
      "dueDate": {"type": ["string", "null"]},
      "amountDue": {"type": ["number", "null"]}
    },
    "required": ["accountNumber", "serviceProvider", "serviceAddress", "billingPeriodStart", "billingPeriodEnd", "dueDate", "amountDue"],
    "additionalProperties": false
  }',
  'document_result',
  1,
  1
),
(
  'bank_statement',
  'Bank Statement',
  '[
    "Issued by a bank summarizing account activity over a period",
    "Contains an Account Number and Bank Name",
    "Shows an Opening Balance and Closing Balance",
    "Lists individual transactions with date, description, amount and running balance"
  ]',
  'Extract the following fields from the bank statement text and return JSON only: Account Number, Bank Name, Statement Period Start, Statement Period End, Opening Balance, Closing Balance and a list of Transactions (each with date, description, amount and running balance). Use null for any field that cannot be found in the text.',
  '{
    "type": "object",
    "properties": {
      "accountNumber": {"type": ["string", "null"]},
      "bankName": {"type": ["string", "null"]},
      "statementPeriodStart": {"type": ["string", "null"]},
      "statementPeriodEnd": {"type": ["string", "null"]},
      "openingBalance": {"type": ["number", "null"]},
      "closingBalance": {"type": ["number", "null"]},
      "transactions": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "date": {"type": ["string", "null"]},
            "description": {"type": ["string", "null"]},
            "amount": {"type": ["number", "null"]},
            "balance": {"type": ["number", "null"]}
          },
          "required": ["date", "description", "amount", "balance"],
          "additionalProperties": false
        }
      }
    },
    "required": ["accountNumber", "bankName", "statementPeriodStart", "statementPeriodEnd", "openingBalance", "closingBalance", "transactions"],
    "additionalProperties": false
  }',
  'document_result',
  1,
  1
),
(
  'driver_license',
  'Driver License',
  '[
    "A government issued identification card",
    "Contains a License Number, full Name and Date of Birth",
    "Shows an Address, Issue Date and Expiry Date",
    "Typically includes a photo and physical description not relevant to text extraction"
  ]',
  'Extract the following fields from the driver license text and return JSON only: License Number, full Name, Date of Birth, Address, Issue Date and Expiry Date. Use null for any field that cannot be found in the text.',
  '{
    "type": "object",
    "properties": {
      "licenseNumber": {"type": ["string", "null"]},
      "fullName": {"type": ["string", "null"]},
      "dateOfBirth": {"type": ["string", "null"], "description": "ISO 8601 date (YYYY-MM-DD) if determinable"},
      "address": {"type": ["string", "null"]},
      "issueDate": {"type": ["string", "null"], "description": "ISO 8601 date (YYYY-MM-DD) if determinable"},
      "expiryDate": {"type": ["string", "null"], "description": "ISO 8601 date (YYYY-MM-DD) if determinable"}
    },
    "required": ["licenseNumber", "fullName", "dateOfBirth", "address", "issueDate", "expiryDate"],
    "additionalProperties": false
  }',
  'document_result',
  1,
  1
)
ON DUPLICATE KEY UPDATE
  display_name = VALUES(display_name),
  classification_examples = VALUES(classification_examples),
  extraction_prompt = VALUES(extraction_prompt),
  json_schema = VALUES(json_schema),
  database_table = VALUES(database_table),
  version = version + 1,
  is_active = VALUES(is_active);
