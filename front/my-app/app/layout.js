import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Settings from "@/components/Settings";

const inter = Inter({ subsets: ["latin"] });

const navList = [
  { label: "ホーム", href: "/home" }, 
  { label: "ルーム一覧・作成", href: "/rooms" },
  { label: "みんなの日記", href: "/diarys" },
  { label: "ユーザー", href: "/users" },
];

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body className={cn(inter.className, "min-h-dvh relative")}>
        <video autoPlay muted loop className="fixed top-0 left-0 w-full h-full object-cover z-0">
          <source src="/background_movie.MP4" type="video/mp4" />
        </video>
          <div className="relative z-10">
          <header className="fixed top-0 left-0 right-0 h-16 px-16 flex items-center border-b justify-between bg-white bg-opacity-80 backdrop-filter backdrop-blur-sm z-20">
            <h1 className="font-bold">TsunaRhythm</h1>
            <ul className="navList flex gap-4">
              {navList.map((item) => (
                <li key={item.label}>
                  <Button variant="ghost" asChild>
                    <Link href={item.href}>{item.label}</Link>
                  </Button>
                </li>
              ))}
              <Settings />
            </ul>
          </header>
          <main className="pt-16 pb-28">
            {children}
          </main>
          <footer className="fixed bottom-0 left-0 right-0 h-16 flex items-center justify-center border-t bg-white bg-opacity-80 backdrop-filter backdrop-blur-sm z-20">
            &copy;sawata
          </footer>
        </div>
      </body>
    </html>
  );
}
