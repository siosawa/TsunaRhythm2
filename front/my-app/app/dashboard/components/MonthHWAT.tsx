"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import FetchCurrentUser from "@/components/FetchCurrentUser";
import { RiMoneyCnyCircleLine, RiMoneyCnyCircleFill } from "react-icons/ri";

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
  profile_text: string | null;
  avatar: {
    url: string | null;
  } 

}

const MonthHWAT = (): JSX.Element => {
  const [averageHourlyWage, setAverageHourlyWage] = useState<number>(0);
  const [totalSalary, setTotalSalary] = useState<number>(0);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);

  const fetchData = async (userId: number): Promise<void> => {
    try {
      const recordsResponse = await axios.get<Record[]>(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/records`,
        {
          withCredentials: true,
        }
      );
      const records = recordsResponse.data || [];
      console.log("Records:", records);

      const projectsResponse = await axios.get<Project[]>(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/projects`,
        {
          withCredentials: true,
        }
      );
      const projects = projectsResponse.data || [];
      console.log("Projects:", projects);

      const currentMonth = new Date().getMonth();

      let totalSalary = 0;
      let totalMinutes = 0;

      projects.forEach((project) => {
        if (project.is_completed) {
          const projectRecords = records.filter(
            (record) => record.project_id === project.id
          );

          // 案件の総作業時間を計算
          const totalProjectMinutes = projectRecords.reduce(
            (acc, record) => acc + record.minutes,
            0
          );

          // 案件の平均時給を計算
          const projectAverageHourlyWage =
            (project.unit_price * project.quantity) /
            (totalProjectMinutes / 60);

          // 現在の月のレコードのみをフィルタリング
          const currentMonthRecords = projectRecords.filter(
            (record) => new Date(record.date).getMonth() === currentMonth
          );

          // 現在の月の案件の総作業時間を計算
          const currentMonthProjectMinutes = currentMonthRecords.reduce(
            (acc, record) => acc + record.minutes,
            0
          );

          // 案件の平均時給に現在の月の総作業時間を掛けて給与総額を算出
          totalSalary +=
            projectAverageHourlyWage * (currentMonthProjectMinutes / 60);
          totalMinutes += currentMonthProjectMinutes;
        }
      });

      // 今月の平均時給を計算
      const averageHourlyWage = totalMinutes
        ? (totalSalary / totalMinutes) * 60
        : 0;

      setAverageHourlyWage(Math.floor(averageHourlyWage)); 
      setTotalSalary(Math.floor(totalSalary));
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
      <div className="w-44 h-56 bg-white shadow-custom-dark rounded-3xl flex flex-col items-center justify-center text-center border-2 border-orange-500">
        <div className="w-full px-3">
          <div className="flex items-center">
            <RiMoneyCnyCircleLine className="text-black mr-2 text-4xl" />
            <div className="flex flex-col text-left w-full">
              <p className="text-xs font-normal text-black">今月の平均時給は</p>
              <div className="flex justify-between">
                <span className="text-2xl font-bold mt-1 italic underline">
                  {averageHourlyWage}
                </span>
                <span className="text-1xl font-bold mt-2">円</span>
              </div>
            </div>
          </div>
          <div className="flex items-center mt-4">
            <RiMoneyCnyCircleFill className="text-black mr-2 text-4xl" />
            <div className="flex flex-col text-left w-full">
              <p className="text-xs font-normal text-black">今月の給与合計は</p>
              <div className="flex justify-between">
                <span className="text-2xl font-bold mt-1 italic underline">
                  {totalSalary}
                </span>
                <span className="text-1xl font-bold mt-2">円</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
  
};

export default MonthHWAT;
