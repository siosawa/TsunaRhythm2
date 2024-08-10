"use client";
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";

const PostInput = ({ onPostSuccess }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center mb-4">
        <Button
          onClick={openModal}
          className="bg-emerald-500 hover:bg-emerald-600 text-white py-4 px-4 rounded-full fixed bottom-20 right-16 w-24 h-24"
        >
          日記を書く
        </Button>
      </div>
      <PostInputModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onPostSuccess={onPostSuccess}
      />
    </div>
  );
};

export default PostInput;

const PostInputModal = ({ isOpen, onClose, onPostSuccess }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const contentRef = useRef(null);
  const titleRef = useRef(null);
  const submitButtonRef = useRef(null);

  useEffect(() => {
    if (isOpen && contentRef.current) {
      contentRef.current.focus();
    }

    // モーダルが開いているときにコマンド+エンターで投稿ボタンを発火するイベントリスナーを追加
    const handleKeyDown = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
        event.preventDefault();
        if (submitButtonRef.current) {
          submitButtonRef.current.click();
        }
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    } else {
      window.removeEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (title.length > 56) {
      setError("タイトル分は56文字までです");
      return;
    } else if (content.length > 2050) {
      setError("投稿は2050文字までです");
      return;
    }

    // タイトルが空欄の場合、内容の最初の40文字をタイトルとして設定
    const finalTitle = title || content.slice(0, 40);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/posts`,
        {
          post: {
            title: finalTitle,
            content: content,
          },
        },
        {
          withCredentials: true,
        }
      );

      if (response.status === 201) {
        setTitle("");
        setContent("");
        setError("");
        onPostSuccess();
        onClose();
      } else {
        setError("ポストに失敗しました。");
      }
    } catch (error) {
      console.error("ポストに失敗しました:", error);
      setError("ポストに失敗しました。");
    }
  };

  // タイトルの文字が長すぎる時にエラーを出力
  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    if (e.target.value.length > 56) {
      setError("タイトル文は56文字までです");
    } else {
      setError("");
    }
  };

  // 投稿内容の文字が長すぎる時にエラーを出力
  const handleContentChange = (e) => {
    setContent(e.target.value);
    if (e.target.value.length > 2050) {
      setError("投稿は2050文字までです");
    } else {
      setError("");
    }
  };

  // タイトルでエンターキーを押した時に投稿ボタンが発火しないように設定
  const handleTitleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-white p-6 shadow-lg w-11/12 md:w-2/3 lg:w-1/2 rounded-3xl">
        {error && <div className="text-red-500">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              placeholder="日記タイトル"
              id="title"
              value={title}
              onChange={handleTitleChange}
              onKeyPress={handleTitleKeyPress}
              ref={titleRef}
              className="w-full px-3 py-6 text-3xl rounded transition-all outline-none"
            />
          </div>
          <div className="mb-4">
            <textarea
              placeholder="ご自由にお書きください"
              id="content"
              value={content}
              onChange={handleContentChange}
              ref={contentRef}
              className="w-full px-3 h-96 rounded transition-all outline-none"
            />
          </div>
          <div className="flex items-center justify-end">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded-3xl mr-2"
            >
              キャンセル
            </button>
            <button
              type="submit"
              ref={submitButtonRef}
              className="bg-blue-500 text-white px-4 py-2 rounded-3xl"
            >
              投稿
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
