"use client";
import { useState, useRef, useEffect } from "react";
import { FiTriangle } from "react-icons/fi";
import axios from "axios";
import { Button } from "@/components/ui/button";
import FetchCurrentUser from "@/components/FetchCurrentUser";

const ProfileReadPage = () => {
  const [user, setUser] = useState(null);
  const [isEditable, setIsEditable] = useState(false);
  const [error, setError] = useState("");
  const nameInputRef = useRef(null);
  const [avatar, setAvatar] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/current_user`,
        { withCredentials: true }
      );
      setUser(response.data);
    } catch (error) {
      console.error("ユーザーデータの取得に失敗しました:", error);
    }
  };

  const handleEditClick = () => {
    setIsEditable(true);
    setTimeout(() => {
      nameInputRef.current?.focus();
    }, 0);
  };

  const handleSaveClick = async () => {
    const formData = new FormData();
    formData.append("user[name]", user.name);
    formData.append("user[email]", user.email);
    formData.append("user[work]", user.work);
    formData.append("user[profile_text]", user.profile_text);
    if (avatar) {
      formData.append("user[avatar]", avatar);
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/${user.id}`,
        {
          method: "PATCH",
          body: formData,
          credentials: "include",
        }
      );

      if (response.ok) {
        const updatedUserData = await response.json();
        console.log("ユーザーデータを更新しました:", updatedUserData);
        setIsEditable(false);
        await fetchUserData();
      } else {
        console.error("ユーザーデータの更新に失敗しました");
      }
    } catch (error) {
      console.error("ユーザーデータの更新中にエラーが発生しました:", error);
    }
  };

  const handlePasswordEditClick = () => {
    window.location.href = "/edit-profile/password";
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    setAvatar(file);

    const formData = new FormData();
    formData.append("user[avatar]", file);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/${user.id}`,
        {
          method: "PATCH",
          body: formData,
          credentials: "include",
        }
      );

      if (response.ok) {
        const updatedUserData = await response.json();
        console.log("アバターを更新しました:", updatedUserData);
        setAvatar(null);
        await fetchUserData();
      } else {
        console.error("アバターの更新に失敗しました");
      }
    } catch (error) {
      console.error("アバターの更新中にエラーが発生しました:", error);
    }
  };

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const openDialog = () => {
    setError("");
    setIsDialogOpen(true);
  };
  const closeDialog = () => setIsDialogOpen(false);

  const handleDeleteAccount = async () => {
    if (user?.id == 2) {
      setError("ゲストアカウントは退会できません。");
      return;
    }

    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/${user.id}`,
        {
          withCredentials: true,
        }
      );
      console.log("退会処理が実行されました:", response.data);

      document.cookie.split(";").forEach((cookie) => {
        const [name] = cookie.split("=");
        document.cookie = `${name}=;expires=${new Date(0).toUTCString()};path=/`;
      });

      // ダイアログを閉じる(念のため)
      closeDialog();

      window.location.href = "/";
    } catch (error) {
      console.error("退会処理に失敗しました:", error);
      setError("退会処理に失敗しました。");
    }
  };

  const handleNoImageClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="min-h-screen flex items-start justify-center pt-24 ">
      <FetchCurrentUser setCurrentUser={setUser} />
      <div className="bg-white p-6 rounded-3xl shadow-lg w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">プロフィール編集</h1>
        </div>
        <div className="flex justify-center items-center mb-4">
          {user && user.avatar && user.avatar.url ? (
            <div
              className="relative group cursor-pointer"
              onClick={handleNoImageClick}
            >
              <img
                src={`${process.env.NEXT_PUBLIC_RAILS_URL}${user.avatar.url}`}
                alt={user.name}
                width={120}
                height={120}
                className="rounded-full group-hover:opacity-75"
              />
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
            </div>
          ) : (
            <button
              className="bg-gray-200 rounded-full h-32 w-32 flex items-center justify-center text-gray-500"
              onClick={handleNoImageClick}
            >
              NO IMAGE
            </button>
          )}
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
        </div>
        <div className="flex justify-end items-center mb-4">
          {isEditable ? (
            <button
              className="px-4 py-1 rounded-xl shadow-custom-dark"
              onClick={handleSaveClick}
            >
              保存
            </button>
          ) : (
            <button
              className="px-4 py-1 rounded-xl shadow-custom-dark"
              onClick={handleEditClick}
            >
              編集
            </button>
          )}
        </div>
        <form>
          <>
            <div className="mb-4">
              <div className="relative flex items-center border rounded-xl">
                <span className="absolute left-2 text-gray-500">
                  ユーザー名
                </span>
                <input
                  ref={nameInputRef}
                  type="text"
                  name="name"
                  placeholder="ユーザー名"
                  value={user?.name || ""}
                  onChange={handleInputChange}
                  readOnly={!isEditable}
                  className="w-full px-4 py-2 border rounded-xl text-right"
                  autoComplete="name"
                />
              </div>
            </div>
            <div className="mb-4">
              <div className="relative flex items-center border rounded-xl">
                <span className="absolute left-2 text-gray-500">
                  メールアドレス
                </span>
                <input
                  type="email"
                  name="email"
                  placeholder="メールアドレス"
                  value={user?.email || ""}
                  onChange={handleInputChange}
                  readOnly={!isEditable}
                  className="w-full px-4 py-2 border rounded-xl text-right"
                  autoComplete="email"
                />
              </div>
            </div>
            <div className="mb-4">
              <div className="relative flex items-center border rounded-xl">
                <span className="absolute left-2 text-gray-500">
                  パスワード
                </span>
                <input
                  type="password"
                  placeholder="パスワード"
                  value="********"
                  readOnly
                  className="w-full px-4 py-2 border rounded-xl text-right pr-7"
                  autoComplete="current-password"
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
                  value={user?.work || ""}
                  onChange={handleInputChange}
                  readOnly={!isEditable}
                  className="w-full px-4 py-2 border rounded-xl text-right pr-7"
                  autoComplete="organization-title"
                />
              </div>
            </div>
            <div className="mb-4">
              <div className="relative flex items-center border rounded-xl">
                <span className="absolute left-2 top-2 text-gray-500">
                  プロフィール文
                </span>
                <textarea
                  name="profile_text"
                  value={user?.profile_text || ""}
                  onChange={handleInputChange}
                  readOnly={!isEditable}
                  className="w-full px-4 py-2 border rounded-xl text-right pr-7 pt-8"
                  rows="4"
                  autoComplete="off"
                />
              </div>
            </div>
          </>
        </form>
        <div className="flex justify-start mt-4">
          <Button
            variant="ghost"
            className="bg-gray-800 hover:bg-gray-700 text-white hover:text-gray-300"
            onClick={openDialog}
          >
            退会
          </Button>
          {isDialogOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="bg-white p-6 rounded-md shadow-lg max-w-md w-full">
                <h3 className="text-lg font-semibold">退会確認</h3>
                <p className="mt-2 text-sm text-gray-600">
                  本当に退会しますか？この操作は取り消せません。
                </p>
                {error && (
                  <div className="text-red-500 text-center mb-4">{error}</div>
                )}
                <div className="mt-4 flex justify-end space-x-2">
                  <Button variant="ghost" onClick={closeDialog}>
                    キャンセル
                  </Button>
                  <Button variant="destructive" onClick={handleDeleteAccount}>
                    退会する
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileReadPage;
