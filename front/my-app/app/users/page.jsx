"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import UsersPagination from "@/app/users/components/UsersPagination";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [userId, setUserId] = useState(null);
  const [followings, setFollowings] = useState(new Set()); // フォロー中のユーザーIDセット
  const [followStates, setFollowStates] = useState({}); // フォロー状態と relationship_id を保存

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/v1/current_user",
          {
            withCredentials: true,
          }
        );
        const userData = response.data;
        setUserId(userData.id);
      } catch (error) {
        console.error("現在のユーザー情報の取得に失敗しました:", error);
      }
    };

    fetchCurrentUser();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/api/v1/users?page=${currentPage}`,
          {
            withCredentials: true, // クッキーを含める設定
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

  const handleUnfollow = async (followedId) => {
    const relationshipId = followStates[`relationship_${followedId}`];
    try {
      const response = await axios.delete(
        `http://localhost:3000/api/v1/relationships/${relationshipId}`,
        {
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        setFollowStates({
          ...followStates,
          [followedId]: false,
          [`relationship_${followedId}`]: null, // relationship_id をリセット
        });
        setFollowings((prev) => {
          const updated = new Set(prev);
          updated.delete(followedId);
          return updated;
        });
      } else {
        console.error("フォロー解除に失敗しました");
      }
    } catch (error) {
      console.error("フォロー解除に失敗しました:", error);
    }
  };

  const handleFollow = async (followedId) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/v1/relationships",
        { followed_id: followedId },
        {
          withCredentials: true,
        }
      );
      if (response.status === 201) {
        const data = response.data;
        console.log("New relationship ID:", data.relationship_id); // 新しい relationship_id をコンソールに出力
        setFollowStates({
          ...followStates,
          [followedId]: true,
          [`relationship_${followedId}`]: data.relationship_id, // 新しい relationship_id を更新
        });
        setFollowings((prev) => new Set(prev).add(followedId));
      } else {
        console.error("フォローに失敗しました");
      }
    } catch (error) {
      console.error("フォローに失敗しました:", error);
    }
  };

  const handlePageClick = (page) => {
    if (page !== currentPage && typeof page === "number") {
      setCurrentPage(page);
    }
  };

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="p-4">
      {users?.map((user) => (
        <div
          key={user.id}
          className="bg-white shadow-md rounded-lg p-6 mb-4 flex justify-between items-center"
        >
          <div>
            <p className="text-lg font-semibold mb-2">名前: {user.name}</p>
            <p className="text-gray-600 mb-1">メールアドレス: {user.email}</p>
            <p className="text-gray-600 mb-1">ID: {user.id}</p>
            <p className="text-gray-600 mb-1">ポスト数: {user.posts_count}</p>
            <p className="text-gray-600">
              アカウント作成日: {new Date(user.created_at).toLocaleDateString()}
            </p>
          </div>
          {followings.has(user.id) ? (
            <Button variant="ghost" onClick={() => handleUnfollow(user.id)}>
              フォロー解除
            </Button>
          ) : (
            <Button variant="ghost" onClick={() => handleFollow(user.id)}>
              フォロー
            </Button>
          )}
        </div>
      ))}
      <UsersPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageClick}
      />
    </div>
  );
};

export default Users;
