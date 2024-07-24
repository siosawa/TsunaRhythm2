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

const GraphProjectWorkingMinutes = () => {
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
        borderDash: [5, 5], // 破線の設定
      },
    ],
  });

  const [monthIndex, setMonthIndex] = useState(currentMonth); // 初期値を現在の月に設定
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [projects, setProjects] = useState([]); // プロジェクトデータを保存
  const [selectedProject, setSelectedProject] = useState(
    "案件別作業時間：案件を選択してください"
  ); // 初期値を「案件別作業時間：案件を選択してください」に設定

  const fetchData = async (userId, month) => {
    try {
      const recordsResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/records`,
        {
          withCredentials: true,
        }
      );
      const projectsResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/projects`,
        {
          withCredentials: true,
        }
      );

      const records = recordsResponse.data || [];
      const projects = projectsResponse.data || [];
      setProjects(projects); // プロジェクトデータを保存

      updateChartData(records, projects, month, selectedProject);
    } catch (error) {
      setError("データの取得に失敗しました。");
      console.error("Error fetching records and projects data:", error);
    }
  };

  const updateChartData = (records, projects, month, selectedProjectName) => {
    const selectedProject = projects.find(
      (project) => project.name === selectedProjectName
    );
    const selectedProjectId = selectedProject ? selectedProject.id : null;

    const minutesPerDay = {};
    const selectedMonthRecords = records.filter(
      (record) =>
        new Date(record.date).getMonth() === month &&
        record.project_id === selectedProjectId
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

  useEffect(() => {
    if (currentUser) {
      fetchData(currentUser.id, monthIndex);
    }
  }, [currentUser, selectedProject]);

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

  const handleProjectChange = (e) => {
    setSelectedProject(e.target.value);
  };

  return (
    <div className="w-96 h-52 p-4 bg-white rounded-3xl shadow-custom-dark relative">
      <FetchCurrentUser setCurrentUser={setCurrentUser} />
      {error && <p className="text-red-500">{error}</p>}
      <div className="flex justify-center">
        <select
          value={selectedProject}
          onChange={handleProjectChange}
          className="w-72 text-sm border rounded"
        >
          <option value="案件別作業時間：案件を選択してください">
            案件別作業時間：案件を選択してください
          </option>
          {projects.map((project) => (
            <option key={project.id} value={project.name}>
              {project.name}
            </option>
          ))}
        </select>
      </div>
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
          layout: {
            padding: {
              bottom: 20, // 下のパディングを20ピクセルに設定
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

export default GraphProjectWorkingMinutes;
