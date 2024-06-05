"use client";
import React, { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Setting = () => {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // ユーザー情報を取得する関数
    const fetchCurrentUser = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/v1/current_user", {
          credentials: "include", // 必要に応じてクッキーを含める
        });
        if (res.ok) {
          const user = await res.json();
          setUserId(user.id); // ユーザーIDをステートに保存
        }
      } catch (err) {
        console.error("ユーザー情報の取得に失敗しました:", err);
      }
    };

    fetchCurrentUser();
  }, []);

  const handleLogout = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/v1/logout", {
        method: "DELETE",
        credentials: "include", // 必要に応じてクッキーを含める
      });

      if (res.ok) {
        // ログアウト成功
        setMessage("ログアウトに成功しました。");
        setTimeout(() => {
          window.location.href = "/";
        }, 2000); // 2秒後にリダイレクト
      } else {
        const errorData = await res.json();
        setError(errorData.error || "ログアウトに失敗しました。");
      }
    } catch (err) {
      console.error("ログアウトに失敗しました:", err);
      setError("ログアウトに失敗しました。");
    }
  };

  const handleUserProfile = () => {
    if (userId) {
      window.location.href = `/users/${userId}`;
    } else {
      setError("ユーザーIDが取得できませんでした。");
    }
  };

  const handleEditProfile = () => {
    window.location.href = "/edit-profile";
  };

  return (
    <>
      {message && <div className="text-green-500">{message}</div>}
      {error && <div className="text-red-500">{error}</div>}
      <DropdownMenu>
        <DropdownMenuTrigger>設定</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleUserProfile}>
            マイページ
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleEditProfile}>
            プロフィール編集
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleLogout}>ログアウト</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default Setting;
