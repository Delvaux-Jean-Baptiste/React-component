import { useState, useMemo } from "react";

export default function DataTable({
    headers = []
    , data = []
    , sortable = true
    , striped = true
}) {
    const sortedData = data;

    if (!headers.length) {
        return (
            <div className="text-sm text-slate-500 border border-dashed border-slate-300 rounded-lg p-6 text-center">
                No headers provided.
            </div>
        );
    }
    

    return (
        <>
            <div>
                <table>
                    <thead>
                        <tr>
                            {headers.map((header, colIndex) => {
                                return(
                                    <th
                                        key={colIndex}
                                    >
                                        <span>{header}</span>
                                    </th>
                                );
                            })}
                        </tr>
                    </thead>
                    <tbody>
                        {sortedData.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={headers.length}
                                    className="text-center text-slate-400 px-4 py-8"
                                >
                                    No data to display.
                                </td>
                            </tr>
                        ):(
                            sortedData.map((row, rowIndex) => (
                                <tr
                                    key={rowIndex}
                                >
                                    {headers.map((_, colIndex) => (
                                        <td
                                            key = {colIndex}
                                        >
                                            {row[colIndex]}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </>
    )
      
  }
  
  export default function DataTableCheater({
    headers = [],
    data = [],
    sortable = true,
    striped = true,
  }) {
    const [sortCol, setSortCol] = useState(null);
    const [sortDir, setSortDir] = useState("asc"); // "asc" | "desc"
   
    const sortedData = useMemo(() => {
      if (sortCol === null) return data;
      const rows = [...data];
      rows.sort((a, b) => {
        const av = a[sortCol];
        const bv = b[sortCol];
        const bothNumeric = !isNaN(parseFloat(av)) && !isNaN(parseFloat(bv));
        let cmp;
        if (bothNumeric) {
          cmp = parseFloat(av) - parseFloat(bv);
        } else {
          cmp = String(av).localeCompare(String(bv));
        }
        return sortDir === "asc" ? cmp : -cmp;
      });
      return rows;
    }, [data, sortCol, sortDir]);
   
    const handleSort = (colIndex) => {
      if (!sortable) return;
      if (sortCol === colIndex) {
        setSortDir((d) => (d === "asc" ? "desc" : "asc"));
      } else {
        setSortCol(colIndex);
        setSortDir("asc");
      }
    };
   
    if (!headers.length) {
      return (
        <div className="text-sm text-slate-500 border border-dashed border-slate-300 rounded-lg p-6 text-center">
          No headers provided.
        </div>
      );
    }
   
    return (
      <div className="w-full overflow-x-auto rounded-xl border border-slate-200 shadow-sm">
        <table className="min-w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              {headers.map((header, colIndex) => {
                const isActive = sortCol === colIndex;
                return (
                  <th
                    key={colIndex}
                    onClick={() => handleSort(colIndex)}
                    className={`text-left font-semibold text-slate-700 px-4 py-3 whitespace-nowrap select-none ${
                      sortable ? "cursor-pointer hover:bg-slate-100" : ""
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>{header}</span>
                      {sortable && (
                        <span className="text-slate-400">
                          {isActive ? (
                            sortDir === "asc" ? (
                              <ChevronUp size={14} className="text-slate-700" />
                            ) : (
                              <ChevronDown size={14} className="text-slate-700" />
                            )
                          ) : (
                            <ChevronsUpDown size={14} />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {sortedData.length === 0 ? (
              <tr>
                <td
                  colSpan={headers.length}
                  className="text-center text-slate-400 px-4 py-8"
                >
                  No data to display.
                </td>
              </tr>
            ) : (
              sortedData.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className={`border-b border-slate-100 last:border-0 ${
                    striped && rowIndex % 2 === 1 ? "bg-slate-50/60" : "bg-white"
                  } hover:bg-blue-50/50 transition-colors`}
                >
                  {headers.map((_, colIndex) => (
                    <td
                      key={colIndex}
                      className="px-4 py-2.5 text-slate-700 whitespace-nowrap"
                    >
                      {row[colIndex]}
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
  