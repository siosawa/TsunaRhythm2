import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import FetchCurrentUser from "@/components/FetchCurrentUser";

export default function RoomExitButton({ room_id }) {
  const [roomMembers, setRoomMembers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(
          "http://localhost:3000/api/v1/room_members",
          {
            method: "GET",
            credentials: "include",
          }
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setRoomMembers(data);
      } catch (error) {
        console.error("Error fetching room members:", error);
        // エラー通知を追加する場合はここに記述
      }
    }

    fetchData();
  }, []);

  // 退出ボタンが押された時の処理
  const handleExit = async () => {
    const now = new Date().toISOString();

    try {
      // leaved_at が null で currentUser.id と user_id が一致するレコードを探す
      const matchingMember = roomMembers.find(
        (member) =>
          member.user_id === currentUser?.id && member.leaved_at === null
      );

      if (matchingMember) {
        // 該当するレコードを更新
        await axios.patch(
          `http://localhost:3000/api/v1/room_members/${matchingMember.id}`,
          { leaved_at: now },
          {
            withCredentials: true,
          }
        );

        // 座席レコードを削除
        const seatsResponse = await axios.get(
          `http://localhost:3000/api/v1/seats?room_id=${room_id}`,
          {
            withCredentials: true,
          }
        );
        const seats = seatsResponse.data;
        const matchingSeats = seats.filter(
          (seat) => seat.user_id === currentUser.id
        );
        for (const seat of matchingSeats) {
          await axios.delete(`http://localhost:3000/api/v1/seats/${seat.id}`, {
            withCredentials: true,
          });
        }

        // 状態を更新
        setRoomMembers((prevMembers) =>
          prevMembers.map((member) =>
            member.id === matchingMember.id
              ? { ...member, leaved_at: now }
              : member
          )
        );

        // /rooms に遷移
        window.location.href = "/rooms";
      } else {
        console.error("Matching member not found or already left");
      }
    } catch (error) {
      console.error("Error updating room member or deleting seats:", error);
      // エラー通知を追加する場合はここに記述
    }
  };

  return (
    <>
      <FetchCurrentUser setCurrentUser={setCurrentUser} />
      <div className="fixed bottom-32 right-12 z-30 flex items-center">
        <Button
          variant="ghost"
          className="bg-slate-500 text-white hover:text-white hover:bg-slate-600 px-4 py-2 rounded-xl"
          onClick={handleExit}
        >
          ルームを退出する
        </Button>
      </div>
    </>
  );
}
