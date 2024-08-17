import { useEffect } from "react";
import axios from "axios";
import { useParams } from "next/navigation";

interface User {
  id: number;
  name: string;
  work: string | null;
  profile_text: string | null;
  avatar: {
    url: string | null;
  } 

  relationship_id: number;
  followers_count: number;
  following_count: number;
  posts_count: number;
}

interface FetchFollowingProps {
  currentPage: number;
  currentUserId: number | null;
  setUsers: (users: User[]) => void;
  setTotalPages: (totalPages: number) => void;
  setFollowings: (followings: Set<number>) => void;
  setFollowStates: (followStates: Record<string, boolean | number>) => void;
  setError: (error: string) => void;
}

const FetchFollowing = ({
  currentPage,
  currentUserId,
  setUsers,
  setTotalPages,
  setFollowings,
  setFollowStates,
  setError,
}: FetchFollowingProps) => {
  const { userId } = useParams() as { userId: string };
  console.log(userId);

  useEffect(() => {
    const fetchFollowing = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/${userId}/following?page=${currentPage}`,
          {
            withCredentials: true,
          }
        );

        if (res.data && Array.isArray(res.data.users)) {
          setUsers(res.data.users);
          setTotalPages(res.data.total_pages);
        } else {
          console.error("APIレスポンスは正しくありません:", res.data);
          setError("データの取得に失敗しました。");
        }
      } catch (err) {
        console.error("API呼び出しに失敗しました:", err);
        setError("データの取得に失敗しました。");
      }
    };

    const fetchFollowingId = async () => {
      if (currentUserId) {
        try {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/${currentUserId}/following`,
            {
              withCredentials: true,
            }
          );
          const data = response.data;

          const followingSet: Set<number> = new Set(data.users.map((user: User) => user.id));
          const followingStates: Record<string, boolean | number> = {};
          data.users.forEach((user: User) => {
            followingStates[user.id] = true;
            followingStates[`relationship_${user.id}`] = user.relationship_id;
          });

          setFollowings(followingSet);
          setFollowStates(followingStates);
        } catch (error) {
          console.error("フォロー中のユーザーの取得に失敗しました:", error);
        }
      }
    };

    if (userId) {
      fetchFollowing();
    }
    if (currentUserId) {
      fetchFollowingId();
    }
  }, [currentPage, currentUserId, userId]);

  return null;
};

export default FetchFollowing;
