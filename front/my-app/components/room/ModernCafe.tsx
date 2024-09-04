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

const ModernCafe = (): JSX.Element => {
  const [seats, setSeats] = useState<Record<number, number>>({}); // 座席情報を保持するステート
  const [users, setUsers] = useState<Record<number, CurrentUser>>({}); // ユーザー情報を保持するステート
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null); // 現在のユーザー情報を保持するステート

  const seatPositions = [
    { id: 1, top: "58%", right: "39%" },
    { id: 2, top: "49%", right: "56%" },
    { id: 3, top: "60%", right: "63%" },
    { id: 4, top: "67%", right: "49%" },
    { id: 5, top: "71%", right: "39%" },
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
      console.error("Error fetching users:", error);
    }
  };

  const fetchSeats = async () => {
    try {
      const response = await axios.get<Seat[]>(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/seats?room_id=7`,
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
        { channel: "SeatChannel", room: 7 },
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

    try {
      const response = await axios.get<Seat[]>(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/seats?room_id=7`,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        const data = response.data;
        const currentUserSeat = data.find((seat) => seat.user_id === currentUser?.id);

        if (currentUserSeat) {
          await axios.delete(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/seats/${currentUserSeat.id}`,
            {
              withCredentials: true,
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          setSeats((prevSeats) => {
            const updatedSeats = { ...prevSeats };
            delete updatedSeats[currentUserSeat.seat_id];
            return updatedSeats;
          });
        }

        const reserveResponse = await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/seats`,
          {
            seat: { seat_id: seatId, room_id: 7, user_id: currentUser.id },
          },
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (reserveResponse.status === 200) {
          setSeats((prevSeats) => ({
            ...prevSeats,
            [seatId]: currentUser.id,
          }));
        } else {
          console.error("Failed to reserve seat");
        }
      } else {
        console.error("Failed to fetch seats");
      }
    } catch (error) {
      console.error("Error handling seat click:", error);
    }
  };

  return (
    <>
      <FetchCurrentUser setCurrentUser={setCurrentUser} />
      <div className="flex items-center justify-center fixed inset-0 z-10">
        <div className="relative w-[500px] md:w-[700px]">
          <Image
            src="/ModernCafe.PNG"
            alt="Modern Cafe"
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
                disabled={Boolean(seats[seat.id] && seats[seat.id] !== currentUser?.id)} // 自分以外のユーザーが座っている場合に無効化
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

export default ModernCafe;