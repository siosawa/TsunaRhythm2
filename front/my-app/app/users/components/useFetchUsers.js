// 現在のページとユーザーIDに基づいてユーザー情報とフォロー情報をAPIから取得し
// 状態を更新
import { useEffect } from "react";
import axios from "axios"; // axiosをインポート

// ユーザー情報取得コンポーネント
const useFetchUsers = (
  currentPage,
  userId,
  setUsers,
  setTotalPages,
  setFollowings,
  setFollowStates,
  setError
) => {
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/api/v1/users?page=${currentPage}`,
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

    const fetchFollowing = async () => {
      if (userId) {
        try {
          const response = await axios.get(
            `http://localhost:3000/api/v1/users/${userId}/following`,
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

    fetchUsers();
    if (userId) {
      fetchFollowing();
    }
  }, [currentPage, userId]);
};

export default useFetchUsers; 

