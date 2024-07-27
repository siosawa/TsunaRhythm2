"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import FetchCurrentUser from "@/components/FetchCurrentUser";
import { RiMoneyCnyCircleLine } from "react-icons/ri";
import { RiMoneyCnyCircleFill } from "react-icons/ri";

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

const MonthHWAT = () => {
  const [averageHourlyWage, setAverageHourlyWage] = useState<number>(0);
  const [totalSalary, setTotalSalary] = useState<number>(0);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);

  const fetchData = async (userId: number) => {
    try {
      const recordsResponse = await axios.get<Record[]>(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/records`,
        {
          withCredentials: true, // クッキーを含める設定
        }
      );
      const records = recordsResponse.data || [];
      console.log("Records:", records);

      const projectsResponse = await axios.get<Project[]>(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/projects`,
        {
          withCredentials: true, // クッキーを含める設定
        }
      );
      const projects = projectsResponse.data || [];
      console.log("Projects:", projects);

      // 現在の月を取得
      const currentMonth = new Date().getMonth();

      // 初期設定
      let totalSalary = 0;
      let totalMinutes = 0;

      // プロジェクトごとにループ処理を行う
      projects.forEach((project) => {
        // すでに完了しているプロジェクトだけを抽出
        if (project.is_completed) {
          // そのプロジェクトに関連するrecordsテーブルのレコードを取得
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
      const averageHourlyWage = totalMinutes
        ? (totalSalary / totalMinutes) * 60
        : 0;

      // 結果をステートに設定
      setAverageHourlyWage(Math.floor(averageHourlyWage)); // 端数を切り捨て
      setTotalSalary(Math.floor(totalSalary)); // 総給与を設定
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // currentUserの変更を監視してfetchDataを呼び出す
  useEffect(() => {
    if (currentUser) {
      fetchData(currentUser.id);
    }
  }, [currentUser]);

  return (
    <>
      <FetchCurrentUser setCurrentUser={setCurrentUser} />
      <div className="pb-3">
        <div className="w-44 h-52 bg-white shadow-custom-dark rounded-3xl flex flex-col items-center justify-center text-center">
          <div className="w-full px-4">
            <div className="flex items-center mb-2">
              <RiMoneyCnyCircleLine className="text-black mr-2 text-5xl" />
              <div className="flex flex-col text-left w-full">
                <p className="text-xs font-normal text-black">
                  今月の平均時給は
                </p>
                <div className="flex justify-between">
                  <span className="text-2xl font-bold mt-1 italic underline">
                    {averageHourlyWage}
                  </span>
                  <span className="text-2xl font-bold mt-1">&nbsp;円</span>
                </div>
              </div>
            </div>
            <div className="flex items-center mt-4">
              <RiMoneyCnyCircleFill className="text-black mr-2 text-6xl" />
              <div className="flex flex-col text-left w-full">
                <p className="text-xs font-normal text-black">
                  今月の給与合計は
                </p>
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
      </div>
    </>
  );
};

export default MonthHWAT;