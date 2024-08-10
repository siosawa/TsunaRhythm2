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

interface Project {
  id: number;
  user_id: number;
  company: string;
  name: string;
  work_type: string;
  unit_price: number;
  quantity: number;
  is_completed: boolean;
  created_at: string;
  updated_at: string;
}

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

const GraphDailyEarnings = () => {
  const currentMonth = new Date().getMonth();
  const [chartData, setChartData] = useState({
    labels: [] as string[],
    datasets: [
      {
        label: "",
        data: [] as number[],
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  });
  const [monthIndex, setMonthIndex] = useState<number>(currentMonth);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null); 

  const fetchData = async (userId: number, month: number) => {
    try {
      const [projectsResponse, recordsResponse] = await Promise.all([
        axios.get<Project[]>(`${process.env.NEXT_PUBLIC_API_BASE_URL}/projects`, {
          withCredentials: true,
        }),
        axios.get<Record[]>(`${process.env.NEXT_PUBLIC_API_BASE_URL}/records`, {
          withCredentials: true,
        }),
      ]);
      const projects = projectsResponse.data || [];
      const records = recordsResponse.data || [];

      const completedProjects = projects.filter(
        (project) => project.is_completed
      );

      const earningsPerDay: { [key: string]: number } = {};
      const year = new Date().getFullYear();

      const selectedMonthRecords = records.filter(
        (record) => new Date(record.date).getMonth() === month
      );

      completedProjects.forEach((project) => {
        const projectRecords = records.filter(
          (record) => record.project_id === project.id
        );
        const totalWorkMinutes = projectRecords.reduce(
          (total, record) => total + record.minutes,
          0
        );
        const averageHourlyWage =
          (project.unit_price * project.quantity) / (totalWorkMinutes / 60);

        selectedMonthRecords.forEach((record) => {
          if (record.project_id === project.id) {
            const date = new Date(record.date).toLocaleDateString();
            if (!earningsPerDay[date]) {
              earningsPerDay[date] = 0;
            }

            const dailyEarnings = record.minutes * (averageHourlyWage / 60);

            earningsPerDay[date] += dailyEarnings;
          }
        });
      });

      const sortedDates = Object.keys(earningsPerDay).sort((a, b) => {
        return new Date(a).getTime() - new Date(b).getTime();
      });

      setChartData({
        labels: sortedDates,
        datasets: [
          {
            label: `${year}年${month + 1}月の日毎の稼いだ金額合計`,
            data: sortedDates.map(date => earningsPerDay[date]),
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
      fetchData(currentUser.id, currentMonth); 
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
    <div className="w-96 h-56 p-6 bg-white rounded-3xl shadow-custom-dark relative border-2 border-orange-500">
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
                  weight: "bold",
                },
              },
            },
          },
        }}
      />
    </div>
  );
};

export default GraphDailyEarnings;
