"use client";
import axios from "axios";
import { useEffect, useState } from "react";

const MonthHWAT = () => {
  const [averageHourlyWage, setAverageHourlyWage] = useState(0);
  const [totalSalary, setTotalSalary] = useState(0);

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
            const totalSalary = totalUnitPriceTimesQuantity;

            setAverageHourlyWage(Math.floor(averageHourlyWage)); // 端数を切り捨て
            setTotalSalary(totalSalary); // 総給与を設定
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
    <div className="p-5 w-[5cm] h-[7cm] bg-white shadow-custom-dark rounded-3xl flex flex-col items-center justify-center m-2.5 text-center">
      <p className="font-bold">今月の平均時給は{averageHourlyWage}円です！</p>
      <p className="font-bold">今月の給与総額は{totalSalary}円です！</p>
    </div>
  );
};

export default MonthHWAT;
