"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import cable from "@/utils/cable"; 
import FetchCurrentUser from "@/components/FetchCurrentUser";
import axios from "axios";

interface User {
  id: number;
  name: string;
  avatar: {
    url: string | null;
  };
}

interface Seat {
  id: number;
  room_id: number;
  seat_id: number;
  user_id: number;
}

const FrameBeach = (): JSX.Element => {
  const [seats, setSeats] = useState<Record<number, number>>({}); 
  const [users, setUsers] = useState<Record<number, User>>({}); 
  const [currentUser, setCurrentUser] = useState<User | null>(null); 

  const seatPositions = [
    { id: 1, top: "56%", right: "23%" },
  ];

  const fetchSeatsAndUsers = async (seatsData: Seat[]) => {
    try {
      const userResponses = await Promise.all(
        seatsData.map((seat) =>
          axios.get<User>(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/${seat.user_id}`,
            {
              withCredentials: true,
              headers: {
                "Content-Type": "application/json",
              },
            }
          )
        )
      );
      const userData = userResponses.map((response) => response.data);
      setUsers(userData.reduce((acc, user) => ({ ...acc, [user.id]: user }), {}));
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchSeats = async () => {
    try {
      const response = await axios.get<Seat[]>(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/seats?room_id=4`,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setSeats(
        response.data.reduce(
          (acc, seat) => ({ ...acc, [seat.seat_id]: seat.user_id }),
          {}
        )
      );
      await fetchSeatsAndUsers(response.data);
    } catch (error) {
      console.error("Error fetching seats:", error);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchSeats();

      const subscription = cable.subscriptions.create(
        { channel: "SeatChannel", room: 4 },
        {
          received(data: Seat) {
            if (!data.user_id) {
              return; // user_id が undefined の場合、処理をスキップ
            }
            setSeats((prevSeats) => ({
              ...prevSeats,
              [data.seat_id]: data.user_id,
            }));
            if (!users[data.user_id]) {
              axios
                .get<User>(
                  `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/${data.user_id}`,
                  {
                    withCredentials: true,
                    headers: {
                      "Content-Type": "application/json",
                    },
                  }
                )
                .then((response) => {
                  const user = response.data;
                  setUsers((prevUsers) => ({
                    ...prevUsers,
                    [user.id]: user,
                  }));
                })
                .catch((error) =>
                  console.error("Error fetching user:", error)
                );
            }
          },
        }
      );

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [currentUser]); 

  const handleSeatClick = async (seatId: number) => {
    if (!currentUser) {
      console.error("User not logged in");
      return;
    }
  
    if (seats[seatId]) {
      console.error("Seat already reserved");
      return;
    }
  
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/seats`,
        {
          seat: { seat_id: seatId, room_id: 4, user_id: currentUser.id },
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        await fetchSeats();  // ここで最新の座席情報を再取得して再レンダリング
      } else {
        console.error("Failed to reserve seat");
      }
    } catch (error) {
      console.error("Error reserving seat:", error);
    }
  };
  
  const isCurrentUserAssigned = Object.values(seats).includes(currentUser?.id ?? -1);

  return (
    <>
      <FetchCurrentUser setCurrentUser={setCurrentUser} />
      <div className="flex items-center justify-center fixed inset-0 z-10">
        <div className="relative w-[500px] md:w-[550px]">
          <Image
            src="/FrameBeach.jpg"
            alt="FrameBeach"
            width={900}
            height={500}
            style={{ objectFit: "cover" }}
            priority
          />
          {seatPositions.map((seat) => (
            <div
              key={seat.id}
              className="absolute flex items-center"
              style={{ top: seat.top, right: seat.right }}
            >
              <button
                className="bg-white bg-opacity-50 w-16 h-16 md:w-20 md:h-20 rounded-full"
                onClick={() => handleSeatClick(seat.id)}
                disabled={Boolean(seats[seat.id] && seats[seat.id] !== currentUser?.id)} // 自分以外のユーザーが座っている場合に無効化
              >
                {seats[seat.id] && users[seats[seat.id]] && (
                  <img
                    src={`${process.env.NEXT_PUBLIC_RAILS_URL}${users[seats[seat.id]].avatar.url}`}
                    alt="User Avatar"
                    className="h-14 w-14 md:w-16 md:h-16 rounded-full ml-1 md:ml-2"
                  />
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default FrameBeach;