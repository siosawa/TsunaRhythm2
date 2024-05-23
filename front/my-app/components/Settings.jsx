"use client";
import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Setting = () => {
  const [error, setError] = useState("");

  const handleLogout = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/v1/logout", {
        method: "DELETE",
        credentials: "include", // 必要に応じてクッキーを含める
      });

      if (res.ok) {
        // ログアウト成功
        window.location.href = "/diarys";
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
    window.location.href = "/userprofile";
  }
  return (
    <>
      {error && <div className="text-red-500">{error}</div>}
      <DropdownMenu>
        <DropdownMenuTrigger>設定</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleUserProfile}>マイページ</DropdownMenuItem>
          <DropdownMenuItem>プロフィール編集</DropdownMenuItem>
          <DropdownMenuItem onClick={handleLogout}>ログアウト</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default Setting;
