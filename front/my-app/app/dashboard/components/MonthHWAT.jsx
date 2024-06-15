// 今月の平均時給と給与総額(Average Hourly Wage and Total Salary for the Month)
"use client";
import axios from "axios";
import { useEffect, useState } from "react";

const MonthHWAT = () => {
  const [averageHourlyWage, setAverageHourlyWage] = useState(0);

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

            // recordsテーブルから必要なデータを抽出し、計算
            let totalUnitPriceTimesQuantity = 0;
            let totalMinutes = 0;

            records.forEach((record) => {
              const project = projects.find((p) => p.id === record.project_id);
              if (project) {
                totalUnitPriceTimesQuantity +=
                  project.unitPrice * project.quantity;
                totalMinutes += record.minutes;
              }
            });

            const averageHourlyWage =
              totalUnitPriceTimesQuantity / (totalMinutes / 60);

            setAverageHourlyWage(Math.floor(averageHourlyWage)); // 端数を切り捨て
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
    <div>
      <h1 className="bg-white rounded-3xl shadow-custom-dark">
        今月の平均時給: {averageHourlyWage}円
      </h1>
    </div>
  );
};

export default MonthHWAT;
