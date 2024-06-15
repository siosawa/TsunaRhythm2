"use client";
import axios from "axios";
import { useEffect, useState } from "react";

const ProjectHourlyWageRanking = () => {
  const [ranking, setRanking] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3001/records")
      .then((recordsResponse) => {
        const records = recordsResponse.data || [];
        console.log("Records:", records);

        axios
          .get("http://localhost:3001/projects")
          .then((projectsResponse) => {
            const projects = projectsResponse.data || [];
            console.log("Projects:", projects);

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
                  project.totalUnitPriceTimesQuantity /
                  (project.totalMinutes / 60),
              }))
              .sort((a, b) => b.averageHourlyWage - a.averageHourlyWage); // 高い順にソート

            setRanking(ranking);
          })
          .catch((error) => {
            console.error("Error fetching projects data:", error);
          });
      })
      .catch((error) => {
        console.error("Error fetching records data:", error);
      });
  }, []);

  return (
    <div className="p-5 w-[5cm] bg-white shadow-custom-dark rounded-3xl flex flex-col items-center m-2.5 text-center max-h-[5cm] overflow-auto">
      <p className="font-bold">プロジェクト別時給平均ランキング</p>
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
