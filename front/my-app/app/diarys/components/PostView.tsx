import { useState, useEffect } from "react";
import axios from "axios";
import { format, Locale } from "date-fns";
import { ja } from "date-fns/locale";
import Link from "next/link";
import EditPostModal from "@/app/diarys/components/EditPostModal";
import PostDelete from "@/app/diarys/components/PostDelete";
import PostPagination from "@/app/diarys/components/PostPagination";
import { Button } from "@/components/ui/button";
import FetchPosts from "./FetchPosts";

// 型定義
interface Post {
  id: number;
  content: string;
  user_id: number;
  created_at: string;
  updated_at: string;
  title: string;
  user: {
    name: string;
  };
  current_user_id: number;
}

interface AvatarMap {
  [userId: number]: string | null;
}

interface PostViewProps {
  reload: boolean;
}

const PostView = ({ reload }: PostViewProps): JSX.Element => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [avatars, setAvatars] = useState<AvatarMap>({});

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleEditClick = (post: Post) => {
    setEditingPost(post);
    setIsModalOpen(true);
  };

  const handleSave = async (postId: number, title: string, content: string) => {
    try {
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/posts/${postId}`,
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
      setIsModalOpen(false);
    } catch (error) {
      console.error("ポストの編集に失敗しました:", error);
    }
  };

  const fetchUserAvatar = async (userId: number): Promise<string | null> => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/${userId}`
      );
      return response.data.avatar?.url || null;
    } catch (error) {
      console.error(`ユーザーID${userId}のアバター取得に失敗しました:`, error);
      return null;
    }
  };

  useEffect(() => {
    const fetchAvatars = async () => {
      const newAvatars: AvatarMap = {};
      for (const post of posts) {
        if (!avatars[post.user_id]) {
          const avatarUrl = await fetchUserAvatar(post.user_id);
          newAvatars[post.user_id] = avatarUrl;
        }
      }
      setAvatars((prevAvatars) => ({ ...prevAvatars, ...newAvatars }));
    };

    if (posts.length > 0) {
      fetchAvatars();
    }
  }, [posts]);

  return (
    <div className="mx-3">
      <div className="max-w-2xl p-4 bg-white rounded-3xl shadow-custom-dark mb-20 mx-auto">
        {posts.map((post) => {
        const formattedDate = format(
          new Date(post.created_at),
          "yyyy/M/d HH:mm",
          { locale: ja as Locale }
          );
          return (
            <div key={post.id} className="border-b border-gray-200 py-4">
            <div className="flex items-center mb-2">
              {avatars[post.user_id] ? (
                <Link href={`http://localhost:8000/users/${post.user_id}`}>
                  <img
                    src={`${process.env.NEXT_PUBLIC_RAILS_URL}${avatars[post.user_id]}`}
                    alt={post.user.name}
                    width={60}
                    height={60}
                    className="rounded-full mr-4"
                    />
                </Link>
              ) : (
                <Link href={`http://localhost:8000/users/${post.user_id}`}>
                  <div
                    className="flex items-center justify-center bg-gray-300 text-white text-xs font-bold rounded-full mr-4"
                    style={{ width: 60, height: 60, whiteSpace: "nowrap" }}
                    >
                    NO IMAGE
                  </div>
                </Link>
              )}

              <div className="flex flex-col flex-1">
                <div className="flex items-center">
                  <p className="text-lg font-semibold mr-2">{post.user.name}</p>
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
              {post.user_id === post.current_user_id && (
                <div className="flex justify-end space-x-3 mr-3">
                  <Button
                    className="bg-sky-500 hover:bg-sky-600 text-white mx-2"
                    onClick={() => handleEditClick(post)}
                    >
                    編集
                  </Button>
                  <PostDelete
                    postId={post.id}
                    posts={posts}
                    setPosts={setPosts}
                    />
                </div>
              )}
            </div>
          </div>
        );
      })}
      <FetchPosts
        currentPage={currentPage}
        setPosts={setPosts}
        setTotalPages={setTotalPages}
        reload={reload}
        />
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
  </div>
  );
};

export default PostView;
