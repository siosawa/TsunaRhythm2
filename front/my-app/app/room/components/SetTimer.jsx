"use client";
import React, { useState, useRef, useEffect } from "react";
import { BsAlarmFill } from "react-icons/bs";
import { BiSolidAlarmOff } from "react-icons/bi";

export function SetTimer({ selectedProject, addTimerRecord }) {
  const [isRunning, setIsRunning] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(null);
  const [startTimestamp, setStartTimestamp] = useState("");
  const intervalRef = useRef(null);

  const formatTimestamp = (timestamp) => {
    const month = timestamp.getMonth() + 1;
    const day = timestamp.getDate();
    const hours = timestamp.getHours();
    const minutes = timestamp.getMinutes();
    return `${month}/${day} ${hours}:${minutes}`; // 月/日 時:分
  };

  const formatElapsedTime = (elapsedTime) => {
    const totalSeconds = Math.floor(elapsedTime / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}分${seconds}秒`;
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
      }, 1000);
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

  const startTimer = () => {
    const now = new Date();
    setStartTime(now);
    setStartTimestamp(formatTimestamp(now));
    setIsRunning(true);
    setElapsedTime(0);
  };

  const stopTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    const now = new Date();
    const diff = now.getTime() - startTime.getTime();
    setElapsedTime(diff);
    setIsRunning(false);
    const recordTime = formatRecordTime(diff);
    addTimerRecord({
      date: startTime,
      minutes: recordTime.minutes,
      seconds: recordTime.seconds,
      project: selectedProject,
    });
  };

  const handleButtonClick = () => {
    if (selectedProject) {
      if (isRunning) {
        stopTimer();
      } else {
        startTimer();
      }
    } else {
      alert("案件を選択してください");
    }
  };

  return (
    <div>
      <button onClick={handleButtonClick} className="border-none bg-none">
        {isRunning ? (
          <BiSolidAlarmOff className="text-6xl" />
        ) : (
          <BsAlarmFill className="text-6xl" />
        )}
      </button>
      <div>
        {elapsedTime !== null
          ? formatElapsedTime(elapsedTime)
          : "タイマーは停止しています"}
      </div>
      <div>
        <p>スタート時刻: {startTimestamp || "未開始"}</p>
      </div>
    </div>
  );
}
