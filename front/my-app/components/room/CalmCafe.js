"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import cable from "@/utils/cable";
import FetchCurrentUser from "@/components/FetchCurrentUser";

const CalmCafe = () => {
  const [seats, setSeats] = useState({});
  const [users, setUsers] = useState({});
  const [currentUser, setCurrentUser] = useState(null);
  const [renderKey, setRenderKey] = useState(0); // 強制的に再レンダリングするためのステート
  const seatPositions = [
    { id: 1, top: "51%", right: "13%" },
    { id: 2, top: "43%", right: "27%" },
    { id: 3, top: "35%", right: "41%" },
    { id: 4, top: "62%", right: "46%" },
    { id: 5, top: "69%", right: "35%" },
  ];

  useEffect(() => {
    const fetchSeats = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/v1/seats?room_id=2",
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          setSeats(
            data.reduce(
              (acc, seat) => ({ ...acc, [seat.seat_id]: seat.user_id }),
              {}
            )
          );
          // ユーザー情報のフェッチ
          const userResponses = await Promise.all(
            data.map((seat) =>
              fetch(`http://localhost:3000/api/v1/users/${seat.user_id}`, {
                method: "GET",
                credentials: "include",
                headers: {
                  "Content-Type": "application/json",
                },
              })
            )
          );
          const userData = await Promise.all(
            userResponses.map((res) => res.json())
          );
          setUsers(
            userData.reduce((acc, user) => ({ ...acc, [user.id]: user }), {})
          );
        } else {
          console.error("Failed to fetch seats");
        }
      } catch (error) {
        console.error("Error fetching seats:", error);
      }
    };

    if (currentUser) {
      fetchSeats();

      const subscription = cable.subscriptions.create(
        { channel: "SeatChannel", room: 2 },
        {
          received(data) {
            setSeats((prevSeats) => ({
              ...prevSeats,
              [data.seat_id]: data.user_id,
            }));
            // ユーザー情報の更新
            if (!users[data.user_id]) {
              fetch(`http://localhost:3000/api/v1/users/${data.user_id}`, {
                method: "GET",
                credentials: "include",
                headers: {
                  "Content-Type": "application/json",
                },
              })
                .then((response) => response.json())
                .then((user) => {
                  setUsers((prevUsers) => ({
                    ...prevUsers,
                    [user.id]: user,
                  }));
                })
                .catch((error) => console.error("Error fetching user:", error));
            }
          },
        }
      );

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [currentUser, renderKey]); // renderKeyを依存関係に追加

  const handleSeatClick = async (seatId) => {
    if (!currentUser) {
      console.error("User not logged in");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/v1/seats", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          seat: { seat_id: seatId, room_id: 2, user_id: currentUser.id },
        }),
      });
      if (response.ok) {
        // 成功したらページ全体を再レンダリングする
        setRenderKey((prevKey) => prevKey + 1);
      } else {
        console.error("Failed to reserve seat");
      }
    } catch (error) {
      console.error("Error reserving seat:", error);
    }
  };

  const isCurrentUserAssigned = Object.values(seats).includes(currentUser?.id);

  return (
    <>
      <FetchCurrentUser setCurrentUser={setCurrentUser} />
      <div className="flex items-center justify-center fixed inset-0 z-10">
        <div className="relative w-[500px] md:w-[700px]">
          <Image
            src="/CalmCafe.PNG"
            alt="Calm Cafe"
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
                disabled={isCurrentUserAssigned}
              >
                {seats[seat.id] && users[seats[seat.id]] && (
                  <img
                    src={`http://localhost:3000${users[seats[seat.id]].avatar.url}`}
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

export default CalmCafe;