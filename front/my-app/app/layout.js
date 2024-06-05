"use client";
import { useState } from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Settings from "@/components/Settings";
import { TbMenu } from "react-icons/tb"; // ハンバーガーメニューアイコンをインポート
import FetchCurrentUser from "@/components/FetchCurrentUser"; 

const inter = Inter({ subsets: ["latin"] });
const navList = [
  { label: "ホーム", href: "/home" }, 
  { label: "ルーム一覧・作成", href: "/rooms" },
  { label: "みんなの日記", href: "/diarys" },
  { label: "ユーザー", href: "/users" },
];

export default function RootLayout({ children }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false); 
  const [currentUser, setCurrentUser] = useState(null); 
  const [message, setMessage] = useState(""); 
  const [error, setError] = useState(""); 

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/v1/logout", {
        method: "DELETE",
        credentials: "include", // 必要に応じてクッキーを含める
      });

      if (res.ok) {
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

  const handleMenuClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <html lang="ja">
      <body className={cn(inter.className, "min-h-dvh relative")}>
        <FetchCurrentUser setCurrentUser={setCurrentUser} /> {/* ユーザー情報を取得 */}
        <video autoPlay muted loop className="fixed top-0 left-0 w-full h-full object-cover z-0">
          <source src="/background_movie.MP4" type="video/mp4" />
        </video>
        <div className="relative z-10">
          <header className="fixed top-0 left-0 right-0 h-16 px-16 flex items-center border-b justify-between bg-white bg-opacity-80 backdrop-filter backdrop-blur-sm z-20">
            <h1 className="font-bold">TsunaRhythm</h1>
            {currentUser && (
              <>
                <div className="md:hidden">
                  <Button variant="ghost" onClick={toggleMenu}>
                    <TbMenu size={24} />
                  </Button>
                </div>
                <ul className="hidden md:flex gap-4">
                  {navList.map((item) => (
                    <li key={item.label}>
                      <Button variant="ghost" asChild>
                        <Link href={item.href}>{item.label}</Link>
                      </Button>
                    </li>
                  ))}
                  <Settings />
                </ul>
              </>
            )}
          </header>
          <main className="pt-16 pb-28">
            {children}
          </main>
          <footer className="fixed bottom-0 left-0 right-0 h-16 flex items-center justify-center border-t bg-white bg-opacity-80 backdrop-filter backdrop-blur-sm z-20">
            &copy;sawata
          </footer>
          {/* ポップアップメニュー */}
          {isMenuOpen && currentUser && (
            <div className="fixed top-16 left-0 right-0 bg-white bg-opacity-90 backdrop-filter backdrop-blur-sm z-30 p-4 flex flex-col gap-4">
              {navList.map((item) => (
                <Button key={item.label} variant="ghost" asChild onClick={handleMenuClick}>
                  <Link href={item.href}>{item.label}</Link>
                </Button>
              ))}
              <Button variant="ghost" asChild onClick={handleMenuClick}>
                <Link href={`/users/${currentUser.id}`}>マイページ</Link>
              </Button>
              <Button variant="ghost" asChild onClick={handleMenuClick}>
                <Link href="/edit-profile">プロフィール編集</Link>
              </Button>
              <Button variant="ghost" onClick={() => { handleLogout(); handleMenuClick(); }}>
                ログアウト
              </Button>
            </div>
          )}
        </div>
        {message && <div className="fixed top-0 left-0 right-0 p-4 bg-green-500 text-white">{message}</div>}
        {error && <div className="fixed top-0 left-0 right-0 p-4 bg-red-500 text-white">{error}</div>}
      </body>
    </html>
  );
}
