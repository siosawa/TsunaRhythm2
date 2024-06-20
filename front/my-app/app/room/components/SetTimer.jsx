"use client";
import React, { useState, useRef, useEffect } from "react";
import { BsAlarmFill } from "react-icons/bs";
import { BiSolidAlarmOff } from "react-icons/bi";
import axios from "axios";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ViewTimerRecord from "./ViewTimerRecord";
import FetchCurrentUser from "@/components/FetchCurrentUser";

export function SetTimer() {
  const [isRunning, setIsRunning] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [startTimestamp, setStartTimestamp] = useState("");
  const intervalRef = useRef(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [records, setRecords] = useState([]);
  const [projects, setProjects] = useState({});
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentRecordId, setCurrentRecordId] = useState(null);
  const [dataUpdated, setDataUpdated] = useState(false);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const [recordsResponse, projectsResponse] = await Promise.all([
          axios.get("http://localhost:3000/api/v1/records", {
            withCredentials: true,
          }),
          axios.get("http://localhost:3000/api/v1/projects", {
            withCredentials: true,
          }),
        ]);

        const projectsMap = projectsResponse.data.reduce((acc, project) => {
          acc[project.id] = project;
          return acc;
        }, {});

        const fetchedRecords = recordsResponse.data;

        // 取得した最初のレコードのwork_endがnullの場合の処理
        if (fetchedRecords.length > 0 && fetchedRecords[0].work_end === null) {
          const firstRecord = fetchedRecords[0];
          const recordDate = new Date(firstRecord.date);
          const now = new Date();
          const diff = now.getTime() - recordDate.getTime();

          // 16時間以上経過している場合
          if (diff > 16 * 60 * 60 * 1000) {
            const workEndDate = new Date(
              recordDate.getTime() + 16 * 60 * 60 * 1000
            ); // 16時間後
            try {
              await axios.patch(
                `http://localhost:3000/api/v1/records/${firstRecord.id}`,
                {
                  work_end: workEndDate.toISOString(),
                  minutes: 960,
                },
                {
                  withCredentials: true,
                }
              );
              // タイマーを途中からスタートさせない
              setStartTime(null);
              setElapsedTime(0);
              setIsRunning(false);
              setDataUpdated(true); // 追加: データ更新をトリガー
            } catch (error) {
              console.error("記録の更新に失敗しました", error);
            }
          } else {
            setStartTime(recordDate);
            setElapsedTime(diff);
            setIsRunning(true);
            setStartTimestamp(formatTimestamp(recordDate));
            setCurrentRecordId(firstRecord.id);

            intervalRef.current = setInterval(() => {
              setElapsedTime(Date.now() - recordDate.getTime());
            }, 10);
          }
        }

        setRecords(fetchedRecords);
        setProjects(projectsMap);
      } catch (error) {
        console.error("データの取得に失敗しました", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, []);

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "";
    const month = timestamp.getMonth() + 1;
    const day = timestamp.getDate();
    const hours = timestamp.getHours();
    const minutes = timestamp.getMinutes();
    return `${month}/${day} ${hours}:${minutes}`;
  };

  const formatElapsedTime = (elapsedTime) => {
    const totalSeconds = elapsedTime / 1000;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = (totalSeconds % 60).toFixed(2);
    return `${minutes}:${seconds}`;
  };

  const formatRecordTime = (elapsedTime) => {
    const totalSeconds = Math.floor(elapsedTime / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return { minutes, seconds };
  };

  useEffect(() => {
    if (isRunning && startTime) {
      intervalRef.current = setInterval(() => {
        setElapsedTime(Date.now() - startTime.getTime());
      }, 10);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRunning, startTime]);

  const startTimer = async () => {
    if (!selectedProject) {
      alert("案件名から案件を選択してください");
      return;
    }

    const now = new Date();
    setStartTime(now);
    setStartTimestamp(formatTimestamp(now));
    setIsRunning(true);
    setElapsedTime(0);

    if (selectedProject && currentUser) {
      try {
        const response = await axios.post(
          "http://localhost:3000/api/v1/records",
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
        setCurrentRecordId(response.data.id);
      } catch (error) {
        console.error("記録の送信に失敗しました", error);
      }
    } else {
      console.error("プロジェクトまたはユーザーが選択されていません");
    }
  };

  const stopTimer = async () => {
    if (!startTime) {
      console.error("タイマーが開始されていません");
      return;
    }

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    const now = new Date();
    const diff = now.getTime() - startTime.getTime();

    if (isNaN(diff) || diff < 0) {
      console.error("無効な経過時間");
      return;
    }

    setIsRunning(false);

    // 状態の更新を非同期処理の前に行う
    setElapsedTime(diff);

    const recordTime = formatRecordTime(diff);

    if (!currentRecordId) {
      console.error("現在のレコードIDが存在しません");
      return;
    }

    try {
      const response = await axios.patch(
        `http://localhost:3000/api/v1/records/${currentRecordId}`,
        {
          minutes: recordTime.minutes,
          work_end: now.toISOString(), // work_endを現在時刻で更新
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
        setDataUpdated(true); // 追加: データ更新をトリガー
      }
    } catch (error) {
      console.error("記録の更新に失敗しました", error);
    }
  };

  const handleButtonClick = () => {
    if (isRunning) {
      stopTimer();
    } else {
      startTimer();
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
            {elapsedTime !== null ? (
              formatElapsedTime(elapsedTime)
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
        <Select onValueChange={(value) => setSelectedProject(projects[value])}>
          <SelectTrigger className="truncate max-w-52 whitespace-nowrap">
            <SelectValue placeholder="案件名" />
          </SelectTrigger>
          <SelectContent>
            {Object.keys(projects).length > 0 ? (
              Object.values(projects).map((project) => (
                <SelectItem key={project.id} value={project.id}>
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
