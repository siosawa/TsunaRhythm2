import { useEffect } from "react";
import axios from "axios";
import { useParams } from 'next/navigation';

// ユーザー情報取得コンポーネント
const FetchFollowers = ({
  currentPage,
  currentUserId,
  setUsers,
  setTotalPages,
  setFollowings,
  setFollowStates,
  setError
}) => {
  const { userId } = useParams();
  console.log( userId )

  useEffect(() => {
    const fetchFollowers = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/api/v1/users/${userId}/followers?page=${currentPage}`,
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
            `http://localhost:3000/api/v1/users/${currentUserId}/following`,
            {
              withCredentials: true,
            }
          );
          const data = response.data;

          const followingSet = new Set(data.users.map((user) => user.id));
          const followingStates = {};
          data.users.forEach((user) => {
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
      fetchFollowers();
    }
    if (currentUserId) {
      fetchFollowingId();
    }
  }, [currentPage, currentUserId, userId]);

  return null; 
};

export default FetchFollowers;

