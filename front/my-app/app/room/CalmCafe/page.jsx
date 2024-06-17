"use client";
import CalmCafe from "@/components/room/CalmCafe";
import { ProjectSelection } from "@/app/room/components/ProjectSelection";
import { useState, useEffect } from "react";
import { SetTimer } from "@/app/room/components/SetTimer";
import { ViewTimerRecord } from "@/app/room/components/ViewTimerRecord";
import GroupChat from "@/app/room/components/GroupChat";
import RoomExitButton from "@/app/room/components/RoomExit";
import FetchCurrentUser from "@/components/FetchCurrentUser";

export default function Timer() {
  const [selectedProject, setSelectedProject] = useState("");
  const [timerRecords, setTimerRecords] = useState([]);
  const [projects, setProjects] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchProjects = async (userId) => {
      try {
        const response = await fetch(
          `http://localhost:3001/projects?user_id=${userId}`
        );
        const projectsData = await response.json();
        setProjects(projectsData);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    if (currentUser) {
      fetchProjects(currentUser.id);
    }
  }, [currentUser]);

  const addTimerRecord = (record) => {
    setTimerRecords([...timerRecords, record]);
  };

  return (
    <>
      <FetchCurrentUser setCurrentUser={setCurrentUser} />
      <CalmCafe />
      <div className="absolute z-30 mx-10 mt-20 flex flex-col items-start space-y-4">
        <SetTimer
          selectedProject={selectedProject}
          addTimerRecord={addTimerRecord}
        />
        <ProjectSelection
          projects={projects.map((project) => project.name)} // プロジェクト名（name）を渡す
          setSelectedProject={setSelectedProject}
        />
      </div>
      <div className="absolute z-30 mx-10 mt-52">
        <ViewTimerRecord
          timerRecords={timerRecords}
          setTimerRecords={setTimerRecords}
          projects={projects.map((project) => project.name)} // プロジェクト名（name）を渡す
        />
      </div>
      <GroupChat className="absolute z-30" />
      <RoomExitButton />
    </>
  );
}
