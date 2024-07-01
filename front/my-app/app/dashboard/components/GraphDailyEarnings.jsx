"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { FiTriangle } from "react-icons/fi";
import FetchCurrentUser from "@/components/FetchCurrentUser"; // FetchCurrentUserをインポート

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const GraphDailyEarnings = () => {
  const currentMonth = new Date().getMonth(); // 現在の月を取得
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "",
        data: [],
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  });
  const [monthIndex, setMonthIndex] = useState(currentMonth); // 初期値を現在の月に設定
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null); // currentUserの状態を追加

  const fetchData = async (userId, month) => {
    try {
      const [projectsResponse, recordsResponse] = await Promise.all([
        axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/projects`, {
          withCredentials: true,
        }),
        axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/records`, {
          withCredentials: true,
        }),
      ]);
      const projects = projectsResponse.data || [];
      const records = recordsResponse.data || [];

      // 完了済みのprojectを取得
      const completedProjects = projects.filter(
        (project) => project.is_completed
      );

      const earningsPerDay = {};
      const year = new Date().getFullYear();

      // 今月のrecordsデータを取得
      const selectedMonthRecords = records.filter(
        (record) => new Date(record.date).getMonth() === month
      );

      completedProjects.forEach((project) => {
        // project_idが一致するrecordsデータを取得して
        const projectRecords = records.filter(
          (record) => record.project_id === project.id
        );
        // トータル作業分数も取得
        const totalWorkMinutes = projectRecords.reduce(
          (total, record) => total + record.minutes,
          0
        );
        // 案件別自給平均を算出
        const averageHourlyWage =
          (project.unit_price * project.quantity) / (totalWorkMinutes / 60);

        selectedMonthRecords.forEach((record) => {
          if (record.project_id === project.id) {
            const date = new Date(record.date).toLocaleDateString();
            if (!earningsPerDay[date]) {
              earningsPerDay[date] = 0;
            }

            // recordsの作業分数と時給を分給に直したものをかけて稼いだ金額を出力
            const dailyEarnings = record.minutes * (averageHourlyWage / 60);

            // 日付ごとに稼いだ金額を加算していくことで日毎の稼いだ金額合計を出力
            earningsPerDay[date] += dailyEarnings;
          }
        });
      });

      setChartData({
        labels: Object.keys(earningsPerDay),
        datasets: [
          {
            label: `${year}年${month + 1}月の日毎の稼いだ金額合計`,
            data: Object.values(earningsPerDay),
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
        ],
      });
    } catch (error) {
      setError("データの取得に失敗しました。");
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchData(currentUser.id, monthIndex);
    }
  }, [currentUser, monthIndex]);

  useEffect(() => {
    if (currentUser) {
      fetchData(currentUser.id, currentMonth); // 初回ロード時に現在の月のデータを取得
    }
  }, [currentUser]);

  const handlePreviousMonth = () => {
    setMonthIndex((prevMonthIndex) =>
      prevMonthIndex > 0 ? prevMonthIndex - 1 : 0
    );
  };

  const handleNextMonth = () => {
    setMonthIndex((prevMonthIndex) =>
      prevMonthIndex < 11 ? prevMonthIndex + 1 : 11
    );
  };

  return (
    <div className="w-96 h-58 p-4 bg-white rounded-3xl shadow-md relative">
      <FetchCurrentUser setCurrentUser={setCurrentUser} />
      {error && <p className="text-red-500">{error}</p>}
      <Bar
        data={chartData}
        options={{
          scales: {
            y: {
              beginAtZero: true,
            },
          },
          plugins: {
            legend: {
              labels: {
                font: {
                  weight: "bold", // 太文字に設定
                },
              },
            },
          },
        }}
      />
      <button
        onClick={handlePreviousMonth}
        className="absolute top-6 right-7 transform -rotate-90"
      >
        <FiTriangle />
      </button>
      <button
        onClick={handleNextMonth}
        className="absolute top-6 right-3 transform rotate-90"
      >
        <FiTriangle />
      </button>
    </div>
  );
};

export default GraphDailyEarnings;
