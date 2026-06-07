const DataTable = ({ columns, rows, loading, empty = "No records found", actions }) => (
  <div className="panel overflow-hidden">
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            {columns.map((column) => (
              <th key={column.key} className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                {column.label}
              </th>
            ))}
            {actions && <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wide text-slate-500">Actions</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {loading ? (
            <tr>
              <td className="px-4 py-8 text-center text-sm text-slate-500" colSpan={columns.length + (actions ? 1 : 0)}>
                Loading records...
              </td>
            </tr>
          ) : rows?.length ? (
            rows.map((row) => (
              <tr key={row._id} className="hover:bg-slate-50">
                {columns.map((column) => (
                  <td key={column.key} className="whitespace-nowrap px-4 py-3 text-sm text-slate-700">
                    {column.render ? column.render(row) : row[column.key]}
                  </td>
                ))}
                {actions && <td className="px-4 py-3 text-right">{actions(row)}</td>}
              </tr>
            ))
          ) : (
            <tr>
              <td className="px-4 py-8 text-center text-sm text-slate-500" colSpan={columns.length + (actions ? 1 : 0)}>
                {empty}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
);

export default DataTable;
