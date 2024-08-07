"use client";

import { useEffect, useRef, useState } from "react";

const EditPostModal = ({ isOpen, onClose, post, onSave }) => {
  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);
  const [error, setError] = useState("");
  const contentRef = useRef(null);
  const titleRef = useRef(null);
  const submitButtonRef = useRef(null);

  useEffect(() => {
    if (isOpen && contentRef.current) {
      contentRef.current.focus();
    }

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

    const finalTitle = title || content.slice(0, 40);

    try {
      await onSave(post.id, finalTitle, content);
      onClose();
    } catch (error) {
      console.error("ポストの編集に失敗しました:", error);
      setError("ポストの編集に失敗しました。");
    }
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    if (e.target.value.length > 56) {
      setError("タイトル文は56文字までです");
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
      <div className="bg-white p-6 shadow-lg w-11/12 md:w-2/3 lg:w-1/2 rounded-3xl">
        {error && <div className="text-red-500">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              placeholder="日記タイトル"
              id="title"
              value={title}
              onChange={handleTitleChange}
              ref={titleRef}
              className="w-full px-3 py-6 text-3xl transition-all outline-none"
            />
          </div>
          <div className="mb-4">
            <textarea
              placeholder="ご自由にお書きください"
              id="content"
              value={content}
              onChange={handleContentChange}
              ref={contentRef}
              className="w-full px-3 h-96 transition-all outline-none"
            />
          </div>
          <div className="flex items-center justify-end">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 mr-2 rounded-3xl"
            >
              キャンセル
            </button>
            <button
              type="submit"
              ref={submitButtonRef}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-3xl"
            >
              保存
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPostModal;
