"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import roomsData from "@/db/rooms.json";
import FetchCurrentUser from "@/components/FetchCurrentUser";

const Room = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentUserRoomPath, setCurrentUserRoomPath] = useState(null);

  useEffect(() => {
    const checkCurrentUserRoom = async () => {
      if (!currentUser) {
        return;
      }

      try {
        // ルームメンバーのデータを取得
        const roomMembersResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/room_members`,
          { credentials: "include" }
        );
        const roomMembers = await roomMembersResponse.json();
        console.log("ルームメンバー:", roomMembers);

        // 現在のユーザーがどのルームに入室中かをチェック（leaved_atがnull）
        const currentRoomMember = roomMembers.find(
          (member) =>
            member.user_id === currentUser.id && member.leaved_at === null
        );

        if (currentRoomMember) {
          // roomsData からルームのデータを取得
          const rooms = roomsData;
          console.log("ルームデータ:", rooms);

          // 入室中のルームのpathを見つける
          const currentRoom = rooms.find(
            (room) => room.id === currentRoomMember.room_id
          );

          if (currentRoom) {
            // リダイレクト先のルームパスを設定
            setCurrentUserRoomPath(`/room/${currentRoom.id}`);
            console.log("リダイレクト先のパス:", `/room/${currentRoom.id}`);
          }
        }
      } catch (error) {
        // エラーハンドリング
        console.error(
          "現在のユーザールームのチェック中にエラーが発生しました:",
          error
        );
      }
    };

    checkCurrentUserRoom();
  }, [currentUser]);

  useEffect(() => {
    if (currentUserRoomPath) {
      // ユーザーを現在のルームにリダイレクト
      window.location.href = currentUserRoomPath;
    }
  }, [currentUserRoomPath]);

  if (!currentUserRoomPath) {
    return (
      <div className="flex items-center justify-center h-screen">
        <FetchCurrentUser setCurrentUser={setCurrentUser} />
        <div className="flex flex-col items-center justify-center w-3/4 max-w-3xl p-12 bg-gray-300 rounded-full mt-[-165px]">
          <h1 className="text-2xl md:text-3xl mb-4 text-center">
            現在入室中のルームはありません！
          </h1>
          <Link href="/rooms">
            <p className="px-8 py-4 bg-purple-500 text-white text-center text-base md:text-xl rounded-full border-2 border-purple-500 hover:bg-purple-700 hover:border-purple-700 transition">
              ルーム一覧ページへ！
            </p>
          </Link>
        </div>
      </div>
    );
  }

  return null;
};

export default Room;
