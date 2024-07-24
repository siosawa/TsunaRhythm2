"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { FiTriangle } from "react-icons/fi";
import FetchCurrentUser from "@/components/FetchCurrentUser"; // FetchCurrentUserをインポート

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const GraphHourlyRate = () => {
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
        tension: 0.4, // ラインのテンションを設定して波線にする
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
      const hourlyRatePerDay = {};
      const earningsPerDay = {}; // 日毎の稼いだ金額
      const workMinutesPerDay = {}; // 日毎の作業時間
      const selectedMonthRecords = records.filter(
        (record) => new Date(record.date).getMonth() === month
      );

      const year = new Date().getFullYear();

      projects.forEach((project) => {
        if (project.is_completed) {
          // 完了しているプロジェクトのみ考慮
          const projectRecords = selectedMonthRecords.filter(
            (record) => record.project_id === project.id
          );
          const totalWorkMinutes = projectRecords.reduce(
            (total, record) => total + record.minutes,
            0
          );

          const averageHourlyWage =
            (project.unit_price * project.quantity) / (totalWorkMinutes / 60);

          projectRecords.forEach((record) => {
            const date = new Date(record.date).toLocaleDateString();
            if (!earningsPerDay[date]) {
              earningsPerDay[date] = 0;
              workMinutesPerDay[date] = 0;
            }

            // recordsの作業分数と時給を分給に直したものをかけて稼いだ金額を出力
            const dailyEarnings = record.minutes * (averageHourlyWage / 60);

            // 日毎に稼いだ金額を加算していくことで日毎の稼いだ金額合計を出力
            earningsPerDay[date] += dailyEarnings;

            // 日毎の作業時間を加算していくことで日毎の作業時間合計を出力
            workMinutesPerDay[date] += record.minutes;
          });
        }
      });

      Object.keys(earningsPerDay).forEach((date) => {
        hourlyRatePerDay[date] =
          earningsPerDay[date] / (workMinutesPerDay[date] / 60);
      });

      setChartData({
        labels: Object.keys(hourlyRatePerDay),
        datasets: [
          {
            label: `${year}年${month + 1}月の日毎の時給`,
            data: Object.values(hourlyRatePerDay),
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
            tension: 0.4, // ラインのテンションを設定して波線にする
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
    <div className="w-96 h-58 p-4 bg-white rounded-3xl shadow-custom-dark relative">
      <FetchCurrentUser setCurrentUser={setCurrentUser} />
      {error && <p className="text-red-500">{error}</p>}
      <Line
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
          elements: {
            line: {
              tension: 0.4, // ラインのテンションを設定して波線にする
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

export default GraphHourlyRate;
