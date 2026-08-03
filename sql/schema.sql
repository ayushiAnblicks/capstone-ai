-- ============================================================================
-- Definition-Based Document Processing Engine
-- Schema (target: MySQL 8.0)
--
-- Per the project's Technology Stack ("Configuration: JSON Files") and
-- Objectives ("Save only the normalized JSON into MySQL"), document type
-- definitions (prompts/JSON Schemas) live in src/definitions/*.json, not in
-- the database. MySQL is reserved solely for the final normalized results.
--
-- document_result: Central ledger of normalized extraction results for
-- every supported document type (single generic table, not per-type).
--
-- Safe to re-run: uses CREATE TABLE IF NOT EXISTS.
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
