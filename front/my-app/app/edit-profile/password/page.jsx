"use client";
import { useEffect, useState, useRef } from "react";
import FetchCurrentUser from "@/components/FetchCurrentUser";

const EditPassword = () => {
  const [user, setUser] = useState(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const currentPasswordRef = useRef(null);

  // コンポーネントがマウントされたときにカーソルを自動的に付ける
  useEffect(() => {
    if (currentPasswordRef.current) {
      currentPasswordRef.current.focus();
    }
  }, []);

  const handleSaveClick = async (event) => {
    event.preventDefault();

    const formData = {
      current_password: currentPassword,
      new_password: newPassword,
      confirm_password: confirmPassword,
    };

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");

    if (user && user.id === 2) {
      setMessage("ゲストアカウントはパスワードを変更できません");
      setMessageType("error");
      return;
    }

    if (formData.new_password !== formData.confirm_password) {
      setMessage("新しいパスワードと確認用パスワードが一致しません");
      setMessageType("error");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/api/v1/users/${user.id}/update_password`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            current_password: formData.current_password,
            new_password: formData.new_password,
          }),
          credentials: "include",
        }
      );

      if (response.ok) {
        const updatedUserData = await response.json();
        setMessage("パスワードが正常に更新されました");
        setMessageType("success");
      } else {
        const errorData = await response.json();
        setMessage(errorData.errors.join(", "));
        setMessageType("error");
      }
    } catch (error) {
      console.error("ユーザーデータの更新中にエラーが発生しました:", error);
      setMessage("パスワードの更新中にエラーが発生しました");
      setMessageType("error");
    }
  };

  return (
    <div className="min-h-screen flex items-start justify-center pt-24">
      <FetchCurrentUser setCurrentUser={setUser} />
      <div className="bg-white p-6 rounded-3xl shadow-lg w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">パスワード編集</h1>
        </div>
        <form onSubmit={handleSaveClick}>
          <div className="mb-4">
            <div className="relative flex items-center border rounded-xl">
              <span className="absolute left-2 text-gray-500">
                現在のパスワード:
              </span>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                ref={currentPasswordRef}
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
          <div className="flex justify-end">
            {message && (
              <div
                className={`mb-4 ${messageType === "success" ? "text-green-500" : "text-red-500"} pr-6`}
              >
                {message}
              </div>
            )}
            <button
              type="submit"
              className="px-4 py-1 rounded-xl shadow-custom-dark whitespace-nowrap"
            >
              保存
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPassword;
