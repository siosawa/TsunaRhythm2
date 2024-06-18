// 後々退出時にleaved_atを記入するように修正
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function RoomExitButton() {
  return (
    <div className="fixed bottom-32 right-12 z-50 flex items-center">
      <div className="w-[310px] border-b-2 border-black mr-4 mt-9"></div>
      <Button
        variant="ghost"
        className="bg-slate-500 text-white hover:text-white hover:bg-slate-600 px-4 py-2 rounded-xl"
        asChild
      >
        <Link href="/rooms">ルームを退出する</Link>
      </Button>
    </div>
  );
}
