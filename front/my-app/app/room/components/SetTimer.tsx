"use client";
import React, { useState, useEffect } from "react";
import { BsAlarmFill } from "react-icons/bs";
import { BiSolidAlarmOff } from "react-icons/bi";
import axios from "axios";
import { useStopwatch } from "react-timer-hook";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ViewTimerRecord from "./ViewTimerRecord";
import FetchCurrentUser from "@/components/FetchCurrentUser";

interface User {
  id: number;
  name: string;
}

interface Project {
  id: number;
  name: string;
}

// recordsテーブルからのデータをWorkLogとして型指定する。これはTypeScript備え付けのRecordと名前が重複してしまうため
interface WorkLog {
  id: number;
  project_id: number;
  minutes: number;
  date: string;
  work_end: string | null;
}

export function SetTimer(): JSX.Element {
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [startTimestamp, setStartTimestamp] = useState<string>("");
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [workLogs, setWorkLogs] = useState<WorkLog[]>([]);
  const [projects, setProjects] = useState<Record<number, Project>>({});
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentWorkLogId, setCurrentWorkLogId] = useState<number | null>(null);
  const [dataUpdated, setDataUpdated] = useState<boolean>(false);

  const { seconds, minutes, hours, start, pause, reset, isRunning } =
    useStopwatch({ autoStart: false });

  useEffect(() => {
    const fetchWorkLogs = async () => {
      try {
        const [workLogsResponse, projectsResponse] = await Promise.all([
          axios.get<WorkLog[]>(`${process.env.NEXT_PUBLIC_API_BASE_URL}/records`, {
            withCredentials: true,
          }),
          axios.get<Project[]>(`${process.env.NEXT_PUBLIC_API_BASE_URL}/projects`, {
            withCredentials: true,
          }),
        ]);

        const projectsMap: Record<number, Project> = projectsResponse.data.reduce(
          (acc, project) => {
            acc[project.id] = project;
            return acc;
          },
          {} as Record<number, Project>
        );

        const fetchedWorkLogs = workLogsResponse.data;

        if (fetchedWorkLogs.length > 0 && fetchedWorkLogs[0].work_end === null) {
          const firstWorkLog = fetchedWorkLogs[0];
          const workLogDate = new Date(firstWorkLog.date);
          const now = new Date();
          const diff = now.getTime() - workLogDate.getTime();

          if (diff > 16 * 60 * 60 * 1000) {
            const workEndDate = new Date(
              workLogDate.getTime() + 16 * 60 * 60 * 1000
            );
            try {
              await axios.patch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/records/${firstWorkLog.id}`,
                {
                  work_end: workEndDate.toISOString(),
                  minutes: 960,
                },
                {
                  withCredentials: true,
                }
              );
              setStartTime(null);
              setStartTimestamp("");
              setDataUpdated(true);
            } catch (error) {
              console.error("記録の更新に失敗しました", error);
            }
          } else {
            setStartTime(workLogDate);
            setStartTimestamp(formatTimestamp(workLogDate));
            setCurrentWorkLogId(firstWorkLog.id);
            const offset = new Date();
            offset.setSeconds(offset.getSeconds() + Math.floor(diff / 1000));
            offset.setMinutes(offset.getMinutes() + Math.floor(diff / 60000));
            offset.setHours(offset.getHours() + Math.floor(diff / 3600000));
            reset(offset, false);
            start();
          }
        }

        setWorkLogs(fetchedWorkLogs);
        setProjects(projectsMap);
      } catch (error) {
        console.error("データの取得に失敗しました", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkLogs();
  }, []);

  const formatTimestamp = (timestamp: Date | null): string => {
    if (!timestamp) return "";
    const month = timestamp.getMonth() + 1;
    const day = timestamp.getDate();
    const hours = timestamp.getHours();
    const minutes = timestamp.getMinutes();
    return `${month}/${day} ${hours}:${minutes}`;
  };

  const handleButtonClick = () => {
    if (isRunning) {
      pause();
      stopTimer();
    } else {
      if (startTime) {
        reset(new Date(0), false);
        startTimer();
      } else {
        startTimer();
      }
    }
  };

  const startTimer = async () => {
    if (!selectedProject) {
      alert("案件名から案件を選択してください");
      return;
    }

    const now = new Date();
    setStartTime(now);
    setStartTimestamp(formatTimestamp(now));

    if (selectedProject && currentUser) {
      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/records`,
          {
            user_id: currentUser.id,
            project_id: selectedProject.id,
            minutes: 0,
            date: now.toISOString(),
          },
          {
            withCredentials: true,
          }
        );
        setCurrentWorkLogId(response.data.id);
      } catch (error) {
        console.error("記録の送信に失敗しました", error);
      }
    } else {
      console.error("案件名またはユーザーが選択されていません");
    }
    start();
  };

  const stopTimer = async () => {
    if (!startTime) {
      console.error("タイマーが開始されていません");
      return;
    }

    const now = new Date();
    const elapsedTime = (hours * 3600 + minutes * 60 + seconds) * 1000;

    if (isNaN(elapsedTime) || elapsedTime < 0) {
      console.error("無効な経過時間");
      return;
    }

    setStartTime(null);
    setStartTimestamp("");
    reset(undefined, false);

    const workLogTime = {
      minutes: Math.floor(elapsedTime / 60000),
    };

    if (!currentWorkLogId) {
      console.error("現在のレコードIDが存在しません");
      return;
    }

    try {
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/records/${currentWorkLogId}`,
        {
          minutes: workLogTime.minutes,
          work_end: now.toISOString(),
        },
        {
          withCredentials: true,
        }
      );

      if (response.status !== 200) {
        console.error(
          "記録の更新に失敗しました: ",
          response.status,
          response.statusText
        );
      } else {
        console.log("記録が正常に更新されました");
        setDataUpdated(true);
      }
    } catch (error) {
      console.error("記録の更新に失敗しました", error);
    }
  };

  return (
    <>
      <FetchCurrentUser setCurrentUser={setCurrentUser} />
      <div className="flex items-end">
        <button onClick={handleButtonClick} className="border-none bg-none">
          {isRunning ? (
            <BiSolidAlarmOff className="text-6xl" />
          ) : (
            <BsAlarmFill className="text-6xl" />
          )}
        </button>
        <div className="ml-4">
          <div className="text-3xl">
            {isRunning ? (
              `${hours}:${minutes}:${seconds}`
            ) : (
              <span className="text-base">タイマーは停止しています</span>
            )}
          </div>
          <div className="text-base">
            <p>スタート時刻: {startTimestamp || "未開始"}</p>
          </div>
        </div>
      </div>
      <div className="mt-4 flex">
        <Select onValueChange={(value) => setSelectedProject(projects[parseInt(value)])}>
          <SelectTrigger className="truncate max-w-52 whitespace-nowrap">
            <SelectValue placeholder="案件名" />
          </SelectTrigger>
          <SelectContent>
            {Object.keys(projects).length > 0 ? (
              Object.values(projects).map((project) => (
                <SelectItem key={project.id} value={project.id.toString()}>
                  {project.name}
                </SelectItem>
              ))
            ) : (
              <div className="px-4 py-2 text-sm text-gray-500">
                案件が設定されていません。ダッシュボードページで案件データを記入してください。
              </div>
            )}
          </SelectContent>
        </Select>
        <ViewTimerRecord dataUpdated={dataUpdated} />
      </div>
    </>
  );
}
