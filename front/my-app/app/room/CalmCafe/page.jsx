"use client";
import CalmCafe from "@/components/room/CalmCafe";
import { useState, useEffect } from "react";
import { SetTimer } from "@/app/room/components/SetTimer";
import GroupChat from "@/app/room/components/GroupChat";
import RoomExitButton from "@/app/room/components/RoomExit";
import FetchCurrentUser from "@/components/FetchCurrentUser";
import WaitingUserAvatar from "@/app/room/components/WaitingUserAvatar";

export default function Timer() {
  const [currentUser, setCurrentUser] = useState(null);
  const [userAvatars, setUserAvatars] = useState([]);
  const room_id = 2; // 現在のroom_idを設定

  useEffect(() => {
    const fetchRoomMembers = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/v1/room_members",
          { credentials: "include" }
        );
        if (!response.ok) throw new Error("Failed to fetch room members");
        const roomMembers = await response.json();
        const filteredUserIds = roomMembers
          .filter(
            (member) => member.room_id === room_id && member.leaved_at === null
          )
          .map((member) => member.user_id);

        // currentUserがnullの場合はリダイレクトしないようにする
        if (currentUser && !filteredUserIds.includes(currentUser.id)) {
          window.location.href = "/rooms";
          return;
        }

        const userPromises = filteredUserIds.map(async (userId) => {
          const userResponse = await fetch(
            `http://localhost:3000/api/v1/users/${userId}`
          );
          if (!userResponse.ok) throw new Error("Failed to fetch user data");
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

    if (currentUser) {
      fetchRoomMembers();
    }
  }, [currentUser]);

  return (
    <>
      <FetchCurrentUser setCurrentUser={setCurrentUser} />
      <CalmCafe />
      <div className="absolute z-40 mx-10 mt-20 flex flex-col items-start space-y-4">
        <SetTimer />
      </div>
      <GroupChat className="absolute z-30" />
      <RoomExitButton room_id={room_id} /> {/* room_idを渡す */}
      <WaitingUserAvatar userAvatars={userAvatars} />
    </>
  );
}
