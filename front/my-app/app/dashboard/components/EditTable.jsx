"use client";
import React, { useState, useEffect } from "react";
import { useTable } from "react-table";
import axios from "axios";
import FetchCurrentUser from "@/components/FetchCurrentUser";

export function EditTable() {
  const [data, setData] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchData = async (userId) => {
      try {
        const result = await axios.get(
          `http://localhost:3001/projects?user_id=${userId}`
        );
        setData(result.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    if (currentUser) {
      fetchData(currentUser.id);
    }
  }, [currentUser]);

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
      newErrors[rowIndex] = {
        ...newErrors[rowIndex],
        [columnId]: "数字を入力してください",
      };
    } else {
      delete newErrors[rowIndex]?.[columnId];
    }

    setData(updatedData);
    setErrors(newErrors);
  };

  const handleCheckboxChange = (e, rowIndex) => {
    const value = e.target.checked;
    const updatedData = data.map((row, index) => {
      if (index === rowIndex) {
        return {
          ...row,
          isCompleted: value,
        };
      }
      return row;
    });
    setData(updatedData);
  };

  const columns = React.useMemo(
    () => [
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
        accessor: "name",
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
        accessor: "workType",
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
        Header: "単価",
        accessor: "unitPrice",
        Cell: ({ value, row: { index }, column: { id } }) => (
          <input
            type="number"
            value={value}
            onChange={(e) => handleInputChange(e, index, id, "number")}
            className="max-w-24 p-2 border rounded text-xs"
            disabled={!isEditing}
          />
        ),
      },
      {
        Header: "本数",
        accessor: "quantity",
        Cell: ({ value, row: { index }, column: { id } }) => (
          <input
            type="number"
            value={value}
            onChange={(e) => handleInputChange(e, index, id, "number")}
            className="w-full min-w-14 p-2 border rounded text-xs"
            disabled={!isEditing}
          />
        ),
      },
      {
        Header: "完了状態",
        accessor: "isCompleted",
        Cell: ({ value, row: { index }, column: { id } }) => (
          <div className="flex items-center justify-center">
            {isEditing ? (
              <input
                type="checkbox"
                checked={value}
                onChange={(e) => handleCheckboxChange(e, index)}
              />
            ) : (
              <span
                className={`w-full text-center p-1 rounded ${
                  value
                    ? "bg-green-200 text-green-800"
                    : "bg-red-200 text-red-800"
                }`}
              >
                {value ? "完" : "未"}
              </span>
            )}
          </div>
        ),
      },
    ],
    [isEditing]
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data });

  return (
    <>
      <FetchCurrentUser setCurrentUser={setCurrentUser} />
      <div>
        {isEditing && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="p-8 bg-white rounded-3xl shadow-custom-dark h-3/4 overflow-auto mx-7">
              <button
                onClick={() => setIsEditing(false)}
                className="mb-4 p-2 bg-emerald-500 text-white rounded-2xl"
              >
                保存
              </button>
              <div className="overflow-auto">
                <table {...getTableProps()} className="table-auto w-full">
                  <thead>
                    {headerGroups.map((headerGroup, headerGroupIndex) => (
                      <tr
                        {...headerGroup.getHeaderGroupProps()}
                        key={headerGroupIndex}
                      >
                        {headerGroup.headers.map((column, columnIndex) => (
                          <th
                            {...column.getHeaderProps()}
                            key={columnIndex}
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
                        <tr {...row.getRowProps()} key={rowIndex}>
                          {row.cells.map((cell) => (
                            <td
                              {...cell.getCellProps()}
                              key={cell.column.id}
                              className="p-2 border"
                            >
                              {cell.render("Cell")}
                              {errors[rowIndex]?.[cell.column.id] && (
                                <div className="text-red-500 text-xs">
                                  {errors[rowIndex][cell.column.id]}
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
        <div className="p-2 bg-white rounded-3xl shadow-custom-dark overflow-x-auto mx-7 my-2">
          <div className="overflow-x-auto h-60">
            <table {...getTableProps()} className="table-auto">
              <thead>
                {headerGroups.map((headerGroup, headerGroupIndex) => (
                  <tr
                    {...headerGroup.getHeaderGroupProps()}
                    key={headerGroupIndex}
                  >
                    {headerGroup.headers.map((column, columnIndex) => (
                      <th
                        {...column.getHeaderProps()}
                        key={columnIndex}
                        className="p-1 border whitespace-nowrap w-[94px]"
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
                    <tr {...row.getRowProps()} key={rowIndex}>
                      {row.cells.map((cell) => (
                        <td
                          {...cell.getCellProps()}
                          key={cell.column.id}
                          className="p-1 border w-[94px]"
                        >
                          {cell.render("Cell")}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="flex justify-center mt-2">
            <button
              onClick={() => setIsEditing(true)}
              className="pt-1 hover:underline"
            >
              編集
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
