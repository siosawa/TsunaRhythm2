import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Settings from "@/components/Settings";

const inter = Inter({ subsets: ["latin"] });

const navList = [
  { label: "ホーム", href: "/" },
  { label: "ルーム一覧・作成", href: "/rooms" },
  { label: "みんなの日記", href: "/diarys" },
  { label: "ユーザー", href: "/users" },
];

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body className={cn(inter.className, "min-h-dvh")}>
        <header className="container h-16 flex items-center border-b justify-between">
          <h1 className="font-bold">TsunaRhythm</h1>
          <ul className="navList flex gap-4">
            {navList.map((item) => {
              return (
                <li key={item.label}>
                  <Button variant="ghost" asChild>
                    <Link href={item.href}>{item.label}</Link>
                  </Button>
                </li>
              );
            })}
            <Settings />
          </ul>
        </header>
        {children}
        <footer className="container sticky top-full h-16 flex items-center justify-center border-t ">
          &copy;sawata
        </footer>
      </body>
    </html>
  );
}
