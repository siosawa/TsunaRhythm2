"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import EditTable from "./EditTable"; // EditTableコンポーネントのパスを適切に設定してください

const ViewTable = () => {
  const [projects, setProjects] = useState([]);
  const [showEditTable, setShowEditTable] = useState(false);

  const fetchProjects = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/projects`,
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
    await fetchProjects(); // データを再取得
    setShowEditTable(false); // モーダルを閉じる
  };

  return (
    <div>
      <div className="mt-6 w-96 h-56 bg-white rounded-3xl shadow-custom-dark max-w-2xl overflow-y-auto">
        <table className="min-w-full table-auto border-collapse border border-gray-200">
          <thead className="bg-gray-100 sticky top-0 z-10">
            <tr>
              <th className="px-2 py-1 text-sm border border-gray-200 w-24">案件名</th>
              <th className="px-1 py-1 text-sm border border-gray-200 w-32">ワークの種類</th>
              <th className="px-1 py-1 text-sm border border-gray-200">単価</th>
              <th className="px-2 py-1 text-sm border border-gray-200 w-14">本数</th>
              <th className="px-2 py-1 text-sm border border-gray-200 w-14">状態</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project.id} className="text-center">
                <td className="px-1 py-1 border border-gray-200 text-sm">{project.name}</td>
                <td className="px-1 py-1 border border-gray-200 text-sm">{project.work_type}</td>
                <td className="px-1 py-1 border border-gray-200 text-sm">{project.unit_price}</td>
                <td className="px-1 py-1 border border-gray-200 text-sm">{project.quantity}</td>
                <td className="px-1 py-1 border border-gray-200 text-sm">{project.is_completed ? "完" : "未"}</td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-gray-100 sticky bottom-0 z-10">
            <tr>
              <td colSpan={5} className="px-2 py-1 border border-gray-200 text-center">
                <button className="hover:underline" onClick={() => setShowEditTable(true)}>
                  編集
                </button>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
      {showEditTable && (
        <EditTable onClose={() => setShowEditTable(false)} onSave={handleSave} />
      )}
    </div>
  );
};

export default ViewTable;
