"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { v4 as uuidv4 } from "uuid";
import { CiCirclePlus } from "react-icons/ci";
import { RiDeleteBinLine } from "react-icons/ri";

const EditRecord = ({ onClose, onSave }) => {
  const [data, setData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [projects, setProjects] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [recordsResponse, projectsResponse] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/records`, {
            withCredentials: true,
          }),
          axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/projects`, {
            withCredentials: true,
          }),
        ]);

        const projectsMap = projectsResponse.data.reduce((acc, project) => {
          acc[project.id] = project.name;
          return acc;
        }, {});

        const dataWithId = recordsResponse.data.map((item) => ({
          ...item,
          id: uuidv4(),
          originalId: item.id,
        }));

        setData(dataWithId);
        setOriginalData(dataWithId);
        setProjects(projectsMap);
      } catch (error) {
        console.error("データの取得に失敗しました", error);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e, id, field) => {
    const newData = data.map((item) => {
      if (item.id === id) {
        let value = e.target.value;
        if (e.target.type === "checkbox") {
          value = e.target.checked;
        }
        return { ...item, [field]: value };
      }
      return item;
    });
    setData(newData);
  };

  const handleNumberChange = (e, id, field) => {
    const value = Math.max(0, e.target.value);
    handleChange({ target: { value } }, id, field);
  };

  const addEmptyRow = () => {
    const newRow = {
      id: uuidv4(),
      project_id: "",
      minutes: 0,
      date: new Date().toISOString(),
    };
    setData([newRow, ...data]);
  };

  const deleteRow = (id) => {
    const newData = data.filter((item) => item.id !== id);
    setData(newData);
  };

  const saveData = async () => {
    const originalIds = originalData.map((item) => item.id);
    const currentIds = data.map((item) => item.id);

    const idsToDelete = originalIds.filter((id) => !currentIds.includes(id));
    const idsToAdd = currentIds.filter((id) => !originalIds.includes(id));
    const idsToUpdate = currentIds.filter((id) => originalIds.includes(id));

    for (const id of idsToDelete) {
      const originalItem = originalData.find((item) => item.id === id);
      if (originalItem) {
        try {
          await axios.delete(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/records/${originalItem.originalId}`,
            {
              withCredentials: true,
            }
          );
        } catch (error) {
          console.error("Error deleting data:", error);
        }
      }
    }

    for (const id of idsToAdd) {
      const newItem = data.find((item) => item.id === id);
      if (newItem) {
        try {
          await axios.post(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/records`,
            newItem,
            {
              withCredentials: true,
            }
          );
        } catch (error) {
          console.error("Error adding data:", error);
        }
      }
    }

    for (const id of idsToUpdate) {
      const originalItem = originalData.find((item) => item.id === id);
      const newItem = data.find((item) => item.id === id);
      if (
        originalItem &&
        newItem &&
        JSON.stringify(originalItem) !== JSON.stringify(newItem)
      ) {
        try {
          await axios.put(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/records/${originalItem.originalId}`,
            newItem,
            {
              withCredentials: true,
            }
          );
        } catch (error) {
          console.error("Error updating data:", error);
        }
      }
    }

    onSave();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start z-50">
      <div className="mt-28 mx-7">
        <div className="bg-white rounded-3xl shadow-custom-dark max-w-3xl w-full px-6 pb-6 pt-10 relative">
          <Button
            onClick={onClose}
            className="absolute top-4 right-4 bg-gray-300 hover:bg-gray-400 text-black"
          >
            ✕
          </Button>
          <div className="flex items-center mb-4">
            <Button
              onClick={saveData}
              className="bg-emerald-500 hover:bg-emerald-600"
            >
              保存
            </Button>
            <button onClick={addEmptyRow}>
              <CiCirclePlus className="text-5xl m-2" />
            </button>
          </div>
          <div className="overflow-y-auto max-h-[500px]">
            <table className="min-w-full table-auto border-collapse border border-gray-200">
              <thead className="bg-gray-100 whitespace-nowrap">
                <tr>
                  <th className="px-2 py-1 border border-gray-200">
                    プロジェクト
                  </th>
                  <th className="px-2 py-1 border border-gray-200">分数</th>
                  <th className="px-2 py-1 border border-gray-200">日付</th>
                  <th className="px-2 py-1 border border-gray-200 w-1/12">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.map((item) => (
                  <tr key={item.id} className="text-center">
                    <td className="px-1 py-1 border border-gray-200">
                      <select
                        value={item.project_id}
                        onChange={(e) => handleChange(e, item.id, "project_id")}
                        className="w-full px-1 py-1"
                      >
                        <option value="">選択してください</option>
                        {Object.keys(projects).map((projectId) => (
                          <option key={projectId} value={projectId}>
                            {projects[projectId]}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-1 py-1 border border-gray-200">
                      <input
                        type="number"
                        value={item.minutes}
                        onChange={(e) =>
                          handleNumberChange(e, item.id, "minutes")
                        }
                        className="w-full px-1 py-1"
                        min="0"
                      />
                    </td>
                    <td className="px-1 py-1 border border-gray-200">
                      <input
                        type="datetime-local"
                        value={new Date(item.date).toISOString().slice(0, 16)}
                        onChange={(e) => handleChange(e, item.id, "date")}
                        className="w-full px-1 py-1"
                      />
                    </td>
                    <td className="px-1 py-1 border border-gray-200">
                      <Button
                        onClick={() => deleteRow(item.id)}
                        className="bg-white text-brack hover:bg-gray-50"
                      >
                        <RiDeleteBinLine />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditRecord;
