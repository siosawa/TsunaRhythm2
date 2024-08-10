"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import ProjectEditTable from "./ProjectEditTable";
import { FiTriangle } from "react-icons/fi";

const ProjectViewTable = () => {
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
    await fetchProjects();
    setShowEditTable(false);
  };

  return (
    <div>
      <div className="mt-9 w-96 h-56 bg-white rounded-3xl shadow-custom-dark max-w-2xl overflow-y-auto border-2 border-orange-500">
        <table className="min-w-full table-auto">
          <thead className="bg-orange-400 text-white sticky top-0 z-10">
            <tr>
              <th className="px-2 py-1 text-sm">案件名</th>
              <th className="px-1 py-1 text-sm w-14">単価</th>
              <th className="px-2 py-1 text-sm w-14">本数</th>
              <th className="px-2 py-1 text-sm w-14">状態</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project, index) => (
              <tr
                key={project.id}
                className={`text-center ${
                  index % 2 === 0 ? "bg-orange-100" : "bg-orange-200"
                }`}
              >
                <td className="px-1 py-1 border border-gray-200 text-sm">
                  {project.name}
                </td>
                <td className="px-1 py-1 border border-gray-200 text-sm">
                  {project.unit_price}
                </td>
                <td className="px-1 py-1 border border-gray-200 text-sm">
                  {project.quantity}
                </td>
                <td className="px-1 py-1 border border-gray-200 text-sm">
                  {project.is_completed ? "完" : "未"}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-gray-100 sticky bottom-0 z-10">
            <tr>
              <td
                colSpan={5}
                className="px-2 text-center bg-orange-400 text-white font-bold"
              >
                <button
                  className="hover:underline inline-flex items-center"
                  onClick={() => setShowEditTable(true)}
                >
                  編集
                  <FiTriangle
                    className="ml-1 transform rotate-180 text-white"
                    size={12}
                  />
                </button>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
      {showEditTable && (
        <ProjectEditTable
          onClose={() => setShowEditTable(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default ProjectViewTable;
