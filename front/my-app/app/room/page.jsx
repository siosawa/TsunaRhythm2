import Link from "next/link";

const Room = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex flex-col items-center justify-center w-3/4 max-w-3xl p-12 bg-gray-300 rounded-full">
        <h1 className="text-4xl mb-8">現在入室中のルームはありません！</h1>
        <Link href="/rooms">
          <p className="px-8 py-4 bg-purple-500 text-white text-xl rounded-full border-2 border-purple-500 hover:bg-purple-700 hover:border-purple-700 transition">
            ルーム一覧ページへ！
          </p>
        </Link>
      </div>
    </div>
  );
};

export default Room;
