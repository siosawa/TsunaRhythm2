"use client";
import StandardCafe from "@/components/room/StandardCafe";
import { useState, useEffect } from "react";
import { SetTimer } from "@/app/room/components/SetTimer";
import GroupChat from "@/app/room/components/GroupChat";
import RoomExitButton from "@/app/room/components/RoomExit";
import FetchCurrentUser from "@/components/FetchCurrentUser";
import WaitingUserAvatar from "../components/WaitingUserAvatar";

export default function Timer() {
  const [selectedProject, setSelectedProject] = useState(null); // オブジェクトに変更
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
              member.room_id === 1 &&
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
      <StandardCafe />
      <div className="absolute z-40 mx-10 mt-20 flex flex-col items-start space-y-4">
        <SetTimer />
      </div>
      <GroupChat className="absolute z-30" />
      <RoomExitButton />
      <WaitingUserAvatar userAvatars={userAvatars} />
    </>
  );
}
