import React from 'react';

export interface TableColumn {
  key: string;
  header: string;
  width?: string;
}

export interface TableProps {
  columns: TableColumn[];
  rows: Record<string, React.ReactNode>[];
  className?: string;
  emptyMessage?: string;
}

export function Table({
  columns,
  rows,
  className = '',
  emptyMessage = 'No data available.',
}: TableProps): React.ReactElement {
  return (
    <div
      className={['w-full overflow-x-auto rounded-lg border border-gray-200', className]
        .filter(Boolean)
        .join(' ')}
    >
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            {columns.map((col) => (
              <th
                key={col.key}
                scope="col"
                style={col.width ? { width: col.width } : undefined}
                className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-8 text-center text-gray-400">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            rows.map((row, rowIndex) => (
              // Generic Table API has no stable row id; index is acceptable here
              <tr
                // eslint-disable-next-line react/no-array-index-key
                key={rowIndex}
                className="hover:bg-gray-50 transition-colors"
              >
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3 text-gray-700">
                    {row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
