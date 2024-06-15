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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const GraphWorkingMinutes = () => {
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

  const [monthIndex, setMonthIndex] = useState(2); // 初期値を3月（2）に設定

  const fetchData = (month) => {
    axios
      .get("http://localhost:3001/records")
      .then((response) => {
        const records = response.data || [];
        const minutesPerDay = {};
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
      })
      .catch((error) => {
        console.error("Error fetching records data:", error);
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

export default GraphWorkingMinutes;
