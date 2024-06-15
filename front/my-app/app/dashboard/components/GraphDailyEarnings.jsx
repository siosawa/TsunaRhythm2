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

const GraphDailyEarnings = () => {
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

  const [monthIndex, setMonthIndex] = useState(2); // 初期値を3月（2）に設定

  const fetchData = (month) => {
    Promise.all([
      axios.get("http://localhost:3001/projects"),
      axios.get("http://localhost:3001/records"),
    ])
      .then(([projectsResponse, recordsResponse]) => {
        const projects = projectsResponse.data || [];
        const records = recordsResponse.data || [];
        const earningsPerDay = {};
        const selectedMonthRecords = records.filter(
          (record) => new Date(record.date).getMonth() === month
        );

        selectedMonthRecords.forEach((record) => {
          const project = projects.find((p) => p.id === record.project_id);
          if (project) {
            const date = new Date(record.date).toLocaleDateString();
            if (!earningsPerDay[date]) {
              earningsPerDay[date] = 0;
            }
            const dailyEarnings = project.unitPrice * project.quantity;
            earningsPerDay[date] += dailyEarnings;
          }
        });

        const year = new Date().getFullYear();

        setChartData({
          labels: Object.keys(earningsPerDay),
          datasets: [
            {
              label: `${year}年${month + 1}月の日毎の稼いだ金額合計`,
              data: Object.values(earningsPerDay),
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

export default GraphDailyEarnings;
