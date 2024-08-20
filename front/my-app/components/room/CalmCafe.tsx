"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import cable from "@/utils/cable";
import FetchCurrentUser from "@/components/FetchCurrentUser";

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

const CalmCafe = (): JSX.Element => {
  const [seats, setSeats] = useState<Record<number, number>>({});
  const [users, setUsers] = useState<Record<number, CurrentUser>>({});
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);

  // 座席の位置情報を定義
  const seatPositions = [
    { id: 1, top: "51%", right: "13%" },
    { id: 2, top: "43%", right: "27%" },
    { id: 3, top: "35%", right: "41%" },
    { id: 4, top: "62%", right: "46%" },
    { id: 5, top: "69%", right: "35%" },
  ];

  const fetchSeatsAndUsers = async (seatsData: Seat[]) => {
    const userResponses = await Promise.all(
      seatsData.map((seat) => {
        if (!seat.user_id) {
          console.error("user_idが未定義です:", seat);
          return Promise.resolve(null); // user_idが未定義の場合はリクエストをスキップ
        }
        return fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/${seat.user_id}`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });
      })
    );

    const userData = await Promise.all(
      userResponses
        .filter((res) => res !== null) // nullのレスポンスを除外
        .map((res) => res!.json() as Promise<CurrentUser>)
    );
    setUsers(userData.reduce((acc, user) => ({ ...acc, [user.id]: user }), {}));
  };

  const fetchSeats = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/seats?room_id=2`,
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
        console.error("座席の取得に失敗しました");
      }
    } catch (error) {
      console.error("座席の取得中にエラーが発生しました:", error);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchSeats();

      const subscription = cable.subscriptions.create(
        { channel: "SeatChannel", room: 2 },
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
                .then((response) => response.json() as Promise<CurrentUser>)
                .then((user: CurrentUser) => {
                  setUsers((prevUsers) => ({
                    ...prevUsers,
                    [user.id]: user,
                  }));
                })
                .catch((error) =>
                  console.error("ユーザー情報の取得中にエラーが発生しました:", error)
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
      console.error("ユーザーがログインしていません");
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/seats?room_id=2`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data: Seat[] = await response.json();
        const currentUserSeat = data.find((seat) => seat.user_id === currentUser.id);

        if (currentUserSeat) {
          await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/seats/${currentUserSeat.id}`, {
            method: "DELETE",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          });
          setSeats((prevSeats) => {
            const updatedSeats = { ...prevSeats };
            delete updatedSeats[currentUserSeat.seat_id];
            return updatedSeats;
          });
        }

        const reserveResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/seats`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            seat: { seat_id: seatId, room_id: 2, user_id: currentUser.id },
          }),
        });

        if (reserveResponse.ok) {
          setSeats((prevSeats) => ({
            ...prevSeats,
            [seatId]: currentUser.id,
          }));
        } else {
          const errorData = await reserveResponse.json();
          console.error("座席の予約に失敗しました。エラー内容:", errorData);
        }
      } else {
        console.error("座席の取得に失敗しました");
      }
    } catch (error) {
      console.error("座席クリック処理中にエラーが発生しました:", error);
    }
  };

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

export default CalmCafe;
