"use client";
import React, { useState } from "react";
import Image from "next/image";
import RoomsData from "./components/RoomsData";
import { RiTeamFill } from "react-icons/ri";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [selectedRoom, setSelectedRoom] = useState(null);

  const handleRoomClick = (room) => {
    setSelectedRoom(room);
  };

  const handleClosePopup = () => {
    setSelectedRoom(null);
  };

  return (
    <div className="mx-6 sm:mx-8 md:mx-16 lg:mx-28 xl:mx-48 2xl:mx-96 bg-white shadow-custom-dark rounded-3xl">
      <h1 className="text-xl sm:text-2xl md:text-3xl mb-8 mt-16 pt-9 text-center">
        ルームに参加する
      </h1>
      <div className="bg-gray-200 shadow-custom-dark p-4 sm:p-6 md:p-8 w-full mx-auto md:max-w-6xl mb-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 container">
          {RoomsData.map((room) => (
            <div
              key={room.id}
              className="flex flex-col items-center p-4 border rounded-3xl bg-white cursor-pointer h-52"
              onClick={() => handleRoomClick(room)}
            >
              <div className="relative w-full h-26 flex-grow mb-2">
                <Image
                  src={room.image}
                  alt={room.name}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-lg"
                />
              </div>
              <div className="flex flex-col items-center text-center mt-auto">
                <h2 className="text-lg sm:text-xl mb-1">{room.name}</h2>
                <div className="flex items-center text-gray-500">
                  <RiTeamFill className="mr-1" />
                  {room.members}/{room.maxMembers}
                </div>
              </div>
            </div>
          ))}
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
              <Link href={`${selectedRoom.path}`} passHref>
                <Button className="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-3xl">
                  入室します
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
