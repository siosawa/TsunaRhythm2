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
import nookies from "nookies";

const Setting = () => {
  const [error, setError] = useState("");
  const [userId, setUserId] = useState(null);

  const handleLogout = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/logout`,
        {
          method: "DELETE",
          credentials: "include", 
        }
      );

      if (res.ok) {
        nookies.destroy(null, "session_token");
        nookies.destroy(null, "user_id");

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
              <div className="space-y-2">
                {/* onClickで発火させるのではなくhrefを使いたいがうまくいかないためwindo.locationを使用。多分もっと綺麗に描く方法があると思う */}
                <Button
                  variant="primary"
                  className="w-full hover:bg-sky-400 hover:text-white"
                  onClick={() => (window.location.href = "/diarys")}
                >
                  みんなの日記
                </Button>
                <Button
                  variant="ghost"
                  className="w-full hover:bg-sky-400 hover:text-white"
                  onClick={() => (window.location.href = "/users")}
                >
                  ユーザー一覧
                </Button>
                <Button
                  variant="ghost"
                  className="w-full hover:bg-sky-400 hover:text-white"
                  onClick={() => (window.location.href = "/edit-profile")}
                >
                  プロフィール編集
                </Button>
                <Button
                  variant="ghost"
                  className="w-full hover:bg-sky-400 hover:text-white"
                  onClick={handleLogout}
                >
                  ログアウト
                </Button>
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </>
  );
};

export default Setting;
