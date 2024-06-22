"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import EditTable from "./EditTable"; // EditTableコンポーネントのパスを適切に設定してください

const ViewTable = () => {
  const [projects, setProjects] = useState([]);
  const [showEditTable, setShowEditTable] = useState(false);

  const fetchProjects = async () => {
    // 関数をコンポーネントの外に移動
    try {
      const response = await axios.get(
        "http://localhost:3000/api/v1/projects",
        {
          withCredentials: true,
        }
      );
      setProjects(response.data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleSave = async () => {
    // onSave 関数を追加
    await fetchProjects(); // データを再取得
    setShowEditTable(false); // モーダルを閉じる
  };

  return (
    <div>
      <div className="bg-white rounded-3xl shadow-custom-dark h-60 max-w-2xl overflow-y-auto">
        <table className="min-w-full table-auto border-collapse border border-gray-200">
          <thead className="bg-gray-100 sticky top-0 z-10">
            <tr>
              <th className="px-2 py-1 border border-gray-200">企業名</th>
              <th className="px-2 py-1 border border-gray-200">案件名</th>
              <th className="px-2 py-1 border border-gray-200 w-32">
                ワークの種類
              </th>
              <th className="px-2 py-1 border border-gray-200">単価</th>
              <th className="px-2 py-1 border border-gray-200 w-14">本数</th>
              <th className="px-2 py-1 border border-gray-200 w-14">状態</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project.id} className="text-center">
                <td className="px-1 py-1 border border-gray-200">
                  {project.company}
                </td>
                <td className="px-1 py-1 border border-gray-200">
                  {project.name}
                </td>
                <td className="px-1 py-1 border border-gray-200">
                  {project.work_type}
                </td>
                <td className="px-1 py-1 border border-gray-200">
                  {project.unit_price}
                </td>
                <td className="px-1 py-1 border border-gray-200">
                  {project.quantity}
                </td>
                <td className="px-1 py-1 border border-gray-200">
                  {project.is_completed ? "完" : "未"}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-gray-100 sticky bottom-0 z-10">
            <tr>
              <td
                colSpan="6"
                className="px-2 py-1 border border-gray-200 text-center"
              >
                <button
                  className="hover:underline"
                  onClick={() => setShowEditTable(true)}
                >
                  編集
                </button>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
      {showEditTable && (
        <EditTable
          onClose={() => setShowEditTable(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default ViewTable;
