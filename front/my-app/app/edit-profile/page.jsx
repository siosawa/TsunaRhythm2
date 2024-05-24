"use client";
import { useEffect, useState } from "react";
import { FiTriangle } from "react-icons/fi";

const ProfileReadPage = () => {
  const [user, setUser] = useState(null);
  const [isEditable, setIsEditable] = useState(false); // 編集モードの状態

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/v1/current_user",
          {
            credentials: "include",
          }
        );
        if (response.ok) {
          const userData = await response.json();
          console.log("ユーザーデータを取得しました:", userData); // JSON形式でログ出力
          setUser(userData);
        } 
      } catch (error) {
        console.error("ユーザー情報の取得に失敗しました:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleEditClick = () => {
    setIsEditable(true); // 編集モードに切り替える
  };

  const handleSaveClick = async (event) => {
    event.preventDefault(); // フォームのデフォルトの送信を防ぐ

    try {
      const response = await fetch(`http://localhost:3000/api/v1/users/${user.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
        credentials: "include",
      });

      if (response.ok) {
        const updatedUserData = await response.json();
        console.log("ユーザーデータを更新しました:", updatedUserData);
        setIsEditable(false); // 編集モードを終了
        await fetchUserData(); // データを再取得
      } else {
        console.error("ユーザーデータの更新に失敗しました");
      }
    } catch (error) {
      console.error("ユーザーデータの更新中にエラーが発生しました:", error);
    }
  };

  const handlePasswordEditClick = () => {
    window.location.href = "/edit-password"; 
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen flex items-start justify-center pt-24">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">プロフィール編集</h1>
          {isEditable ? (
            <button className="px-4 py-1 rounded-xl shadow-custom-dark" onClick={handleSaveClick}>
              保存
            </button>
          ) : (
            <button className="px-4 py-1 rounded-xl shadow-custom-dark" onClick={handleEditClick}>
              編集
            </button>
          )}
        </div>
        <form>
            <>
              <div className="mb-4">
                <div className="relative flex items-center border rounded-xl">
                  <span className="absolute left-2 text-gray-500">ユーザー名</span>
                  <input
                    type="text"
                    name="name"
                    placeholder="ユーザー名"
                    value={user?.name || ''}
                    onChange={handleInputChange}
                    readOnly={!isEditable}
                    className="w-full px-4 py-2 border rounded-xl text-right"
                  />
                </div>
              </div>
              <div className="mb-4">
                <div className="relative flex items-center border rounded-xl">
                  <span className="absolute left-2 text-gray-500">メールアドレス</span>
                  <input
                    type="email"
                    name="email"
                    placeholder="メールアドレス"
                    value={user?.email || ''}
                    onChange={handleInputChange}
                    readOnly={!isEditable}
                    className="w-full px-4 py-2 border rounded-xl text-right"
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
                    className="w-full px-4 py-2 border rounded-xl text-right pr-7"
                  />
                  <FiTriangle
                    className="absolute right-2 cursor-pointer transform rotate-90"
                    onClick={handlePasswordEditClick}
                  />
                </div>
              </div>
              <div className="mb-4">
                <div className="relative flex items-center border rounded-xl">
                  <span className="absolute left-2 text-gray-500">ワーク</span>
                  <input
                    type="text"
                    name="work"
                    value={user?.work || ''}
                    onChange={handleInputChange}
                    readOnly={!isEditable}
                    className="w-full px-4 py-2 border rounded-xl text-right pr-7"
                  />
                </div>
              </div>
              <div className="mb-4">
                <div className="relative flex items-center border rounded-xl">
                  <span className="absolute left-2 top-2 text-gray-500">プロフィール文</span>
                  <textarea
                    name="profileText"
                    value={user?.profileText || ''}
                    onChange={handleInputChange}
                    readOnly={!isEditable}
                    className="w-full px-4 py-2 border rounded-xl text-right pr-7 pt-8"
                    rows="4"
                  />
                </div>
              </div>
            </>
        </form>
      </div>
    </div>
  );
};

export default ProfileReadPage;
