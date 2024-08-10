"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import cable from "@/utils/cable"; 
import FetchCurrentUser from "@/components/FetchCurrentUser";

interface User {
  id: number;
  name: string;
  avatar: {
    url: string;
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
    const userResponses = await Promise.all(
      seatsData.map((seat) =>
        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/${seat.user_id}`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        })
      )
    );
    const userData = await Promise.all(userResponses.map((res) => res.json() as Promise<User>));
    setUsers(userData.reduce((acc, user) => ({ ...acc, [user.id]: user }), {}));
  };

  const fetchSeats = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/seats?room_id=4`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        const data: Seat[] = await response.json();
        setSeats(
          data.reduce(
            (acc, seat) => ({ ...acc, [seat.seat_id]: seat.user_id }),
            {}
          )
        );
        await fetchSeatsAndUsers(data);
      } else {
        console.error("Failed to fetch seats");
      }
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
            setSeats((prevSeats) => ({
              ...prevSeats,
              [data.seat_id]: data.user_id,
            }));
            if (!users[data.user_id]) {
              fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/${data.user_id}`, {
                method: "GET",
                credentials: "include",
                headers: {
                  "Content-Type": "application/json",
                },
              })
                .then((response) => response.json() as Promise<User>)
                .then((user: User) => {
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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/seats`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          seat: { seat_id: seatId, room_id: 4, user_id: currentUser.id },
        }),
      });
      if (response.ok) {
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
