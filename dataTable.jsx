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
  