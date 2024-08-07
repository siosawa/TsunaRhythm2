"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { RiTeamFill } from "react-icons/ri";
import { Button } from "@/components/ui/button";
import axios from "axios";
import roomsData from "@/db/rooms.json";
import FetchCurrentUser from "@/components/FetchCurrentUser";

const Index = () => {
  const [rooms, setRooms] = useState([]);
  const [roomMembers, setRoomMembers] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // roomsData からルームのデータを設定
    setRooms(roomsData);

    const fetchRoomMembers = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/room_members`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        const data = await response.json();

        // 3時間以上経過したメンバーのleaved_atを更新
        const now = new Date();
        const updatedMembers = await Promise.all(
          data.map(async (member) => {
            if (
              member.leaved_at === null &&
              (now - new Date(member.entered_at)) / (1000 * 60 * 60) >= 3 //3日以上入室しているユーザーがいたら強制退出処置
            ) {
              try {
                await axios.patch(
                  `${process.env.NEXT_PUBLIC_API_BASE_URL}/room_members/${member.id}`,
                  { leaved_at: now.toISOString() },
                  { withCredentials: true }
                );
                return { ...member, leaved_at: now.toISOString() };
              } catch (error) {
                console.error("Error updating leaved_at:", error);
                return member;
              }
            }
            return member;
          })
        );

        setRoomMembers(updatedMembers);
      } catch (error) {
        console.error("Error fetching room members:", error);
      }
    };

    fetchRoomMembers();
  }, []);

  const getCurrentMembersCount = (roomId) => {
    const now = new Date();
    return roomMembers.filter(
      (member) =>
        member.room_id === roomId &&
        member.leaved_at === null &&
        new Date(member.entered_at) <= now
    ).length;
  };

  const handleRoomClick = (room) => {
    if (getCurrentMembersCount(room.id) < room.maxMembers) {
      setSelectedRoom(room);
    }
  };

  const handleClosePopup = () => {
    setSelectedRoom(null);
  };

  const handleJoinRoom = async () => {
    if (!selectedRoom || !currentUser) return;

    const existingMember = roomMembers.find(
      (member) => member.user_id === currentUser.id && member.leaved_at === null
    );

    if (existingMember) {
      try {
        // PATCHリクエストでleaved_atを更新
        await axios.patch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/room_members/${existingMember.id}`,
          { leaved_at: new Date().toISOString() },
          { withCredentials: true }
        );

        // room_id に基づいて seats を取得し、user_id が currentUser.id と一致するレコードを削除
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/seats?room_id=${existingMember.room_id}`,
          { withCredentials: true }
        );
        const seats = response.data;

        const deletePromises = seats
          .filter((seat) => seat.user_id === currentUser.id)
          .map((seat) =>
            axios.delete(
              `${process.env.NEXT_PUBLIC_API_BASE_URL}/seats/${seat.id}`,
              {
                withCredentials: true,
              }
            )
          );

        await Promise.all(deletePromises);
      } catch (error) {
        console.error("Error updating leaved_at or deleting seats:", error);
        return;
      }
    }

    const newRoomMember = {
      user_id: currentUser.id,
      room_id: selectedRoom.id,
      entered_at: new Date().toISOString(),
      leaved_at: null,
    };

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/room_members`,
        newRoomMember,
        { withCredentials: true }
      );
      setRoomMembers([newRoomMember, ...roomMembers]);
      console.log(selectedRoom);
      window.location.href = `/room/${selectedRoom.id}`;
    } catch (error) {
      console.error("Error joining room:", error);
    }
  };

  return (
    <>
      <FetchCurrentUser setCurrentUser={setCurrentUser} />

      <div className="mx-6 sm:mx-8 md:mx-16 lg:mx-28 xl:mx-48 2xl:mx-96 bg-white shadow-custom-dark rounded-3xl">
        <h1 className="text-xl sm:text-2xl md:text-3xl mb-8 mt-16 pt-9 text-center">
          ルームに参加する
        </h1>
        <div className="bg-gray-200 shadow-custom-dark p-4 sm:p-6 md:p-8 w-full mx-auto md:max-w-6xl mb-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 container">
            {rooms.map((room) => {
              const isFull = getCurrentMembersCount(room.id) >= room.maxMembers;
              return (
                <div
                  key={room.id}
                  className={`flex flex-col items-center p-4 border rounded-3xl bg-white cursor-pointer h-52 ${isFull ? "opacity-70 cursor-not-allowed" : ""}`}
                  onClick={() => handleRoomClick(room)}
                  style={{ pointerEvents: isFull ? "none" : "auto" }}
                >
                  <div className="relative w-full h-26 flex-grow mb-2">
                    <Image
                      src={room.image}
                      alt={room.name}
                      fill
                      style={{ objectFit: "cover" }}
                      className="rounded-lg"
                    />
                  </div>
                  <div className="flex flex-col items-center text-center mt-auto">
                    <h2 className="text-lg md:text-base xl:text-sm 2xl:text-xs mb-1 whitespace-nowrap overflow-hidden text-ellipsis">
                      {room.name}
                    </h2>
                    <div className="flex items-center text-gray-500">
                      <RiTeamFill className="mr-1" />
                      {getCurrentMembersCount(room.id)}/{room.maxMembers}
                    </div>
                    {isFull && (
                      <div className="text-red-500 mt-2">
                        このルームは満室です
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {selectedRoom && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <h2 className="text-xl mb-4">
                {selectedRoom.name}に入室しますか？
              </h2>
              <div className="flex justify-center">
                <Button
                  onClick={handleClosePopup}
                  className="mr-4 px-4 py-2 rounded-3xl bg-gray-500 hover:bg-gray-600 text-white"
                >
                  いいえ
                </Button>
                <Button
                  onClick={handleJoinRoom}
                  className="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-3xl"
                >
                  入室します
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Index;
