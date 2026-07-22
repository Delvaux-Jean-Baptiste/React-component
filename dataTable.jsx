import { useState, useMemo } from "react";
import "./DataTable.css";

// Simple text-based sort indicators, no external icon library needed
const SortIcon = ({ direction }) => (
  <span className={`dt-sort-icon ${direction ? "dt-sort-icon--active" : ""}`}>
    {direction === "asc" ? "▲" : direction === "desc" ? "▼" : "⇅"}
  </span>
);

/**
 * DataTable
 *
 * Props:
 *  - headers: string[]                 e.g. ["Name", "Role", "Score"]
 *  - data: any[][]                     2D array, rows of values, matching headers order
 *  - sortable: boolean                 enable click-to-sort on columns (default true)
 *  - striped: boolean                  zebra-stripe rows (default true)
 */
export default function DataTable({
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
    return <div className="dt-empty-state">No headers provided.</div>;
  }

  return (
    <div className="dt-wrapper">
      <table className="dt-table">
        <thead>
          <tr className="dt-thead-row">
            {headers.map((header, colIndex) => {
              const isActive = sortCol === colIndex;
              return (
                <th
                  key={colIndex}
                  onClick={() => handleSort(colIndex)}
                  className={`dt-th ${sortable ? "dt-th--sortable" : ""}`}
                >
                  <div className="dt-th-content">
                    <span>{header}</span>
                    {sortable && <SortIcon direction={isActive ? sortDir : null} />}
                  </div>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {sortedData.length === 0 ? (
            <tr>
              <td colSpan={headers.length} className="dt-empty-cell">
                No data to display.
              </td>
            </tr>
          ) : (
            sortedData.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className={`dt-row ${striped && rowIndex % 2 === 1 ? "dt-row--striped" : ""}`}
              >
                {headers.map((_, colIndex) => (
                  <td key={colIndex} className="dt-cell">
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