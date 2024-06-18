"use client";

import React, { useState, useEffect } from "react";
import { useTable } from "react-table";
import axios from "axios";
import FetchCurrentUser from "@/components/FetchCurrentUser";

export function EditTable() {
  const [data, setData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});
  const [currentUser, setCurrentUser] = useState(null);
  const [isAdding, setIsAdding] = useState(false); // 追加用のポップアップ状態
  const [newRecord, setNewRecord] = useState({
    company: "",
    name: "",
    work_type: "",
    unit_price: 0,
    quantity: 0,
    is_completed: false,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios.get(
          `http://localhost:3000/api/v1/projects`,
          {
            withCredentials: true, // クッキーを含める設定
          }
        );
        setData(result.data);
        setOriginalData(result.data); // オリジナルデータを保存
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    if (currentUser) {
      fetchData();
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
      if (newErrors[rowIndex]) {
        delete newErrors[rowIndex][columnId];
        if (Object.keys(newErrors[rowIndex]).length === 0) {
          delete newErrors[rowIndex];
        }
      }
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
          is_completed: value,
        };
      }
      return row;
    });
    setData(updatedData);
  };

  const handleSave = async () => {
    try {
      // 新しいデータをフィルターする
      const newData = data.filter((row) => !row.id);
      if (newData.length > 0) {
        await Promise.all(
          newData.map(async (project) => {
            await axios.post(`http://localhost:3000/api/v1/projects`, project, {
              withCredentials: true,
            });
          })
        );
      }

      // 変更があった既存のデータをフィルターする
      const changedData = data.filter((row, index) => {
        const originalRow = originalData[index]; // 保存前のオリジナルデータを取得
        return row.id && JSON.stringify(row) !== JSON.stringify(originalRow); // データが変更されているか比較
      });

      // 各プロジェクトを個別に更新
      await Promise.all(
        changedData.map(async (project) => {
          const projectId = project.id; // プロジェクトのIDを取得
          await axios.put(
            `http://localhost:3000/api/v1/projects/${projectId}`,
            project,
            {
              withCredentials: true,
            }
          );
        })
      );

      // 保存後の処理（成功時のみ）
      setIsEditing(false);
      setOriginalData([...data]); // 保存後のデータをオリジナルデータとして更新
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  const handleCancel = () => {
    // 編集モードを終了し、データを元に戻す
    setData([...originalData]);
    setIsEditing(false);
  };

  const handleAdd = () => {
    setIsAdding(true); // 追加用のポップアップを表示
  };

  const handleAddChange = (e, columnId) => {
    const value = e.target.value;
    setNewRecord({ ...newRecord, [columnId]: value });
  };

  const handleAddSave = () => {
    setData([newRecord, ...data]);
    setIsAdding(false);
    setNewRecord({
      company: "",
      name: "",
      work_type: "",
      unit_price: 0,
      quantity: 0,
      is_completed: false,
    });
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
            placeholder="企業名"
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
            placeholder="案件名"
          />
        ),
      },
      {
        Header: "ワークの種類",
        accessor: "work_type",
        Cell: ({ value, row: { index }, column: { id } }) => (
          <input
            type="text"
            value={value}
            onChange={(e) => handleInputChange(e, index, id)}
            className="w-full p-2 border rounded text-xs"
            disabled={!isEditing}
            placeholder="ワークの種類"
          />
        ),
      },
      {
        Header: "単価",
        accessor: "unit_price",
        Cell: ({ value, row: { index }, column: { id } }) => (
          <input
            type="number"
            value={value}
            onChange={(e) => handleInputChange(e, index, id, "number")}
            className="max-w-24 p-2 border rounded text-xs"
            disabled={!isEditing}
            placeholder="単価"
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
            placeholder="本数"
          />
        ),
      },
      {
        Header: "完了状態",
        accessor: "is_completed",
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
              <div className="flex justify-between mb-4">
                <div>
                  <button
                    onClick={handleSave}
                    className="mr-2 p-2 bg-emerald-500 text-white rounded-2xl hover:bg-emerald-600"
                  >
                    保存
                  </button>
                  <button
                    onClick={handleAdd}
                    className="mr-2 p-2 bg-sky-500 text-white rounded-2xl hover:bg-sky-600"
                  >
                    追加
                  </button>
                  <button
                    onClick={handleCancel}
                    className="p-2 bg-gray-500 text-white rounded-2xl hover:bg-gray-600"
                  >
                    閉じる
                  </button>
                </div>
              </div>
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
        {isAdding && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="p-8 bg-white rounded-3xl shadow-custom-dark">
              <h2 className="text-xl mb-4">新しいレコードを追加</h2>
              <div className="mb-4">
                <input
                  type="text"
                  value={newRecord.company}
                  onChange={(e) => handleAddChange(e, "company")}
                  className="w-full p-2 mb-2 border rounded text-xs"
                  placeholder="企業名"
                />
                <input
                  type="text"
                  value={newRecord.name}
                  onChange={(e) => handleAddChange(e, "name")}
                  className="w-full p-2 mb-2 border rounded text-xs"
                  placeholder="案件名"
                />
                <input
                  type="text"
                  value={newRecord.work_type}
                  onChange={(e) => handleAddChange(e, "work_type")}
                  className="w-full p-2 mb-2 border rounded text-xs"
                  placeholder="ワークの種類"
                />
                <input
                  type="number"
                  value={newRecord.unit_price}
                  onChange={(e) => handleAddChange(e, "unit_price")}
                  className="w-full p-2 mb-2 border rounded text-xs"
                  placeholder="単価"
                />
                <input
                  type="number"
                  value={newRecord.quantity}
                  onChange={(e) => handleAddChange(e, "quantity")}
                  className="w-full p-2 mb-2 border rounded text-xs"
                  placeholder="本数"
                />
                <div className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    checked={newRecord.is_completed}
                    onChange={(e) =>
                      setNewRecord({
                        ...newRecord,
                        is_completed: e.target.checked,
                      })
                    }
                    className="mr-2"
                  />
                  <label>完了状態</label>
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={handleAddSave}
                  className="mr-2 p-2 bg-emerald-500 text-white rounded-2xl hover:bg-emerald-600"
                >
                  保存
                </button>
                <button
                  onClick={() => setIsAdding(false)}
                  className="p-2 bg-gray-500 text-white rounded-2xl hover:bg-gray-600"
                >
                  閉じる
                </button>
              </div>
            </div>
          </div>
        )}
        <div className="p-2 bg-white rounded-3xl shadow-custom-dark overflow-x-auto mx-7 my-2">
          <div className="flex justify-between mb-2">
            <div>
              <button
                onClick={() => setIsEditing(true)}
                className="mr-2 p-2 bg-blue-500 text-white rounded-2xl hover:bg-blue-600"
              >
                編集
              </button>
              <button
                onClick={handleAdd}
                className="p-2 bg-sky-500 text-white rounded-2xl hover:bg-sky-600"
              >
                追加
              </button>
            </div>
          </div>
          <div className="overflow-x-auto h-60 relative">
            <table {...getTableProps()} className="table-auto w-full">
              <thead className="sticky top-0 bg-white z-10">
                {headerGroups.map((headerGroup, headerGroupIndex) => (
                  <tr
                    {...headerGroup.getHeaderGroupProps()}
                    key={headerGroupIndex}
                  >
                    {headerGroup.headers.map((column, columnIndex) => (
                      <th
                        {...column.getHeaderProps()}
                        key={columnIndex}
                        className="p-1 border whitespace-nowrap w-[94px] bg-white"
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
        </div>
      </div>
    </>
  );
}
