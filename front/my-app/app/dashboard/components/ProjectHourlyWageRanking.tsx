"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import FetchCurrentUser from "@/components/FetchCurrentUser";

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

interface ProjectHourlyWage {
  name: string;
  averageHourlyWage: number;
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

const ProjectHourlyWageRanking = (): JSX.Element => {
  const [ranking, setRanking] = useState<ProjectHourlyWage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);

  const fetchRankingData = async (userId: number) => {
    try {
      const [recordsResponse, projectsResponse] = await Promise.all([
        axios.get<Record[]>(`${process.env.NEXT_PUBLIC_API_BASE_URL}/records`, {
          withCredentials: true,
        }),
        axios.get<Project[]>(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/projects`,
          {
            withCredentials: true,
          }
        ),
      ]);

      const records = recordsResponse.data || [];
      const projects = projectsResponse.data || [];

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
    <>
      <FetchCurrentUser setCurrentUser={setCurrentUser} />
      <div className="w-96 h-56 text-xm bg-white shadow-custom-dark rounded-3xl flex flex-col items-center text-center overflow-auto border-2 border-orange-500">
        <p className="w-full py-2 bg-orange-400 text-white font-bold sticky top-0 z-10">
          案件別時給平均ランキング
        </p>
        {error && <p className="text-red-500">{error}</p>}
        <ul className="w-full">
          {ranking.map((project, index) => (
            <li
              key={index}
              className={`flex justify-between my-1 ${
                index % 2 === 0 ? "bg-orange-100" : "bg-orange-200"
              }`}
            >
              <span className="w-16 text-left px-4">{index + 1}位</span>
              <span className="flex-1 text-left">{project.name}</span>
              <span className="w-28 text-right px-4">
                {Math.floor(project.averageHourlyWage)}円
              </span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default ProjectHourlyWageRanking;
