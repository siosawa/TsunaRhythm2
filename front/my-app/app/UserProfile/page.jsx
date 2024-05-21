"use client"
import { useEffect, useState } from "react";


export default function Home() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/v1/current_user', {
          credentials: 'include',
        });
        const userData = await response.json();
        setUser(userData);
      } catch (error) {
        console.error('ユーザー情報の取得に失敗しました:', error);
      }
    };

    fetchUserData();
  }, []);

  if (!user) {
    return <div>読み込み中...</div>;
  }

  return (
    <div>
      <UserProfile user={user} />
    </div>
  );
}

const UserProfile = ({ user }) => {
  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center space-x-4">
        <div>
          <h1 className="text-4xl font-bold">{user.name}</h1>
          <div className="flex space-x-2">
            <span>フォロー{user.following}</span>
            <span>フォロワー{user.followers}</span>
          </div>
        </div>
      </div>
      <div className="mt-4">
        <button className="px-4 py-2 bg-gray-200 rounded">プロフィール編集</button>
      </div>
      <div className="mt-2">
        <label className="block text-gray-700">主なワーク:</label>
      </div>
    </div>
  );
};
