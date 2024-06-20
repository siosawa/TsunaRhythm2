import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export default function RoomExitButton() {
  const [roomMembers, setRoomMembers] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(
          "http://localhost:3000/api/v1/room_members",
          {
            method: "GET",
            credentials: "include", // withCredentials:trueに相当
          }
        );
        const data = await response.json();
        setRoomMembers(data);
      } catch (error) {
        console.error("Error fetching room members:", error);
      }
    }

    fetchData();
  }, []);

  // 退出ボタンが押された時の処理
  const handleExit = async () => {
    const now = new Date().toISOString();

    try {
      for (const member of roomMembers) {
        const updatedMember = { ...member, leaved_at: now };

        await fetch(`http://localhost:3000/api/v1/room_members/${member.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedMember),
        });
      }

      // /rooms に遷移
      window.location.href = "/rooms";
    } catch (error) {
      console.error("Error updating room member:", error);
    }
  };

  return (
    <div className="fixed bottom-32 right-12 z-30 flex items-center">
      <Button
        variant="ghost"
        className="bg-slate-500 text-white hover:text-white hover:bg-slate-600 px-4 py-2 rounded-xl"
        onClick={handleExit}
      >
        ルームを退出する
      </Button>
    </div>
  );
}
