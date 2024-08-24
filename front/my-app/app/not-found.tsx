export default function NotFound(): JSX.Element {
  return (
    <div className="flex items-start justify-center h-full pt-20">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-red-500">404</h1>
        <p className="text-2xl mt-4 text-gray-700">ページが見つかりません</p>
        <p className="text-lg mt-2 text-gray-500">
          お探しのページは存在しないか、移動した可能性があります。
        </p>
        <a href="/home" className="mt-6 inline-block bg-blue-500 text-white px-6 py-3 rounded-full hover:bg-blue-600">
          ホームに戻る
        </a>
      </div>
    </div>
  );
}
