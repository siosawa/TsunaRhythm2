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
  const [error, setError] = useState("");
  const [userId, setUserId] = useState(null);

  const handleLogout = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/v1/logout", {
        method: "DELETE",
        credentials: "include", // 必要に応じてクッキーを含める
      });

      if (res.ok) {
        window.location.href = "/";
      } else {
        const errorData = await res.json();
        setError(errorData.error || "ログアウトに失敗しました。");
      }
    } catch (err) {
      console.error("ログアウトに失敗しました:", err);
      setError("ログアウトに失敗しました。");
    }
  };

  const handleSetCurrentUser = (userData) => {
    setUserId(userData.id);
  };

  return (
    <>
      <FetchCurrentUser setCurrentUser={handleSetCurrentUser} />
      {error && <div className="text-red-500">{error}</div>}
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>設定</NavigationMenuTrigger>
            <NavigationMenuContent>
              <Button
                variant="primary"
                asChild
                className="w-full hover:bg-sky-400 hover:text-white"
              >
                <NavigationMenuLink href="/diarys">
                  みんなの日記
                </NavigationMenuLink>
              </Button>
              <Button
                variant="ghost"
                asChild
                className="w-full hover:bg-sky-400 hover:text-white"
              >
                <NavigationMenuLink href="/users">
                  ユーザー一覧
                </NavigationMenuLink>
              </Button>
              <Button
                variant="ghost"
                asChild
                className="hover:bg-sky-400 hover:text-white"
              >
                <NavigationMenuLink href="/edit-profile">
                  プロフィール編集
                </NavigationMenuLink>
              </Button>
              <Button
                variant="ghost"
                asChild
                className="w-full hover:bg-sky-400 hover:text-white"
              >
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
