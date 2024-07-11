"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import FetchCurrentUser from "@/components/FetchCurrentUser";
import { RiMoneyCnyCircleLine } from "react-icons/ri";
import { RiMoneyCnyCircleFill } from "react-icons/ri";

const MonthHWAT = () => {
  const [averageHourlyWage, setAverageHourlyWage] = useState(0);
  const [totalSalary, setTotalSalary] = useState(0);
  const [currentUser, setCurrentUser] = useState(null);
  const fetchData = async (userId) => {
    try {
      const recordsResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/records`,
        {
          withCredentials: true, //クッキーを含める設定
        }
      );
      const records = recordsResponse.data || [];
      console.log("Records:", records);

      const projectsResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/projects`,
        {
          withCredentials: true, //クッキーを含める設定
        }
      );
      const projects = projectsResponse.data || [];
      console.log("Projects:", projects);

      // 現在の月を取得
      const currentMonth = new Date().getMonth();

      // 初期設定を忘れずに
      let totalSalary = 0;
      let totalMinutes = 0;

      // おそらくmap関数でも可能。projectごとにループ処理を行う。
      projects.forEach((project) => {
        // すでに完了しているプロジェクトだけを抽出
        if (project.is_completed) {
          // そのプロジェクトに関連するrecordsテーブルのレコードを取得。テーブル名わかりづらいかも？
          const projectRecords = records.filter(
            (record) => record.project_id === project.id
          );

          // プロジェクトの総作業時間を計算
          const totalProjectMinutes = projectRecords.reduce(
            (acc, record) => acc + record.minutes,
            0
          );

          // プロジェクトの平均時給を計算
          const projectAverageHourlyWage =
            (project.unit_price * project.quantity) /
            (totalProjectMinutes / 60);

          // 現在の月のレコードのみをフィルタリング
          const currentMonthRecords = projectRecords.filter(
            (record) => new Date(record.date).getMonth() === currentMonth
          );

          // 現在の月のプロジェクトの総作業時間を計算
          const currentMonthProjectMinutes = currentMonthRecords.reduce(
            (acc, record) => acc + record.minutes,
            0
          );

          // プロジェクトの平均時給に現在の月の総作業時間を掛けて給与総額を算出
          totalSalary +=
            projectAverageHourlyWage * (currentMonthProjectMinutes / 60);
          totalMinutes += currentMonthProjectMinutes; // 現在の月の総作業時間を累計
        }
      });

      // 今月の平均時給を計算
      const averageHourlyWage = (totalSalary / totalMinutes) * 60;

      // 結果をステートに設定
      setAverageHourlyWage(Math.floor(averageHourlyWage)); // 端数を切り捨て
      setTotalSalary(Math.floor(totalSalary)); // 総給与を設定
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchData(currentUser.id);
    }
  }, [currentUser]);

  return (
    <>
      <FetchCurrentUser setCurrentUser={setCurrentUser} />
      <div className="w-[5cm] h-52 bg-white shadow-custom-dark rounded-3xl flex flex-col items-center justify-center text-center">
        <div className="w-full px-4">
          <div className="flex items-center mb-2">
            <RiMoneyCnyCircleLine className="text-black mr-2 text-5xl" />
            <div className="flex flex-col text-left w-full">
              <p className="text-xs font-normal text-black">今月の平均時給は</p>
              <div className="flex justify-between">
                <span className="text-2xl font-bold mt-1 italic underline">
                  {averageHourlyWage}
                </span>
                <span className="text-2xl font-bold mt-1">&nbsp;円</span>
              </div>
            </div>
          </div>
          <div className="flex items-center mt-4">
            <RiMoneyCnyCircleFill className="text-black mr-2 text-5xl" />
            <div className="flex flex-col text-left w-full">
              <p className="text-xs font-normal text-black">今月の給与合計は</p>
              <div className="flex justify-between">
                <span className="text-2xl font-bold mt-1 italic underline">
                  {totalSalary}
                </span>
                <span className="text-2xl font-bold mt-1">&nbsp;円</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MonthHWAT;
