import type { DocumentResult } from '../types/document';
import { KeyValueDisplay } from './KeyValueDisplay';
import { DataTable } from './DataTable';

interface ResultsViewProps {
  result: DocumentResult;
}

function formatDocumentType(type: string): string {
  return type
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatTimestamp(isoDate: string): string {
  const date = new Date(isoDate);
  return date.toLocaleString();
}

export function ResultsView({ result }: ResultsViewProps) {
  const { documentType, fileName, createdAt, extractedJson } = result;

  const scalarFields: Record<string, unknown> = {};
  const arrayFields: { key: string; items: Record<string, unknown>[] }[] = [];

  for (const [key, value] of Object.entries(extractedJson)) {
    if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'object' && value[0] !== null) {
      arrayFields.push({ key, items: value as Record<string, unknown>[] });
    } else if (typeof value !== 'object' || value === null) {
      scalarFields[key] = value;
    }
  }

  const hasData = Object.keys(extractedJson).length > 0;

  return (
    <div className="space-y-6">
      {/* Metadata Header */}
      <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-2 sm:gap-3">
        <span className="inline-block self-start px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
          {formatDocumentType(documentType)}
        </span>
        <span className="text-base sm:text-lg font-semibold text-gray-900 truncate min-w-0">
          {fileName}
        </span>
        <span className="text-xs sm:text-sm text-gray-500">
          {formatTimestamp(createdAt)}
        </span>
      </div>

      {/* Extracted Data */}
      {!hasData ? (
        <p className="text-gray-500">No extracted data available</p>
      ) : (
        <>
          {Object.keys(scalarFields).length > 0 && (
            <KeyValueDisplay data={scalarFields} />
          )}

          {arrayFields.map(({ key, items }) => {
            const columns = Object.keys(items[0]);
            return (
              <div key={key} className="space-y-2">
                <h3 className="text-sm font-medium text-gray-700">
                  {key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                </h3>
                <DataTable columns={columns} rows={items} />
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}
