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

        setRecords(recordsResponse.data);
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
    const now = new Date();
    setStartTime(now);
    setStartTimestamp(formatTimestamp(now));
    setIsRunning(true);
    setElapsedTime(0);

    if (selectedProject) {
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
    }
  };

  const stopTimer = async () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    const now = new Date();
    const diff = now.getTime() - startTime.getTime();
    setElapsedTime(diff);
    setIsRunning(false);
    const recordTime = formatRecordTime(diff);

    if (currentRecordId) {
      try {
        await axios.patch(
          `http://localhost:3000/api/v1/records/${currentRecordId}`,
          {
            minutes: recordTime.minutes,
            date: now.toISOString(),
          },
          {
            withCredentials: true,
          }
        );
      } catch (error) {
        console.error("記録の更新に失敗しました", error);
      }
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
            {Object.values(projects).map((project) => (
              <SelectItem key={project.id} value={project.id}>
                {project.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <ViewTimerRecord />
      </div>
    </>
  );
}
