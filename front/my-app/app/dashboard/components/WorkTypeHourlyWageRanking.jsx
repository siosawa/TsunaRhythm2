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
        axios.get(`http://localhost:3001/projects?user_id=${userId}`),
      ]);

      const records = recordsResponse.data || [];
      const projects = projectsResponse.data || [];

      // workTypeごとの時給平均を計算
      const workTypeHourlyWages = {};

      records.forEach((record) => {
        const project = projects.find((p) => p.id === record.project_id);
        if (project && project.isCompleted) {
          if (!workTypeHourlyWages[project.workType]) {
            workTypeHourlyWages[project.workType] = {
              totalUnitPriceTimesQuantity: 0,
              totalMinutes: 0,
            };
          }
          workTypeHourlyWages[project.workType].totalUnitPriceTimesQuantity +=
            project.unitPrice * project.quantity;
          workTypeHourlyWages[project.workType].totalMinutes += record.minutes;
        }
      });

      const ranking = Object.keys(workTypeHourlyWages)
        .map((workType) => ({
          name: workType,
          averageHourlyWage:
            workTypeHourlyWages[workType].totalUnitPriceTimesQuantity /
            (workTypeHourlyWages[workType].totalMinutes / 60),
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
        {ranking.map((workType, index) => (
          <li key={index} className="w-full flex justify-between my-1">
            <span>{index + 1}位</span>
            <span>{workType.name}</span>
            <span>{Math.floor(workType.averageHourlyWage)}円</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WorkTypeHourlyWageRanking;
