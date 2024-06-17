"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import FetchCurrentUser from "@/components/FetchCurrentUser";

const WorkTypeHourlyWageRanking = () => {
  const [ranking, setRanking] = useState([]);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  const fetchRankingData = async (userId) => {
    try {
      const [recordsResponse, projectsResponse] = await Promise.all([
        axios.get(`http://localhost:3001/records?user_id=${userId}`),
        axios.get(`http://localhost:3000/api/v1/projects`, {
          withCredentials: true,
        }),
      ]);

      const records = recordsResponse.data || [];
      const projects = projectsResponse.data || [];

      // work_typeごとの時給平均を計算
      const workTypeHourlyWages = {};

      records.forEach((record) => {
        const project = projects.find((p) => p.id === record.project_id);
        if (project && project.is_completed) {
          if (!workTypeHourlyWages[project.work_type]) {
            workTypeHourlyWages[project.work_type] = {
              totalUnitPriceTimesQuantity: 0,
              totalMinutes: 0,
            };
          }
          workTypeHourlyWages[project.work_type].totalUnitPriceTimesQuantity +=
            project.unit_price * project.quantity;
          workTypeHourlyWages[project.work_type].totalMinutes += record.minutes;
        }
      });

      const ranking = Object.keys(workTypeHourlyWages)
        .map((work_type) => ({
          name: work_type,
          averageHourlyWage:
            workTypeHourlyWages[work_type].totalUnitPriceTimesQuantity /
            (workTypeHourlyWages[work_type].totalMinutes / 60),
        }))
        .sort((a, b) => b.averageHourlyWage - a.averageHourlyWage); // 高い順にソート

      setRanking(ranking);
    } catch (error) {
      setError("データの取得に失敗しました。");
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchRankingData(currentUser.id);
    }
  }, [currentUser]);

  return (
    <div className="p-5 w-96 bg-white shadow-custom-dark rounded-3xl flex flex-col items-center text-center h-52 overflow-auto">
      <FetchCurrentUser setCurrentUser={setCurrentUser} />
      <p className="font-bold">作業タイプ別時給平均ランキング</p>
      {error && <p className="text-red-500">{error}</p>}
      <ul className="w-full">
        {ranking.map((work_type, index) => (
          <li key={index} className="w-full flex justify-between my-1">
            <span>{index + 1}位</span>
            <span>{work_type.name}</span>
            <span>{Math.floor(work_type.averageHourlyWage)}円</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WorkTypeHourlyWageRanking;
