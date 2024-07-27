"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import FetchCurrentUser from "@/components/FetchCurrentUser";

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

interface ProjectHourlyWage {
  name: string;
  averageHourlyWage: number;
}

const ProjectHourlyWageRanking = () => {
  const [ranking, setRanking] = useState<ProjectHourlyWage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);

  const fetchRankingData = async (userId: number) => {
    try {
      const [recordsResponse, projectsResponse] = await Promise.all([
        axios.get<Record[]>(`${process.env.NEXT_PUBLIC_API_BASE_URL}/records`, {
          withCredentials: true,
        }),
        axios.get<Project[]>(`${process.env.NEXT_PUBLIC_API_BASE_URL}/projects`, {
          withCredentials: true,
        }),
      ]);

      const records = recordsResponse.data || [];
      const projects = projectsResponse.data || [];

      // projectごとの時給平均を計算
      const projectHourlyWages: {
        [key: number]: {
          totalUnitPriceTimesQuantity: number;
          totalMinutes: number;
          projectName: string;
        };
      } = {};

      records.forEach((record) => {
        const project = projects.find((p) => p.id === record.project_id);
        if (project && project.is_completed) {
          if (!projectHourlyWages[project.id]) {
            projectHourlyWages[project.id] = {
              totalUnitPriceTimesQuantity: 0,
              totalMinutes: 0,
              projectName: project.name,
            };
          }
          projectHourlyWages[project.id].totalUnitPriceTimesQuantity +=
            project.unit_price * project.quantity;
          projectHourlyWages[project.id].totalMinutes += record.minutes;
        }
      });

      const ranking = Object.values(projectHourlyWages)
        .map((project) => ({
          name: project.projectName,
          averageHourlyWage:
            project.totalUnitPriceTimesQuantity / (project.totalMinutes / 60),
        }))
        .sort((a, b) => b.averageHourlyWage - a.averageHourlyWage); // 高い順にソート

      setRanking(ranking);
    } catch (error) {
      setError("データの取得に失敗しました。");
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchRankingData(currentUser.id);
    }
  }, [currentUser]);

  return (
    <div className="py-4 w-96 bg-white shadow-custom-dark rounded-3xl flex flex-col items-center text-center h-52 overflow-auto">
      <FetchCurrentUser setCurrentUser={setCurrentUser} />
      <p className="font-bold">プロジェクト別時給平均ランキング</p>
      {error && <p className="text-red-500">{error}</p>}
      <ul className="w-full">
        {ranking.map((project, index) => (
          <li key={index} className="flex justify-between my-1">
            <span className="w-12 text-left px-4">{index + 1}位</span>
            <span className="flex-1 text-left">{project.name}</span>
            <span className=" w-20 text-right px-4">
              {Math.floor(project.averageHourlyWage)}円
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
  
};

export default ProjectHourlyWageRanking;
