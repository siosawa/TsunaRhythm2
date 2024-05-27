import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { format } from "date-fns";
import ja from "date-fns/locale/ja";
import Link from "next/link";
import EditPostModal from "@/app/diarys/components/EditPostModal";
import PostDelete from "@/app/diarys/components/PostDelete";
import PostPagination from "@/app/diarys/components/PostPagination";

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

  const handlePageChange = (page) => {
    setCurrentPage(page);
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
      setIsModalOpen(false); // Save後にモーダルを閉じる
    } catch (error) {
      console.error("ポストの編集に失敗しました:", error);
    }
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
                    <PostDelete
                      postId={post.id}
                      posts={posts}
                      setPosts={setPosts}
                    />
                  </>
                )}
              </div>
            </div>
          </div>
        );
      })}
      <PostPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
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
