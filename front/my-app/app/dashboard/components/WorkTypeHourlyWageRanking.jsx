"use client";
import axios from "axios";
import { useEffect, useState } from "react";

const WorkTypeHourlyWageRanking = () => {
  const [ranking, setRanking] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRankingData = async () => {
      try {
        const [recordsResponse, projectsResponse] = await Promise.all([
          axios.get("http://localhost:3001/records"),
          axios.get("http://localhost:3001/projects"),
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
            workTypeHourlyWages[project.workType].totalMinutes +=
              record.minutes;
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

    fetchRankingData();
  }, []);

  return (
    <div className="p-5 max-w-96 bg-white shadow-custom-dark rounded-3xl flex flex-col items-center m-2.5 mx-7 text-center h-52 overflow-auto">
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
