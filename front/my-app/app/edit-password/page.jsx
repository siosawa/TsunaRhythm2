"use client";
import { useEffect, useState } from "react";

const EditPassword = () => {
  const [user, setUser] = useState(null);

  // 新しいパスワードと確認用パスワードの状態を管理するためのステート
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

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
          console.log("ユーザーデータを取得しました:", userData); // JSON形式でログ出力
          setUser(userData);
        }
      } catch (error) {
        console.error("ユーザー情報の取得に失敗しました:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleSaveClick = async (event) => {
    event.preventDefault(); // フォームのデフォルトの送信を防ぐ

    if (currentPassword !== user.password) {
      // 仮に user.password が現在のパスワードを保持していると仮定
      setMessage("現在のパスワードが一致しません");
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("新しいパスワードと確認用パスワードが一致しません");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/api/v1/users/${user.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            password: newPassword,
          }),
          credentials: "include",
        },
      );

      if (response.ok) {
        const updatedUserData = await response.json();
        console.log("ユーザーデータを更新しました:", updatedUserData);
        setMessage("パスワードが正常に更新されました");
      } else {
        console.error("ユーザーデータの更新に失敗しました");
        setMessage("パスワードの更新に失敗しました");
      }
    } catch (error) {
      console.error("ユーザーデータの更新中にエラーが発生しました:", error);
      setMessage("パスワードの更新中にエラーが発生しました");
    }
  };

  return (
    <div className="min-h-screen flex items-start justify-center pt-24">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">パスワード編集</h1>
        </div>
        <form onSubmit={handleSaveClick}>
          <>
            <div className="mb-4">
              <div className="relative flex items-center border rounded-xl">
                <span className="absolute left-2 text-gray-500">
                  現在のパスワード:
                </span>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg text-right"
                />
              </div>
            </div>
            <div className="mb-4">
              <div className="relative flex items-center border rounded-xl">
                <span className="absolute left-2 text-gray-500">
                  新しいパスワード:
                </span>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg text-right"
                />
              </div>
            </div>
            <div className="mb-4">
              <div className="relative flex items-center border rounded-xl">
                <span className="absolute left-2 text-gray-500">
                  確認用パスワード:
                </span>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg text-right"
                />
              </div>
            </div>
            {message && <div className="mb-4 text-red-500">{message}</div>}
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
            >
              保存
            </button>
          </>
        </form>
      </div>
    </div>
  );
};

export default EditPassword;
