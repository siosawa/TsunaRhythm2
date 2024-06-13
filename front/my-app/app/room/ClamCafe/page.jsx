"use client";
import ClamCafe from "@/components/room/ClamCafe";
import { ProjectSelection } from "@/app/room/components/ProjectSelection";
import { useState } from "react";
import { SetTimer } from "@/app/room/components/SetTimer";
import { ViewTimerRecord } from "@/app/room/components/ViewTimerRecord";
import GroupChat from "../components/GroupChat";

const projects = [
  '"Tech Today" Webメディアの記事執筆',
  '"SEO Pro" 対策コンテンツの作成',
  '"Gadget Guru" 商品紹介ブログのライティング',
  '"NextGen Tech" 技術ドキュメントの作成',
  '"Social Buzz" ソーシャルメディアの投稿作成',
  '"Business Insights" 企業のニュースレター執筆',
  '"Health & Wellness" 電子書籍のゴーストライティング',
];

export default function Timer() {
  const [selectedProject, setSelectedProject] = useState("");
  const [timerRecords, setTimerRecords] = useState([]);

  const addTimerRecord = (record) => {
    setTimerRecords([...timerRecords, record]);
  };

  return (
    <>
      <ClamCafe />
      <div className="absolute z-30 mx-10 mt-20 flex flex-col items-start space-y-4">
        <SetTimer
          selectedProject={selectedProject}
          addTimerRecord={addTimerRecord}
        />
        <ProjectSelection
          projects={projects}
          setSelectedProject={setSelectedProject}
        />
        <ViewTimerRecord
          timerRecords={timerRecords}
          setTimerRecords={setTimerRecords}
          projects={projects}
        />
      </div>
      <GroupChat className="absolute z-30" />
    </>
  );
}
