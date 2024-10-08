"use client";
import { useEffect, useState, useRef, FormEvent, ChangeEvent } from "react";
import FetchCurrentUser from "@/components/FetchCurrentUser";
import axios from "axios";

interface User {
  id: number;
  name: string;
  email: string;
  following: number;
  posts_count: number;
  work: string;
  profile_text: string | null;
  avatar: {
    url: string | null;
  } 

}

const EditPassword = (): JSX.Element => {
  const [user, setUser] = useState<User | null>(null);
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [messageType, setMessageType] = useState<"success" | "error" | null>(null);

  const currentPasswordRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (currentPasswordRef.current) {
      currentPasswordRef.current.focus();
    }
  }, []);

  const handleSaveClick = async (event: FormEvent) => {
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
      setMessage("ゲストアカウントはパスワードを変更できません。");
      setMessageType("error");
      return;
    }
  
    if (formData.new_password !== formData.confirm_password) {
      setMessage("新しいパスワードと確認用パスワードが一致しません。");
      setMessageType("error");
      return;
    }
  
    try {
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/${user?.id}/update_password`,
        {
          current_password: formData.current_password,
          new_password: formData.new_password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
  
      if (response.status === 200) {
        setMessage("パスワードが正常に更新されました。");
        setMessageType("success");
      } else {
        setMessage(response.data.errors.join(", "));
        setMessageType("error");
      }
    } catch (error) {
      console.error("ユーザーデータの更新中にエラーが発生しました:", error);
      setMessage("パスワードの更新中にエラーが発生しました。");
      setMessageType("error");
    }
  };

  const handlePasswordChange = (setter: React.Dispatch<React.SetStateAction<string>>) => 
    (e: ChangeEvent<HTMLInputElement>) => {
      setter(e.target.value);
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
                onChange={handlePasswordChange(setCurrentPassword)}
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
                onChange={handlePasswordChange(setNewPassword)}
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
                onChange={handlePasswordChange(setConfirmPassword)}
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
