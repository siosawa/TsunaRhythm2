"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
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
        const roomMembersResponse = await axios.get(
          "http://localhost:3001/roomMembers"
        );
        const roomMembers = roomMembersResponse.data;
        console.log("ルームメンバー:", roomMembers);

        // 現在のユーザーがどのルームに入室中かをチェック（leaved_atがnull）
        const currentRoomMember = roomMembers.find(
          (member) =>
            member.user_id === currentUser.id && member.leaved_at === null
        );

        if (currentRoomMember) {
          // ルームのデータを取得
          const roomsResponse = await axios.get("http://localhost:3001/rooms");
          const rooms = roomsResponse.data;
          console.log("ルームデータ:", rooms);

          // 入室中のルームのpathを見つける
          const currentRoom = rooms.find(
            (room) => room.id === currentRoomMember.room_id
          );

          if (currentRoom) {
            // リダイレクト先のルームパスを設定
            setCurrentUserRoomPath(`http://localhost:8000${currentRoom.path}`);
            console.log(
              "リダイレクト先のパス:",
              `http://localhost:8000${currentRoom.path}`
            );
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
        <div className="flex flex-col items-center justify-center w-3/4 max-w-3xl p-12 bg-gray-300 rounded-full">
          <h1 className="text-4xl mb-8">現在入室中のルームはありません！</h1>
          <Link href="/rooms">
            <p className="px-8 py-4 bg-purple-500 text-white text-xl rounded-full border-2 border-purple-500 hover:bg-purple-700 hover:border-purple-700 transition">
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
