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
  const [userAvatars, setUserAvatars] = useState([]);

  useEffect(() => {
    const fetchRoomMembers = async () => {
      try {
        const response = await fetch("http://localhost:3001/roomMembers");
        const roomMembers = await response.json();
        const filteredUserIds = roomMembers
          .filter(
            (member) =>
              member.room_id === 2 &&
              new Date(member.entered_at) < new Date() &&
              member.leaved_at === null
          )
          .map((member) => member.user_id);

        const userPromises = filteredUserIds.map(async (userId) => {
          const userResponse = await fetch(
            `http://localhost:3000/api/v1/users/${userId}`
          );
          return userResponse.json();
        });

        const users = await Promise.all(userPromises);
        const avatars = users.map((user) => ({
          id: user.id,
          avatarUrl: user.avatar.url,
          name: user.name,
        }));
        setUserAvatars(avatars);
      } catch (error) {
        console.error("Error fetching room members or user data:", error);
      }
    };

    fetchRoomMembers();
  }, []);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/v1/projects`, {
          credentials: "include",
        });
        const projectsData = await response.json();
        setProjects(projectsData);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    if (currentUser) {
      fetchProjects();
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
      <div
        className="absolute right-44 flex -space-x-4 z-30 p-4"
        style={{ top: "185mm" }}
      >
        {userAvatars.map((user) =>
          user.avatarUrl ? (
            <img
              key={user.id}
              src={`http://localhost:3000${user.avatarUrl}`}
              alt={user.name}
              width={80}
              height={80}
              className="rounded-full"
            />
          ) : (
            <div
              key={user.id}
              className="flex items-center justify-center bg-gray-300 text-white text-xs font-bold rounded-full"
              style={{ width: 80, height: 80, whiteSpace: "nowrap" }}
            >
              NO IMAGE
            </div>
          )
        )}
      </div>
    </>
  );
}
