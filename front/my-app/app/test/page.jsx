"use client";
import React, { useEffect } from "react";
import { useStopwatch } from "react-timer-hook";

function MyStopwatch() {
  const { seconds, minutes, hours, days, isRunning, start, pause, reset } =
    useStopwatch({ autoStart: false });

  useEffect(() => {
    const offset = new Date();
    offset.setSeconds(offset.getSeconds() + 13);
    reset(offset, false);
    start();
  }, [reset, start]);
  s;

  return (
    <div>
      <div>
        <span>{days}</span>:<span>{hours}</span>:<span>{minutes}</span>:
        <span>{seconds}</span>
      </div>
      <p>{isRunning ? "Running" : "Not running"}</p>
      <button onClick={pause}>Pause</button>
      <button onClick={() => reset()}>Reset</button>
    </div>
  );
}

export default function App() {
  return (
    <div>
      <h1>My Stopwatch</h1>
      <MyStopwatch />
    </div>
  );
}
