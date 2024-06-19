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
    const totalSeconds = elapsedTime / 1000;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = (totalSeconds % 60).toFixed(2); //小数点第2位まで表示
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
      }, 10); //10ミリ秒から計算
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
  );
}
