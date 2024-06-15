"use client";
import axios from "axios";
import { useEffect, useState } from "react";

const ProjectHourlyWageRanking = () => {
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

        // projectごとの時給平均を計算
        const projectHourlyWages = {};

        records.forEach((record) => {
          const project = projects.find((p) => p.id === record.project_id);
          if (project) {
            if (!projectHourlyWages[project.id]) {
              projectHourlyWages[project.id] = {
                totalUnitPriceTimesQuantity: 0,
                totalMinutes: 0,
                projectName: project.project,
              };
            }
            projectHourlyWages[project.id].totalUnitPriceTimesQuantity +=
              project.unitPrice * project.quantity;
            projectHourlyWages[project.id].totalMinutes += record.minutes;
          }
        });

        const ranking = Object.values(projectHourlyWages)
          .map((project) => ({
            name: project.projectName,
            averageHourlyWage:
              project.totalUnitPriceTimesQuantity / (project.totalMinutes / 60),
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
      <p className="font-bold">プロジェクト別時給平均ランキング</p>
      {error && <p className="text-red-500">{error}</p>}
      <ul className="w-full">
        {ranking.map((project, index) => (
          <li key={index} className="w-full flex justify-between my-1">
            <span>{index + 1}位</span>
            <span>{project.name}</span>
            <span>{Math.floor(project.averageHourlyWage)}円</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProjectHourlyWageRanking;
