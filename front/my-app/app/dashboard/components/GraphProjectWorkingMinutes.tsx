"use client";
import axios from "axios";
import { useEffect, useState, ChangeEvent } from "react";
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

// Chart.jsの設定を登録
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// ProjectとRecordの型を定義
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

const GraphProjectWorkingMinutes = () => {
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
  const [projects, setProjects] = useState<Project[]>([]); // プロジェクトデータを保存
  const [selectedProject, setSelectedProject] = useState<string>(
    "案件別作業時間：案件を選択"
  );

  const fetchData = async (userId: number, month: number) => {
    try {
      const [recordsResponse, projectsResponse] = await Promise.all([
        axios.get<Record[]>(`${process.env.NEXT_PUBLIC_API_BASE_URL}/records?userId=${userId}&month=${month}`, {
          withCredentials: true,
        }),
        axios.get<Project[]>(`${process.env.NEXT_PUBLIC_API_BASE_URL}/projects?userId=${userId}`, {
          withCredentials: true,
        }),
      ]);

      const records = recordsResponse.data || [];
      const projects = projectsResponse.data || [];
      setProjects(projects); // プロジェクトデータを保存

      updateChartData(records, projects, month, selectedProject);
    } catch (error) {
      setError("データの取得に失敗しました。");
      console.error("Error fetching records and projects data:", error);
    }
  };

  const updateChartData = (
    records: Record[],
    projects: Project[],
    month: number,
    selectedProjectName: string
  ) => {
    const selectedProject = projects.find(
      (project) => project.name === selectedProjectName
    );
    const selectedProjectId = selectedProject ? selectedProject.id : null;

    const minutesPerDay: { [key: string]: number } = {};
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

    // 日付順にソート
    const sortedDates = Object.keys(minutesPerDay).sort((a, b) => {
      return new Date(a).getTime() - new Date(b).getTime();
    });

    setChartData({
      labels: sortedDates,
      datasets: [
        {
          label: `${year}年${month + 1}月の作業時間(分) 計: ${totalHours}時間`,
          data: sortedDates.map(date => minutesPerDay[date]),
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

  const handleProjectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedProject(e.target.value);
  };

  return (
    <div className="w-96 h-56 px-6 bg-white rounded-3xl shadow-custom-dark relative border-2 border-orange-500">
      <div className="absolute top-4 right-2 flex space-x-0">
        <button onClick={handlePreviousMonth}>
          <FiTriangle style={{ transform: 'rotate(270deg)' }} />
        </button>
        <button onClick={handleNextMonth}>
          <FiTriangle style={{ transform: 'rotate(90deg)' }} />
        </button>
      </div>
      <FetchCurrentUser setCurrentUser={setCurrentUser} />
      {error && <p className="text-red-500">{error}</p>}
      <div className="flex justify-center">
        <select
          value={selectedProject}
          onChange={handleProjectChange}
          className="text-sm border rounded mt-4"
        >
          <option value="案件別作業時間：案件を選択する">
            案件別作業時間：案件を選択する
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
    </div>
  );
};

export default GraphProjectWorkingMinutes;
