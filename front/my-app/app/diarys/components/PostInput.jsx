import { useState } from "react";
import axios from "axios";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const PostInputModal = ({ isOpen, onClose, onPostSuccess }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    // エラーチェック
    if (title.length > 56) {
      setError("タイトル分は56文字までです");
      return;
    } else if (content.length > 2050) {
      setError("投稿は2050文字までです");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/api/v1/posts",
        {
          post: {
            title: title,
            content: content,
          },
        },
        {
          withCredentials: true, // クッキーを含める設定
        }
      );

      if (response.status === 201) {
        setTitle("");
        setContent("");
        setError("");
        onPostSuccess(); // 投稿成功時に親コンポーネントの状態を更新
        onClose(); // モーダルを閉じる
      } else {
        setError("ポストに失敗しました。");
      }
    } catch (error) {
      console.error("ポストに失敗しました:", error);
      setError("ポストに失敗しました。");
    }
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    if (e.target.value.length > 56) {
      setError("タイトル分は56文字までです");
    } else {
      setError("");
    }
  };

  const handleContentChange = (e) => {
    setContent(e.target.value);
    if (e.target.value.length > 2050) {
      setError("投稿は2050文字までです");
    } else {
      setError("");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-2/3 lg:w-1/2">
        {error && <div className="text-red-500">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              placeholder="日記タイトル"
              id="title"
              value={title}
              onChange={handleTitleChange}
              className="w-full px-3 py-2 rounded transition-all"
            />
          </div>
          <div className="mb-4">
            <textarea
              placeholder="ご自由にお書きください"
              id="content"
              value={content}
              onChange={handleContentChange}
              className="w-full px-3 h-96 rounded  transition-all"
            />
          </div>
          <div className="flex items-center justify-end">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
            >
              キャンセル
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              投稿
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const PostInput = ({ onPostSuccess }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">ポスト管理</h1>
      <div className="flex items-center mb-4">
        <button
          onClick={openModal}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          日記を書く
        </button>
      </div>
      <PostInputModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onPostSuccess={onPostSuccess}
      />
      <div className="flex items-center mt-4">
        <Button
          variant="ghost"
          asChild
          className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
        >
          <Link href="/user-profile">自分の日記</Link>
        </Button>
        <Button
          variant="ghost"
          asChild
          className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
        >
          <Link href="/diarys">みんなの日記</Link>
        </Button>
      </div>
    </div>
  );
};

export default PostInput;
