// テーブル編集
"use client";
import React, { useState } from "react";
import { useTable } from "react-table";
import initialData from "./initialData";

export function EditTable() {
  const [data, setData] = useState(initialData);
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});

  const columns = React.useMemo(
    () => [
      {
        Header: "日付",
        accessor: "date",
        Cell: ({ value, row: { index }, column: { id } }) => (
          <input
            type="date"
            value={value}
            onChange={(e) => handleInputChange(e, index, id)}
            className="w-full p-2 border rounded text-xs"
            disabled={!isEditing}
          />
        ),
      },
      {
        Header: "企業名",
        accessor: "company",
        Cell: ({ value, row: { index }, column: { id } }) => (
          <input
            type="text"
            value={value}
            onChange={(e) => handleInputChange(e, index, id)}
            className="w-full p-2 border rounded text-xs"
            disabled={!isEditing}
          />
        ),
      },
      {
        Header: "案件名",
        accessor: "profect",
        Cell: ({ value, row: { index }, column: { id } }) => (
          <input
            type="text"
            value={value}
            onChange={(e) => handleInputChange(e, index, id)}
            className="w-full p-2 border rounded text-xs"
            disabled={!isEditing}
          />
        ),
      },
      {
        Header: "ワークの種類",
        accessor: "work",
        Cell: ({ value, row: { index }, column: { id } }) => (
          <input
            type="text"
            value={value}
            onChange={(e) => handleInputChange(e, index, id)}
            className="w-full p-2 border rounded text-xs"
            disabled={!isEditing}
          />
        ),
      },
      {
        Header: "-単価-",
        accessor: "unitPrice",
        Cell: ({ value, row: { index }, column: { id } }) => (
          <input
            type="number"
            value={value}
            onChange={(e) => handleInputChange(e, index, id, "number")}
            className="w-full p-2 border rounded text-xs"
            disabled={!isEditing}
          />
        ),
      },
      {
        Header: "-本数-",
        accessor: "quantity",
        Cell: ({ value, row: { index }, column: { id } }) => (
          <input
            type="number"
            value={value}
            onChange={(e) => handleInputChange(e, index, id, "number")}
            className="w-full p-2 border rounded text-xs"
            disabled={!isEditing}
          />
        ),
      },
    ],
    [isEditing]
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data });

  const handleInputChange = (e, rowIndex, columnId, type) => {
    const value = e.target.value;
    const updatedData = data.map((row, index) => {
      if (index === rowIndex) {
        return {
          ...row,
          [columnId]: value,
        };
      }
      return row;
    });

    // バリデーション
    let newErrors = { ...errors };
    if (type === "number" && isNaN(value)) {
      newErrors[columnId] = "数字を入力してください";
    } else {
      delete newErrors[columnId];
    }

    setData(updatedData);
    setErrors(newErrors);
  };

  return (
    <div>
      {isEditing && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="p-8 bg-white rounded-3xl shadow-xl w-3/4 h-3/4 overflow-auto">
            <button
              onClick={() => setIsEditing(false)}
              className="mb-4 p-2 bg-emerald-500 text-white rounded-2xl"
            >
              保存
            </button>
            <div className="overflow-auto">
              <table {...getTableProps()} className="table-auto w-full">
                <thead>
                  {headerGroups.map((headerGroup) => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                      {headerGroup.headers.map((column) => (
                        <th
                          {...column.getHeaderProps()}
                          className="p-2 border whitespace-nowrap"
                        >
                          {column.render("Header")}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                  {rows.map((row, rowIndex) => {
                    prepareRow(row);
                    return (
                      <tr {...row.getRowProps()}>
                        {row.cells.map((cell) => (
                          <td {...cell.getCellProps()} className="p-2 border">
                            {cell.render("Cell")}
                            {errors[cell.column.id] && (
                              <div className="text-red-500 text-xs">
                                {errors[cell.column.id]}
                              </div>
                            )}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      <div className="p-2 bg-white rounded-3xl shadow-custom-dark mx-7">
        <div className="overflow-auto h-64">
          <table {...getTableProps()} className="table-auto w-full">
            <thead>
              {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <th
                      {...column.getHeaderProps()}
                      className="p-1 border whitespace-nowrap"
                    >
                      {column.render("Header")}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {rows.map((row, rowIndex) => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()}>
                    {row.cells.map((cell) => (
                      <td {...cell.getCellProps()} className="p-1 border">
                        {cell.render("Cell")}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="flex justify-center">
          <button
            onClick={() => setIsEditing(true)}
            className="pt-1 hover:underline"
          >
            編集
          </button>
        </div>
      </div>
    </div>
  );
}
