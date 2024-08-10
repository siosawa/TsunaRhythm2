"use client";
import React, { useEffect, useState, ChangeEvent } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { v4 as uuidv4 } from "uuid";
import { CiCirclePlus } from "react-icons/ci";
import { RiDeleteBinLine } from "react-icons/ri";

interface Project {
  id: number;
  originalId: number;
  user_id: number;
  company: string;
  name: string;
  work_type: string;
  unit_price: number;
  quantity: number;
  is_completed: boolean;
  created_at?: string;
  updated_at?: string;
}

interface EditTableProps {
  onClose: () => void;
  onSave: () => void;
}

const ProjectEditTable = ({ onClose, onSave }: EditTableProps): JSX.Element => {
  const [data, setData] = useState<Project[]>([]);
  const [originalData, setOriginalData] = useState<Project[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios.get<Project[]>(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/projects`,
          {
            withCredentials: true,
          }
        );
        const dataWithId = result.data.map((item) => ({
          ...item,
          id: item.id,
          originalId: item.id,
        }));
        setData(dataWithId);
        setOriginalData(dataWithId);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement>,
    id: number,
    field: keyof Project
  ) => {
    const newData = data.map((item) => {
      if (item.id === id) {
        let value: any = e.target.value;
        if (e.target.type === "checkbox") {
          value = e.target.checked;
        }
        return { ...item, [field]: value };
      }
      return item;
    });
    setData(newData);
  };

  const handleNumberChange = (
    e: ChangeEvent<HTMLInputElement>,
    id: number,
    field: keyof Project
  ) => {
    const value = Math.max(0, parseInt(e.target.value, 10));
    const event = {
      ...e,
      target: { ...e.target, value: value.toString() } as EventTarget & HTMLInputElement,
    };
    handleChange(event as ChangeEvent<HTMLInputElement>, id, field);
  };

  const addEmptyRow = () => {
    const newRow: Project = {
      id: uuidv4() as unknown as number,
      originalId: 0,
      user_id: 0,
      company: "",
      name: "",
      work_type: "",
      unit_price: 0,
      quantity: 0,
      is_completed: false,
    };
    setData([newRow, ...data]);
  };

  const deleteRow = (id: number) => {
    const newData = data.filter((item) => item.id !== id);
    setData(newData);
  };

  const saveData = async () => {
    const projectNames = data.map((item) => item.name);
    const uniqueProjectNames = new Set(projectNames);
    if (projectNames.length !== uniqueProjectNames.size) {
      setErrorMessage("同じ案件名は使えません");
      return;
    }

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
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/projects/${originalItem.originalId}`,
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
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/projects`,
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
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/projects/${originalItem.originalId}`,
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
      <div className="mt-16 mx-7">
        <div className="bg-white rounded-3xl shadow-custom-dark max-w-3xl w-full px-6 pb-6 pt-10 relative ">
          <Button
            onClick={onClose}
            className="absolute top-4 right-4 bg-gray-300 hover:bg-gray-400 text-black"
          >
            ✕
          </Button>
          <div className="flex items-center mb-4">
            <Button onClick={saveData} className="bg-emerald-500 hover:bg-emerald-600 text-white">
              保存
            </Button>
            <Button variant="ghost" onClick={addEmptyRow}>
              <CiCirclePlus className="text-5xl m-2" />
            </Button>
          </div>
          {errorMessage && (
            <div className="text-red-500 mb-4">{errorMessage}</div>
          )}
          <div className="overflow-y-auto max-h-[650px]">
            <table className="min-w-full table-auto border-collapse border border-gray-200">
              <thead className="bg-gray-100 whitespace-nowrap">
                <tr>
                  <th className="px-2 py-1 border border-gray-200">企業名</th>
                  <th className="px-2 py-1 border border-gray-200">案件名</th>
                  <th className="px-2 py-1 border border-gray-200">
                    ワークの種類
                  </th>
                  <th className="px-2 py-1 border border-gray-200 w-1/12">
                    単価
                  </th>
                  <th className="px-2 py-1 border border-gray-200 w-1/12">
                    本数
                  </th>
                  <th className="px-2 py-1 border border-gray-200 w-1/12">
                    状態
                  </th>
                  <th className="px-2 py-1 border border-gray-200 w-1/12">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.map((item) => (
                  <tr key={item.id} className="text-center">
                    <td className="px-1 py-1 border border-gray-200">
                      <input
                        type="text"
                        value={item.company}
                        onChange={(e) => handleChange(e, item.id, "company")}
                        className="w-full px-1 py-1"
                      />
                    </td>
                    <td className="px-1 py-1 border border-gray-200">
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => handleChange(e, item.id, "name")}
                        className="w-full px-1 py-1"
                      />
                    </td>
                    <td className="px-1 py-1 border border-gray-200">
                      <input
                        type="text"
                        value={item.work_type}
                        onChange={(e) => handleChange(e, item.id, "work_type")}
                        className="w-full px-1 py-1"
                      />
                    </td>
                    <td className="px-1 py-1 border border-gray-200">
                      <input
                        type="number"
                        value={item.unit_price}
                        onChange={(e) =>
                          handleNumberChange(e, item.id, "unit_price")
                        }
                        className="w-20 px-1 py-1"
                        min="0"
                      />
                    </td>
                    <td className="px-1 py-1 border border-gray-200">
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) =>
                          handleNumberChange(e, item.id, "quantity")
                        }
                        className="w-full px-1 py-1"
                        min="0"
                      />
                    </td>
                    <td className="px-1 py-1 border border-gray-200">
                      <input
                        type="checkbox"
                        checked={item.is_completed}
                        onChange={(e) =>
                          handleChange(e, item.id, "is_completed")
                        }
                        className="px-1 py-1"
                      />
                    </td>
                    <td className="px-1 py-1 border border-gray-200">
                      <Button
                        variant="ghost"
                        onClick={() => deleteRow(item.id)}
                        className="bg-white text-black hover:bg-gray-50"
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

export default ProjectEditTable;
