"use client";
import { useEffect, useState } from "react";

const ProfileEditPage = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/v1/current_user",
          {
            credentials: "include",
          },
        );
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          console.error("ユーザー情報の取得に失敗しました");
        }
      } catch (error) {
        console.error("ユーザー情報の取得に失敗しました:", error);
      }
    };

    fetchUserData();
  }, []);

  if (!user) {
    return <div>ログインしてください。</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">プロフィール編集</h1>
          <button className="px-4 py-2 bg-gray-300 rounded">編集</button>
        </div>
        <form>
          <div className="mb-4">
            <div className="relative flex items-center border rounded">
              <span className="absolute left-2">メールアドレス</span>
              <input
                type="text"
                placeholder="ユーザー名"
                value={user.name}
                readOnly
                className="w-full px-4 py-2 border rounded text-right"
              />
            </div>
          </div>
          <div className="mb-4">
            <div className="relative flex items-center border rounded">
              <span className="absolute left-2">メールアドレス</span>
              <input
                type="email"
                placeholder="メールアドレス"
                value={user.email}
                readOnly
                className="w-full pl-24 pr-4 py-2 text-right border-none"
              />
            </div>
          </div>
          <div className="mb-4">
            <div className="relative flex items-center border rounded">
              <span className="absolute left-2">パスワード</span>
              <input
                type="password"
                placeholder="パスワード"
                value="********"
                readOnly
                className="w-full px-4 py-2 border rounded text-right"
              />
            </div>
          </div>
          <div className="mb-4">
            <div className="relative flex items-center border rounded">
              <span className="absolute left-2">ワーク</span>
              <input
                type="text"
                value={user.work}
                readOnly
                className="w-full px-4 py-2 border rounded"
              />
            </div>
          </div>
          <div className="mb-4">
            <div className="relative flex items-center border rounded">
              <span className="absolute left-2">プロフィール文</span>
              <textarea
                value={user.profileText}
                readOnly
                className="w-full px-4 py-2 border rounded"
                rows="4"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-500 text-white rounded"
          >
            保存
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileEditPage;
