"use client";
import { useState } from "react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import FetchCurrentUser from "@/components/FetchCurrentUser";

const Setting = () => {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [userId, setUserId] = useState(null);

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

  // CurrentUserのデータを受け取り、idを抽出して設定
  const handleSetCurrentUser = (userData) => {
    setUserId(userData.id);
  };

  return (
    <>
      <FetchCurrentUser setCurrentUser={handleSetCurrentUser} />
      {message && <div className="text-green-500">{message}</div>}
      {error && <div className="text-red-500">{error}</div>}
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger className="bg-transparent hover:bg-variant-ghost">
              設定
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <Button variant="ghost" asChild className="w-full">
                <NavigationMenuLink onClick={handleUserProfile}>
                  マイページ
                </NavigationMenuLink>
              </Button>
              <Button variant="ghost" asChild>
                <NavigationMenuLink onClick={handleEditProfile}>
                  プロフィール編集
                </NavigationMenuLink>
              </Button>
              <Button variant="ghost" asChild className="w-full">
                <NavigationMenuLink onClick={handleLogout}>
                  ログアウト
                </NavigationMenuLink>
              </Button>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </>
  );
};

export default Setting;
