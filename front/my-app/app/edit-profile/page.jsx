"use client";
import { useEffect, useState } from "react";
import EditPassword from "@/app/edit-profile/components/EditPassword";

const ProfileReadPage = () => {
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
          console.log("Fetched user data:", userData); // JSON形式でログ出力
          setUser(userData);
        } 
      } catch (error) {
        console.error("ユーザー情報の取得に失敗しました:", error);
      }
    };

    fetchUserData();
  }, []);

  const [showCurrent, setShowCurrent] = useState(true);
  const [showEditPassword, setShowEditPassword] = useState(false);

  const handleButtonClick = () => {
    setShowCurrent(false); // 現在のコンポーネントを非表示
    setShowEditPassword(true); // 新しいコンポーネントを表示
  };

  return (
    <div className="min-h-screen flex items-start justify-center pt-24">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">プロフィール編集</h1>
          <button className="px-4 py-1 rounded-xl shadow-custom-dark" onClick={handleButtonClick}>
            編集
          </button>
        </div>
        <form>
          {showCurrent && (
            <>
              <div className="mb-4">
                <div className="relative flex items-center border rounded-xl">
                  <span className="absolute left-2 text-gray-500">ユーザー名</span>
                  <input
                    type="text"
                    value={user?.name || ''}
                    readOnly
                    className="w-full px-4 py-2 border rounded-xl text-right"
                  />
                </div>
              </div>
              <div className="mb-4">
                <div className="relative flex items-center border rounded-xl">
                  <span className="absolute left-2 text-gray-500">メールアドレス</span>
                  <input
                    type="email"
                    placeholder="メールアドレス"
                    value={user?.email || ''}
                    readOnly
                    className="w-full pl-24 pr-4 py-2 text-right border-none"
                  />
                </div>
              </div>
              <div className="mb-4">
                <div className="relative flex items-center border rounded-xl">
                  <span className="absolute left-2 text-gray-500">パスワード</span>
                  <input
                    type="password"
                    placeholder="パスワード"
                    value="********"
                    readOnly
                    className="w-full px-4 py-2 border rounded-xl text-right"
                  />
                </div>
              </div>
              <div className="mb-4">
                <div className="relative flex items-center border rounded-xl">
                  <span className="absolute left-2 text-gray-500">ワーク</span>
                  <input
                    type="text"
                    value={user?.work || ''}
                    readOnly
                    className="w-full px-4 py-2 border rounded-xl"
                  />
                </div>
              </div>
              <div className="mb-4">
                <div className="relative flex items-center border rounded-xl">
                  <span className="absolute left-2 top-2 text-gray-500">プロフィール文</span>
                  <textarea
                    value={user?.profileText || ''}
                    readOnly
                    className="w-full px-4 py-2 border rounded-xl"
                    rows="4"
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-1 rounded-xl shadow-custom-dark"
                >
                  保存
                </button>
              </div>
            </>
          )}
          {showEditPassword && <EditPassword />}
        </form>
      </div>
    </div>
  );
};

export default ProfileReadPage;
