"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import EditRecord from "./EditRecord"; // EditRecordコンポーネントをインポート
import { IoNewspaperOutline, IoNewspaper } from "react-icons/io5";

const ViewTimerRecord = () => {
  const [records, setRecords] = useState([]);
  const [projects, setProjects] = useState({});
  const [loading, setLoading] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true); // トグル用の状態を追加

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const [recordsResponse, projectsResponse] = await Promise.all([
          axios.get("http://localhost:3000/api/v1/records", {
            withCredentials: true,
          }),
          axios.get("http://localhost:3000/api/v1/projects", {
            withCredentials: true,
          }),
        ]);

        const projectsMap = projectsResponse.data.reduce((acc, project) => {
          acc[project.id] = project.name;
          return acc;
        }, {});

        setRecords(recordsResponse.data);
        setProjects(projectsMap);
      } catch (error) {
        console.error("データの取得に失敗しました", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const [recordsResponse, projectsResponse] = await Promise.all([
        axios.get("http://localhost:3000/api/v1/records", {
          withCredentials: true,
        }),
        axios.get("http://localhost:3000/api/v1/projects", {
          withCredentials: true,
        }),
      ]);

      const projectsMap = projectsResponse.data.reduce((acc, project) => {
        acc[project.id] = project.name;
        return acc;
      }, {});

      setRecords(recordsResponse.data);
      setProjects(projectsMap);
    } catch (error) {
      console.error("データの取得に失敗しました", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center space-x-2 my-5 mx-3">
        <div className="animate-ping h-1 w-1 bg-blue-600 rounded-full"></div>
        <div className="animate-ping h-1 w-1 bg-blue-600 rounded-full animation-delay-200"></div>
        <div className="animate-ping h-1 w-1 bg-blue-600 rounded-full animation-delay-400"></div>
      </div>
    );
  }

  const handleEditClick = () => {
    setIsEditOpen(true); // 編集モーダルを表示する
  };

  const handleClose = () => {
    setIsEditOpen(false); // 編集モーダルを閉じる
  };

  const handleSave = async () => {
    setLoading(true);
    await fetchRecords(); // データを再フェッチして最新の状態に更新
    setIsEditOpen(false);
  };

  const toggleVisibility = () => {
    setIsVisible(!isVisible); // 表示/非表示をトグルする
  };

  return (
    <div>
      <button onClick={toggleVisibility} className="mt-1 mx-2">
        {isVisible ? (
          <IoNewspaper
            className="rounded-sm"
            style={{ width: "32px", height: "32px" }}
          />
        ) : (
          <IoNewspaperOutline
            className="bg-white rounded-sm"
            style={{ width: "32px", height: "32px" }}
          />
        )}
      </button>
      {isVisible && (
        <ModalTimerRecord
          records={records}
          projects={projects}
          handleEditClick={handleEditClick}
        />
      )}
      {isEditOpen && <EditRecord onClose={handleClose} onSave={handleSave} />}
    </div>
  );
};

const ModalTimerRecord = ({ records, projects, handleEditClick }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${String(
      date.getMinutes()
    ).padStart(2, "0")}`;
  };

  return (
    <div className="absolute left-1 mt-6">
      <div className="bg-white rounded-3xl shadow-custom-dark h-60 max-w-2xl overflow-y-auto w-44">
        <table className="min-w-full table-auto border-collapse border border-gray-200 text-left text-xs">
          <thead className="bg-gray-100 sticky top-0 z-10 text-center">
            <tr>
              <th className="px-1 py-1 border border-gray-200 whitespace-nowrap">
                日付
              </th>
              <th className="px-1 py-1 border border-gray-200 whitespace-nowrap">
                分数
              </th>
              <th className="px-1 py-1 border border-gray-200 whitespace-nowrap">
                案件名
              </th>
            </tr>
          </thead>
          <tbody>
            {records.map((record) => (
              <tr key={record.id}>
                <td className="px-1 py-1 border border-gray-200">
                  {formatDate(record.date)}
                </td>
                <td className="px-1 py-1 border border-gray-200">
                  {record.minutes}
                </td>
                <td className="px-1 py-1 border border-gray-200">
                  {projects[record.project_id] || "不明"}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-gray-100 sticky bottom-0 z-10">
            <tr>
              <td
                colSpan="3"
                className="px-1 py-1 border border-gray-200 text-center"
              >
                <button className="hover:underline" onClick={handleEditClick}>
                  編集
                </button>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default ViewTimerRecord;
