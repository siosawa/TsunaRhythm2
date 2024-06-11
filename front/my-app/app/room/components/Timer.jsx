"use client";
import React, { useState, useRef, useEffect } from "react";
import { BsAlarmFill } from "react-icons/bs";
import { BiSolidAlarmOff } from "react-icons/bi";

function Timer() {
  const [isRunning, setIsRunning] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(null);
  const [startTimestamp, setStartTimestamp] = useState("");
  const [stopTimestamp, setStopTimestamp] = useState("");
  const intervalRef = useRef(null);

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    return `${month}/${day} ${hours}:${minutes}:${seconds}`; // 月/日 時:分:秒
  };

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setElapsedTime(Date.now() - startTime);
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning, startTime]);

  const startTimer = () => {
    const now = Date.now();
    setStartTime(now);
    setStartTimestamp(formatTimestamp(now));
    setIsRunning(true);
    setElapsedTime(null);
  };

  const stopTimer = () => {
    clearInterval(intervalRef.current);
    const now = Date.now();
    setStopTimestamp(formatTimestamp(now));
    const diff = now - startTime;
    setElapsedTime(diff);
    setIsRunning(false);
  };

  const handleButtonClick = () => {
    if (isRunning) {
      stopTimer();
    } else {
      startTimer();
    }
  };

  return (
    <div className="absolute left-16 top-32 text-center">
      <button onClick={handleButtonClick} className="border-none bg-none">
        {isRunning ? (
          <BiSolidAlarmOff className="text-6xl" />
        ) : (
          <BsAlarmFill className="text-6xl" />
        )}
      </button>
      <div>
        {elapsedTime !== null
          ? `${Math.floor(elapsedTime / 1000)} 秒`
          : "タイマーは停止しています"}
      </div>
      <div>
        <p>スタート時刻: {startTimestamp || "未開始"}</p>
        <p>ストップ時刻: {stopTimestamp || "未停止"}</p>
      </div>
    </div>
  );
}

export default Timer;
