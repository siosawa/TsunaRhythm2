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
import FetchCurrentUser from "@/components/FetchCurrentUser";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Recordの型を定義
interface Record {
  id: number;
  user_id: number;
  project_id: number;
  minutes: number;
  date: string;
  created_at: string;
  updated_at: string;
  work_end: string;
}

interface CurrentUser {
  id: number;
  name: string;
  email: string;
  following: number;
  followers: number;
  posts_count: number;
  work: string;
  profile_text: string;
  avatar: {
    url: string;
  };
}

const GraphWorkingMinutes = () => {
  const currentMonth = new Date().getMonth(); // 現在の月を取得
  const [chartData, setChartData] = useState({
    labels: [] as string[],
    datasets: [
      {
        label: "",
        data: [] as number[],
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
        borderDash: [5, 5], // 破線の設定
      },
    ],
  });

  const [monthIndex, setMonthIndex] = useState<number>(currentMonth); // 初期値を現在の月に設定
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);

  const fetchData = async (userId: number, month: number) => {
    try {
      const response = await axios.get<Record[]>(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/records`,
        {
          withCredentials: true,
        }
      );
      const records = response.data || [];
      const minutesPerDay: { [key: string]: number } = {};
      const selectedMonthRecords = records.filter(
        (record) => new Date(record.date).getMonth() === month
      );

      selectedMonthRecords.forEach((record) => {
        const date = new Date(record.date).toLocaleDateString();
        if (!minutesPerDay[date]) {
          minutesPerDay[date] = 0;
        }
        minutesPerDay[date] += record.minutes;
      });

      const totalMinutes = selectedMonthRecords.reduce(
        (sum, record) => sum + record.minutes,
        0
      );
      const totalHours = (totalMinutes / 60).toFixed(1); // 小数点第一位まで表示

      const year = new Date().getFullYear();

      setChartData({
        labels: Object.keys(minutesPerDay),
        datasets: [
          {
            label: `${year}年${month + 1}月の作業時間(分) 計: ${totalHours}時間`,
            data: Object.values(minutesPerDay),
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
            borderDash: [5, 5], // 破線の設定
          },
        ],
      });
    } catch (error) {
      setError("データの取得に失敗しました。");
      console.error("Error fetching records data:", error);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchData(currentUser.id, currentMonth); // 初回ロード時に現在の月のデータを取得
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      fetchData(currentUser.id, monthIndex);
    }
  }, [currentUser, monthIndex]);

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
    <div className="w-96 h-56 p-6 bg-white rounded-3xl shadow-custom-dark relative">
      <div className="absolute top-4 right-4 flex space-x-0">
        <button onClick={handlePreviousMonth}>
          <FiTriangle style={{ transform: 'rotate(270deg)' }} />
        </button>
        <button onClick={handleNextMonth}>
          <FiTriangle style={{ transform: 'rotate(90deg)' }} />
        </button>
      </div>
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
    </div>
  );
};

export default GraphWorkingMinutes;
