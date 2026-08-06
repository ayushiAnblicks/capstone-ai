interface KeyValueDisplayProps {
  data: Record<string, unknown>;
}

function formatLabel(key: string): string {
  return key
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function isScalar(value: unknown): boolean {
  return (
    value === null ||
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean'
  );
}

export function KeyValueDisplay({ data }: KeyValueDisplayProps) {
  const scalarEntries = Object.entries(data).filter(([, value]) =>
    isScalar(value)
  );

  if (scalarEntries.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
      {scalarEntries.map(([key, value]) => (
        <div key={key} className="min-w-0">
          <dt className="text-xs sm:text-sm font-medium text-gray-500">
            {formatLabel(key)}
          </dt>
          <dd className="text-sm sm:text-base text-gray-900 break-words">
            {String(value ?? 'N/A')}
          </dd>
        </div>
      ))}
    </div>
  );
}
