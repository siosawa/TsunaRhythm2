"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const FollowingList = () => {
  const [following, setFollowing] = useState([]);
  const [userId, setUserId] = useState(null);
  const [followStates, setFollowStates] = useState({});

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/v1/current_user",
          {
            credentials: "include",
          }
        );
        const userData = await response.json();
        setUserId(userData.id); // 現在のユーザーIDを設定
      } catch (error) {
        console.error("現在のユーザー情報の取得に失敗しました:", error);
      }
    };

    fetchCurrentUser();
  }, []);

  useEffect(() => {
    const fetchFollowing = async () => {
      if (userId) {
        try {
          const response = await fetch(
            `http://localhost:3000/api/v1/users/${userId}/following`,
            {
              credentials: "include",
            }
          );
          const data = await response.json();
          setFollowing(data);

          // 初期フォロー状態を設定
          const initialFollowStates = data.reduce(
            (acc, user) => ({
              ...acc,
              [user.id]: true,
              [`relationship_${user.id}`]: user.relationship_id, // relationship_id を追加
            }),
            {}
          );
          setFollowStates(initialFollowStates);
        } catch (error) {
          console.error("フォローしているユーザーの取得に失敗しました:", error);
        }
      }
    };

    fetchFollowing();
  }, [userId]);

  const handleUnfollow = async (followedId) => {
    const relationshipId = followStates[`relationship_${followedId}`]; // relationship_id を followStates から取得
    try {
      const response = await fetch(
        `http://localhost:3000/api/v1/relationships/${relationshipId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      if (response.ok) {
        setFollowStates({
          ...followStates,
          [followedId]: false,
          [`relationship_${followedId}`]: null, // relationship_id をリセット
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
      const response = await fetch(
        "http://localhost:3000/api/v1/relationships",
        {
          method: "POST",
          credentials: "include",
          body: JSON.stringify({ followed_id: followedId }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        console.log("New relationship ID:", data.relationship_id); // 新しい relationship_id をコンソールに出力
        setFollowStates({
          ...followStates,
          [followedId]: true,
          [`relationship_${followedId}`]: data.relationship_id, // 新しい relationship_id を更新
        });
      } else {
        console.error("フォローに失敗しました");
      }
    } catch (error) {
      console.error("フォローに失敗しました:", error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">フォローしているユーザー</h2>
      <ul>
        {Array.isArray(following) ? (
          following.map((user) => (
            <li
              key={user.id}
              className="bg-white shadow-md rounded-lg p-6 mb-4 flex justify-between items-center"
            >
              <div>
                <p className="text-lg font-semibold mb-2">{user.name}</p>
                <p className="text-gray-600 mb-1">ID: {user.id}</p>
                <p className="text-gray-600 mb-1">
                  メールアドレス: {user.email}
                </p>
              </div>
              {followStates[user.id] ? (
                <Button variant="ghost" onClick={() => handleUnfollow(user.id)}>
                  フォロー解除
                </Button>
              ) : (
                <Button variant="ghost" onClick={() => handleFollow(user.id)}>
                  フォロー
                </Button>
              )}
            </li>
          ))
        ) : (
          <li>フォローしているユーザーがいません。</li>
        )}
      </ul>
    </div>
  );
};

export default FollowingList;
