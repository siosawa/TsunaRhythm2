"use client";
import { useState, useEffect } from "react";
import GroupChat from "@/app/room/components/GroupChat";
import RoomExitButton from "@/app/room/components/RoomExit";
import FetchCurrentUser from "@/components/FetchCurrentUser";
import WaitingUserAvatar from "@/app/room/components/WaitingUserAvatar";
import { SetTimer } from "@/app/room/components/SetTimer";

export default function Timer({ params }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userAvatars, setUserAvatars] = useState([]);
  const room_id = parseInt(params.id, 10); // URLから取得したidをroom_idとして使用

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
  }, [currentUser, room_id]);

  // 動的インポートと条件付きレンダリング
  let RoomComponent;
  if (room_id === 1) {
    RoomComponent = require("@/components/room/StandardCafe").default;
  } else if (room_id === 2) {
    RoomComponent = require("@/components/room/CalmCafe").default;
  } else if (room_id === 3) {
    RoomComponent = require("@/components/room/Universe").default;
  } else if (room_id === 4) {
    RoomComponent = require("@/components/room/FrameBeach").default;
  } else if (room_id === 5) {
    RoomComponent = require("@/components/room/NewNomalCafe").default;
  } else if (room_id === 6) {
    RoomComponent = require("@/components/room/CountryHouse").default;
    // } else if (room_id === 7) {
    //   RoomComponent = require("@/components/room/ModernCafe").default;
    // } else if (room_id === 8) {
    //   RoomComponent = require("@/components/room/ModernLiving").default;
    // } else if (room_id === 9) {
    //   RoomComponent = require("@/components/room/DiningRoom").default;
  } else {
    return <div>Invalid room ID</div>;
  }

  return (
    <>
      <FetchCurrentUser setCurrentUser={setCurrentUser} />
      <RoomComponent />
      <div className="absolute z-40 mx-10 mt-20 flex flex-col items-start space-y-4">
        <SetTimer />
      </div>
      <GroupChat className="absolute z-30" room_id={room_id} />
      <RoomExitButton room_id={room_id} />
      <WaitingUserAvatar userAvatars={userAvatars} />
    </>
  );
}
