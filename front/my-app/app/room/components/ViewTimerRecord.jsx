"use client";
import React, { useState } from "react";
import { EditTimer } from "./EditTimer";
import { TbTriangleInvertedFilled } from "react-icons/tb";

export function ViewTimerRecord({ timerRecords, setTimerRecords, projects }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editRecords, setEditRecords] = useState([]);

  const handleEdit = (index, field, value) => {
    const updatedRecords = [...editRecords];
    updatedRecords[index][field] = value;
    setEditRecords(updatedRecords);
  };

  const handleDateChange = (index, value) => {
    const date = new Date(value);
    handleEdit(index, "date", date);
  };

  const handleTimeChange = (index, field, value) => {
    const number = parseInt(value, 10);
    handleEdit(index, field, number);
  };

  const handleSave = () => {
    setTimerRecords(editRecords); // 変更内容を保存
    setIsEditing(false); // 編集モードを終了
  };

  const handleClose = () => {
    setEditRecords(timerRecords); // 変更をキャンセルし、元のデータを復元
    setIsEditing(false); // 編集モードを終了
  };

  const handleEditClick = () => {
    setEditRecords([...timerRecords]); // 現在のデータを編集用にコピー
    setIsEditing(true); // 編集モードを開始
  };

  const formatDate = (date) => {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return `${month}/${day} ${hours}:${minutes.toString().padStart(2, "0")}`;
  };

  return (
    <div className="mt-4 w-44">
      <div className="bg-gray-200 rounded-3xl p-3 h-96 overflow-y-auto relative">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th colSpan="3" className="text-right">
                <TbTriangleInvertedFilled className="inline-block" />
              </th>
            </tr>
            <tr>
              <th className="w-1/4 text-xs text-left whitespace-nowrap">
                日付
              </th>
              <th className="w-1/6 text-xs text-left whitespace-nowrap">分</th>
              <th className="w-1/5 text-xs text-left whitespace-nowrap">
                案件名
              </th>
            </tr>
          </thead>
          <tbody>
            {timerRecords.length === 0 ? (
              <tr>
                <td
                  colSpan="3"
                  className="text-center py-4 text-xs whitespace-nowrap"
                >
                  記録がありません
                </td>
              </tr>
            ) : (
              timerRecords.map((record, index) => (
                <tr key={index}>
                  <td className="w-1/4 p-0 text-left whitespace-nowrap">
                    <input
                      type="text"
                      value={formatDate(record.date)}
                      readOnly
                      className="border p-0 w-full text-xs"
                    />
                  </td>
                  <td className="w-1/6 p-0 text-left whitespace-nowrap">
                    <input
                      type="number"
                      value={record.minutes}
                      min="0"
                      readOnly
                      className="border p-0 w-full text-xs"
                    />
                  </td>
                  <td className="w-1/5 p-0 whitespace-nowrap">
                    <select
                      value={record.project}
                      disabled
                      className="border p-0 w-full text-xs"
                    >
                      {projects.map((project, i) => (
                        <option key={i} value={project}>
                          {project}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <button
          onClick={handleEditClick}
          className="absolute bottom-4 right-4 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-3xl text-xs whitespace-nowrap"
        >
          編集
        </button>
      </div>

      {isEditing && (
        <EditTimer
          editRecords={editRecords}
          handleDateChange={handleDateChange}
          handleTimeChange={handleTimeChange}
          handleEdit={handleEdit}
          handleSave={handleSave}
          handleClose={handleClose}
          projects={projects}
        />
      )}
    </div>
  );
}
