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

  const fetchData = (month) => {
    Promise.all([
      axios.get("http://localhost:3001/projects"),
      axios.get("http://localhost:3001/records"),
    ])
      .then(([projectsResponse, recordsResponse]) => {
        const projects = projectsResponse.data || [];
        const records = recordsResponse.data || [];
        const hourlyRatePerDay = {};
        const selectedMonthRecords = records.filter(
          (record) => new Date(record.date).getMonth() === month
        );

        selectedMonthRecords.forEach((record) => {
          const project = projects.find((p) => p.id === record.project_id);
          if (project) {
            const date = new Date(record.date).toLocaleDateString();
            if (!hourlyRatePerDay[date]) {
              hourlyRatePerDay[date] = 0;
            }
            const hourlyRate =
              (project.unitPrice * project.quantity) / (record.minutes / 60);
            hourlyRatePerDay[date] += hourlyRate;
          }
        });

        const year = new Date().getFullYear();

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
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  useEffect(() => {
    fetchData(monthIndex);
  }, [monthIndex]);

  useEffect(() => {
    fetchData(currentMonth); // 初回ロード時に現在の月のデータを取得
  }, []);

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
    <div className="w-96 h-58 p-4 mx-7 bg-white rounded-3xl custom_shadow_dark relative">
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
