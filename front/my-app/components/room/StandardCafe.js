"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import cable from "@/utils/cable"; // Action Cableのセットアップが含まれていることを前提
import FetchCurrentUser from "@/components/FetchCurrentUser";

// StandardCafeコンポーネントの定義
const StandardCafe = () => {
  const [seats, setSeats] = useState({}); // 座席情報を保持するステート
  const [users, setUsers] = useState({}); // ユーザー情報を保持するステート
  const [currentUser, setCurrentUser] = useState(null); // 現在のユーザー情報を保持するステート

  // 座席の位置情報を定義
  const seatPositions = [
    { id: 1, top: "45%", right: "48%" },
    { id: 2, top: "39%", right: "28%" },
    { id: 3, top: "30%", right: "39%" },
    { id: 4, top: "57%", right: "32%" },
    { id: 5, top: "67%", right: "46%" },
  ];

  // 座席情報とユーザー情報をフェッチする関数
  const fetchSeatsAndUsers = async (seatsData) => {
    const userResponses = await Promise.all(
      seatsData.map((seat) =>
        fetch(`http://localhost:3000/api/v1/users/${seat.user_id}`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        })
      )
    );
    const userData = await Promise.all(userResponses.map((res) => res.json()));
    setUsers(userData.reduce((acc, user) => ({ ...acc, [user.id]: user }), {}));
  };

  // 座席情報をフェッチする関数
  const fetchSeats = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/v1/seats?room_id=1",
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
        { channel: "SeatChannel", room: 1 },
        {
          received(data) {
            // 座席情報を更新
            setSeats((prevSeats) => ({
              ...prevSeats,
              [data.seat_id]: data.user_id,
            }));
            // 新しいユーザー情報をフェッチ
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
  const handleSeatClick = async (seatId) => {
    if (!currentUser) {
      console.error("User not logged in");
      return;
    }

    // 座席が既に埋まっている場合はクリックを無効化
    if (seats[seatId]) {
      console.error("Seat already reserved");
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
          seat: { seat_id: seatId, room_id: 1, user_id: currentUser.id },
        }),
      });
      if (response.ok) {
        // 座席情報を更新して再レンダリングをトリガー
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

  // 現在のユーザーが既に座席を割り当てられているかをチェック
  const isCurrentUserAssigned = Object.values(seats).includes(currentUser?.id);

  return (
    <>
      {/* 現在のユーザー情報を取得するためのコンポーネント */}
      <FetchCurrentUser setCurrentUser={setCurrentUser} />
      <div className="flex items-center justify-center fixed inset-0 z-10">
        <div className="relative w-[500px] md:w-[700px]">
          <Image
          src="/StandardCafe.PNG"
          alt="Standard Cafe"
          width={750}
          height={500}
          layout="intrinsic"
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
                disabled={isCurrentUserAssigned || seats[seat.id]} // 座席が既に埋まっている場合に無効化
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

export default StandardCafe;
