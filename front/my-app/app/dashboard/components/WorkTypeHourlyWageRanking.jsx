"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import FetchCurrentUser from "@/components/FetchCurrentUser";

// TypeScriptの型定義を削除し、通常のJavaScriptに変更

const WorkTypeHourlyWageRanking = () => {
  const [ranking, setRanking] = useState([]);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  const fetchRankingData = async (userId) => {
    try {
      const { data: records } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/records`,
        { withCredentials: true }
      );
      const { data: projects } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/projects`,
        { withCredentials: true }
      );

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
        .sort((a, b) => b.averageHourlyWage - a.averageHourlyWage);

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
    <>
      <FetchCurrentUser setCurrentUser={setCurrentUser} />
      <div className="w-96 h-56 bg-white text-mx shadow-custom-dark rounded-3xl flex flex-col items-center text-center overflow-auto border-2 border-orange-500">
        <p className="py-2 w-full font-bold bg-orange-400 text-white">
          ワークの種類別時給平均ランキング
        </p>
        {error && <p className="text-red-500">{error}</p>}
        <ul className="w-96 rounded-full">
          {ranking.map((work_type, index) => (
            <li
              key={index}
              className={`flex justify-between my-1 ${
                index % 2 === 0 ? "bg-orange-100" : "bg-orange-200"
              }`}
            >
              <span className="w-16 text-left px-4">{index + 1}位</span>
              <span className="flex-1 text-left">{work_type.name}</span>
              <span className="w-28 text-right px-4">
                {Math.floor(work_type.averageHourlyWage)}円
              </span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default WorkTypeHourlyWageRanking;
