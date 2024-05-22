"use client";
import { useEffect, useState } from "react";

const FollowersList = () => {
  const [followers, setFollowers] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/v1/current_user', {
          credentials: 'include',
        });
        const userData = await response.json();
        setUserId(userData.id); // 現在のユーザーIDを設定
      } catch (error) {
        console.error('現在のユーザー情報の取得に失敗しました:', error);
      }
    };

    fetchCurrentUser();
  }, []);

  useEffect(() => {
    const fetchFollowers = async () => {
      if (userId) {
        try {
          const response = await fetch(`http://localhost:3000/api/v1/users/${userId}/followers`, {
            credentials: 'include',
          });
          const data = await response.json();
          console.log('レスポンスデータ:', data);
          setFollowers(data);
        } catch (error) {
          console.error('フォローしているユーザーの取得に失敗しました:', error);
        }
      }
    };

    fetchFollowers();
  }, [userId]);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">フォローされているユーザー</h2>
      <ul>
        {Array.isArray(followers) ? (
          followers.map(user => (
            <li key={user.id} className="mb-2">
              <p>{user.name}</p>
              <p>{user.id}</p>
              <p>{user.email}</p>
            </li>
          ))
        ) : (
          <li>フォローしているユーザーがいません。</li>
        )}
      </ul>
    </div>
  );
};

export default FollowersList;
