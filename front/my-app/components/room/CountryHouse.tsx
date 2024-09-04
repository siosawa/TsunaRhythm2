"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import cable from "@/utils/cable";
import FetchCurrentUser from "@/components/FetchCurrentUser";
import axios from "axios";

interface CurrentUser {
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

const CountryHouse = (): JSX.Element => {
  const [seats, setSeats] = useState<Record<number, number>>({}); 
  const [users, setUsers] = useState<Record<number, CurrentUser>>({}); 
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null); 

  const seatPositions = [
    { id: 1, top: "49%", right: "34%" },
  ];

  const fetchSeatsAndUsers = async (seatsData: Seat[]) => {
    try {
      const userResponses = await Promise.all(
        seatsData.map((seat) =>
          axios.get<CurrentUser>(
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
      console.error("ユーザー情報の取得に失敗しました:", error);
    }
  };

  const fetchSeats = async () => {
    try {
      const response = await axios.get<Seat[]>(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/seats?room_id=6`,
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
        { channel: "SeatChannel", room: 6 },
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
                .get<CurrentUser>(
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

      // クリーンアップ関数を返して購読を解除
      return () => {
        subscription.unsubscribe();
      };
    }
  }, [currentUser, seats]); 

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
          seat: { seat_id: seatId, room_id: 6, user_id: currentUser.id },
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        setSeats((prevSeats) => ({
          ...prevSeats,
          [seatId]: currentUser.id,
        }));
      } else {
        console.error("Failed to reserve seat");
      }
    } catch (error) {
      console.error("Error reserving seat:", error);
    }
  };

  const isCurrentUserAssigned = currentUser ? Object.values(seats).includes(currentUser.id) : false;

  return (
    <>
      <FetchCurrentUser setCurrentUser={setCurrentUser} />
      <div className="flex items-center justify-center fixed inset-0 z-10">
        <div className="relative w-[500px] md:w-[700px]">
          <Image
            src="/CountryHouse.PNG"
            alt="Country House"
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
                className="bg-white bg-opacity-50 w-11 h-11 md:w-14 md:h-14 rounded-full ml-2"
                onClick={() => handleSeatClick(seat.id)}
                disabled={isCurrentUserAssigned || Boolean(seats[seat.id])} // 座席が既に埋まっている場合に無効化
              >
                {seats[seat.id] && users[seats[seat.id]] && (
                  <img
                    src={`${process.env.NEXT_PUBLIC_RAILS_URL}${users[seats[seat.id]].avatar.url}`}
                    alt="User Avatar"
                    className="h-9 w-9 md:w-12 md:h-12 rounded-full ml-1 md:ml-1"
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

export default CountryHouse;
