"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import cable from "@/utils/cable"; // Action Cableのセットアップが含まれていることを前提
import FetchCurrentUser from "@/components/FetchCurrentUser";

// User 型の定義
interface User {
  id: number;
  name: string;
  avatar: {
    url: string;
  };
}

// Seat 型の定義
interface Seat {
  id: number;
  room_id: number;
  seat_id: number;
  user_id: number;
}

// DiningRoomコンポーネントの定義
const DiningRoom = (): JSX.Element => {
  const [seats, setSeats] = useState<Record<number, number>>({}); // 座席情報を保持するステート
  const [users, setUsers] = useState<Record<number, User>>({}); // ユーザー情報を保持するステート
  const [currentUser, setCurrentUser] = useState<User | null>(null); // 現在のユーザー情報を保持するステート

  // 座席の位置情報を定義
  const seatPositions = [
    { id: 1, top: "46%", right: "57%" },
    { id: 2, top: "52%", right: "50%" },
    { id: 3, top: "58%", right: "43%" },
    { id: 4, top: "71%", right: "51%" },
    { id: 5, top: "65%", right: "58%" },
    { id: 6, top: "59%", right: "65%" },
  ];

  // 座席情報とユーザー情報をフェッチする関数
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

  // 座席情報をフェッチする関数
  const fetchSeats = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/seats?room_id=9`,
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

  // useEffectフックを使用して、コンポーネントがマウントされたときとcurrentUserやseatsが変更されたときに実行
  useEffect(() => {
    if (currentUser) {
      fetchSeats();

      // Action Cableの購読を作成
      const subscription = cable.subscriptions.create(
        { channel: "SeatChannel", room: 9 },
        {
          received(data: Seat) {
            // 座席情報を更新
            setSeats((prevSeats) => ({
              ...prevSeats,
              [data.seat_id]: data.user_id,
            }));
            // 新しいユーザー情報をフェッチ
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

      // クリーンアップ関数を返して購読を解除
      return () => {
        subscription.unsubscribe();
      };
    }
  }, [currentUser, seats]); // seatsを依存関係に追加

  // 座席クリック時のハンドラ関数
  const handleSeatClick = async (seatId: number) => {
    if (!currentUser) {
      console.error("User not logged in");
      return;
    }

    try {
      // 既存の座席情報を取得
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/seats?room_id=9`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data: Seat[] = await response.json();
        // 現在のユーザーが既に座席を持っているかチェック
        const currentUserSeat = data.find(seat => seat.user_id === currentUser.id);

        if (currentUserSeat) {
          // 現在のユーザーの座席情報を削除
          await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/seats/${currentUserSeat.id}`, {
            method: "DELETE",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          });
          // 座席情報を更新して再レンダリングをトリガー
          setSeats((prevSeats) => {
            const updatedSeats = { ...prevSeats };
            delete updatedSeats[currentUserSeat.seat_id];
            return updatedSeats;
          });
        }

        // 新しい座席を予約
        const reserveResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/seats`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            seat: { seat_id: seatId, room_id: 9, user_id: currentUser.id },
          }),
        });

        if (reserveResponse.ok) {
          // 座席情報を更新して再レンダリングをトリガー
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
      {/* 現在のユーザー情報を取得するためのコンポーネント */}
      <FetchCurrentUser setCurrentUser={setCurrentUser} />
      <div className="flex items-center justify-center fixed inset-0 z-10">
        <div className="relative md:w-[1000px]">
          <Image
            src="/DiningRoom.PNG"
            alt="Dining Room"
            width={1000}
            height={700}
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

export default DiningRoom;
