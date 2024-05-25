import { useState } from "react";
import axios from "axios";

const PostInput = ({ onPostSuccess }) => {
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

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">新しいポストを作成</h1>
      {error && <div className="text-red-500">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="title" className="block text-gray-700">
            タイトル
          </label>
          <input
            id="title"
            value={title}
            onChange={handleTitleChange}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="content" className="block text-gray-700">
            内容
          </label>
          <textarea
            id="content"
            value={content}
            onChange={handleContentChange}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          投稿
        </button>
      </form>
    </div>
  );
};

export default PostInput;
