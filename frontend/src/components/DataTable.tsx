interface DataTableProps {
  columns: string[];
  rows: Record<string, unknown>[];
}

function formatHeader(key: string): string {
  return key
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function DataTable({ columns, rows }: DataTableProps) {
  if (columns.length === 0 || rows.length === 0) {
    return null;
  }

  return (
    <div className="overflow-x-auto -mx-4 sm:mx-0">
      <table className="w-full border-collapse min-w-[320px]">
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col}
                className="bg-gray-50 text-left text-xs sm:text-sm font-medium text-gray-600 p-2 sm:p-3 whitespace-nowrap"
              >
                {formatHeader(col)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((col) => (
                <td
                  key={col}
                  className="p-2 sm:p-3 border-t border-gray-100 text-xs sm:text-sm"
                >
                  {String(row[col] ?? '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
