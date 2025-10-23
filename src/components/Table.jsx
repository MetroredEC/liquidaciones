import React from 'react';

/**
 * Generic table component. Columns should be an array of objects
 * with `header` and `accessor` properties. Data should be an array
 * of records. Optionally a rowKey function may be provided to
 * generate unique keys; otherwise the index is used.
 */
const Table = ({ columns, data, rowKey }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-grayLight">
          <tr>
            {columns.map(col => (
              <th
                key={col.accessor || col.header}
                scope="col"
                className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200 text-sm">
          {data.map((row, idx) => (
            <tr key={rowKey ? rowKey(row) : idx} className="hover:bg-grayLight">
              {columns.map(col => (
                <td key={col.accessor || col.header} className="px-3 py-2 whitespace-nowrap">
                  {typeof col.accessor === 'function'
                    ? col.accessor(row)
                    : row[col.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;