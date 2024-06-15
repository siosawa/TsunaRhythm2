"use client";
import React, { useState } from "react";
import { EditTimer } from "./EditTimer";
import { TbTriangleInvertedFilled } from "react-icons/tb";

export function ViewTimerRecord({ timerRecords, setTimerRecords, projects }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editRecords, setEditRecords] = useState([]);
  const [isHidden, setIsHidden] = useState(false);

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
    setTimerRecords(editRecords);
    setIsEditing(false);
  };

  const handleClose = () => {
    setEditRecords(timerRecords);
    setIsEditing(false);
  };

  const handleEditClick = () => {
    setEditRecords([...timerRecords]);
    setIsEditing(true);
  };

  const formatDate = (date) => {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return `${month}/${day} ${hours}:${minutes.toString().padStart(2, "0")}`;
  };

  const handleToggle = () => {
    setIsHidden(!isHidden);
  };

  return (
    <>
      <div className="w-44">
        <div className="bg-gray-200 rounded-3xl p-3 max-h-96 overflow-y-auto relative">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th colSpan="3" className="text-right px-2">
                  <div className="flex items-center justify-end">
                    <p className="flex-grow text-center font-light">作業記録</p>
                    <TbTriangleInvertedFilled
                      className="inline-block cursor-pointer ml-2"
                      onClick={handleToggle}
                    />
                  </div>
                </th>
              </tr>
              {!isHidden && timerRecords.length > 0 && (
                <tr>
                  <th className="w-1/4 text-xs text-left whitespace-nowrap">
                    日付
                  </th>
                  <th className="w-1/6 text-xs text-left whitespace-nowrap">
                    分
                  </th>
                  <th className="w-1/5 text-xs text-left whitespace-nowrap">
                    案件名
                  </th>
                </tr>
              )}
            </thead>
            {!isHidden && timerRecords.length > 0 && (
              <tbody>
                {timerRecords.map((record, index) => (
                  <tr key={index}>
                    <td className="w-1/3 p-0 text-left whitespace-nowrap">
                      <input
                        type="text"
                        value={formatDate(record.date)}
                        readOnly
                        className="border p-0 w-full text-xs"
                      />
                    </td>
                    <td className="w-1/5 p-0 text-left whitespace-nowrap">
                      <input
                        type="number"
                        value={record.minutes}
                        min="0"
                        readOnly
                        className="border p-0 w-full text-xs"
                      />
                    </td>
                    <td className="w-1/6 p-0 whitespace-nowrap">
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
                ))}
              </tbody>
            )}
          </table>
          {!isHidden && timerRecords.length === 0 && (
            <div className="text-center text-xs py-2">作業記録がありません</div>
          )}
        </div>

        {!isHidden && timerRecords.length > 0 && (
          <div className="flex justify-end">
            <button
              onClick={handleEditClick}
              className="bg-white shadow-custom-dark rounded-md mt-2 mr-3 px-2 py-1 text-xs whitespace-nowrap hover:bg-gray-200"
            >
              編集
            </button>
          </div>
        )}
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
    </>
  );
}
