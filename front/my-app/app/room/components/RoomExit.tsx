import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import FetchCurrentUser from "@/components/FetchCurrentUser";

interface RoomMember {
  id: number;
  user_id: number;
  room_id: number;
  entered_at: string;
  leaved_at: string | null;
}

interface Seat {
  id: number;
  user_id: number;
  room_id: number;
  seat_id: number;
  created_at: string;
  updated_at: string;
}

interface CurrentUser {
  id: number;
  name: string;
  email: string;
  following: number;
  followers: number;
  posts_count: number;
  work: string;
  profile_text: string | null;
  avatar: {
    url: string | null;
  } 

}

interface RoomExitButtonProps {
  room_id: number;
}

export default function RoomExitButton({ room_id }: RoomExitButtonProps) {
  const [roomMembers, setRoomMembers] = useState<RoomMember[]>([]);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);

useEffect(() => {
  async function fetchData() {
    try {
      const response = await axios.get<RoomMember[]>(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/room_members`,
        {
          withCredentials: true,
        }
      );
      setRoomMembers(response.data);
    } catch (error) {
      console.error("Error fetching room members:", error);
    }
  }

  fetchData();
}, []);

  const handleExit = async () => {
    const now = new Date().toISOString();

    try {
      const matchingMember = roomMembers.find(
        (member) =>
          member.user_id === currentUser?.id && member.leaved_at === null
      );

      if (matchingMember) {
        await axios.patch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/room_members/${matchingMember.id}`,
          { leaved_at: now },
          {
            withCredentials: true,
          }
        );

        const seatsResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/seats?room_id=${room_id}`,
          {
            withCredentials: true,
          }
        );
        const seats: Seat[] = seatsResponse.data;
        const matchingSeats = seats.filter(
          (seat) => seat.user_id === currentUser?.id
        );
        for (const seat of matchingSeats) {
          await axios.delete(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/seats/${seat.id}`,
            {
              withCredentials: true,
            }
          );
        }

        setRoomMembers((prevMembers) =>
          prevMembers.map((member) =>
            member.id === matchingMember.id
              ? { ...member, leaved_at: now }
              : member
          )
        );

        window.location.href = "/rooms";
      } else {
        console.error("Matching member not found or already left");
      }
    } catch (error) {
      console.error("Error updating room member or deleting seats:", error);
    }
  };

  return (
    <>
      <FetchCurrentUser setCurrentUser={setCurrentUser} />
      <div className="fixed bottom-20 right-4 mb-4 mr-4 z-30 flex items-center">
        <Button
          variant="ghost"
          className="bg-gray-500 text-white hover:text-white hover:bg-gray-600 px-4 py-2 rounded-xl"
          onClick={handleExit}
        >
          ルームを退出する
        </Button>
      </div>
    </>
  );
}
