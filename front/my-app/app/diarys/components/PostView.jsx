import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { format } from "date-fns";
import ja from "date-fns/locale/ja";
import Link from "next/link";

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
      <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-2/3 lg:w-1/2">
        {error && <div className="text-red-500">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              placeholder="日記タイトル"
              id="title"
              value={title}
              onChange={handleTitleChange}
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
              className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
            >
              キャンセル
            </button>
            <button
              type="submit"
              ref={submitButtonRef}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              保存
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const PostView = ({ reload }) => {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editingPost, setEditingPost] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/v1/posts?page=${currentPage}`,
          {
            withCredentials: true,
          }
        );

        setPosts(response.data.posts);
        setTotalPages(response.data.total_pages);
      } catch (error) {
        console.error("データの取得に失敗しました:", error);
      }
    };
    fetchPosts();
  }, [reload, currentPage]);

  const handleDelete = async (postId) => {
    try {
      await axios.delete(`http://localhost:3000/api/v1/posts/${postId}`, {
        withCredentials: true,
      });
      setPosts(posts.filter((post) => post.id !== postId));
    } catch (error) {
      console.error("ポストの削除に失敗しました:", error);
    }
  };

  const handleEditClick = (post) => {
    setEditingPost(post);
    setIsModalOpen(true);
  };

  const handleSave = async (postId, title, content) => {
    try {
      const response = await axios.patch(
        `http://localhost:3000/api/v1/posts/${postId}`,
        { title, content },
        {
          withCredentials: true,
        }
      );
      setPosts(
        posts.map((post) =>
          post.id === postId
            ? {
                ...post,
                title: response.data.title,
                content: response.data.content,
              }
            : post
        )
      );
      setEditingPost(null);
    } catch (error) {
      console.error("ポストの編集に失敗しました:", error);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const renderPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5; // 表示するページ数を制限
    const halfWindow = Math.floor(maxPagesToShow / 2);
    let startPage = Math.max(currentPage - halfWindow, 1);
    let endPage = Math.min(currentPage + halfWindow, totalPages);

    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) {
        pages.push("...");
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push("...");
      }
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      {posts.map((post) => {
        const formattedDate = format(
          new Date(post.created_at),
          "yyyy/M/d HH:mm",
          { locale: ja }
        );
        return (
          <div key={post.id} className="border-b border-gray-200 py-4">
            <div className="flex items-center mb-2">
              <div className="w-10 h-10 bg-gray-200 rounded-full mr-4 flex-shrink-0"></div>
              <div className="flex flex-col">
                <div className="flex items-center space-x-2">
                  <p className="text-lg font-semibold">{post.user.name}</p>
                  <p className="text-sm text-gray-500">{formattedDate}</p>
                </div>
              </div>
            </div>
            <div className="ml-14">
              <Link href={`/diarys/${post.id}`}>
                <p className="mb-2 text-gray-800 text-xl font-bold">
                  {post.title}
                </p>
              </Link>
              <div className="max-h-post-content overflow-auto mb-4 text-gray-600 whitespace-pre-line">
                {post.content.length > 40
                  ? `${post.content.slice(0, 430)}...`
                  : post.content}
              </div>
              <div className="space-x-2">
                {post.user_id === post.current_user_id && (
                  <>
                    <button
                      onClick={() => handleEditClick(post)}
                      className="px-4 py-2 bg-yellow-500 text-white rounded-md"
                    >
                      編集
                    </button>
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="px-4 py-2 bg-red-500 text-white rounded-md"
                    >
                      削除
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        );
      })}
      <div className="flex justify-center space-x-4 mt-4">
        {renderPageNumbers().map((page, index) => (
          <button
            key={index}
            onClick={() => page !== "..." && handlePageChange(page)}
            disabled={page === currentPage}
            className={`px-4 py-2 rounded ${
              page === currentPage
                ? "bg-blue-500 text-white"
                : "bg-gray-300 text-gray-700"
            }`}
          >
            {page}
          </button>
        ))}
      </div>
      {editingPost && (
        <EditPostModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          post={editingPost}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default PostView;
