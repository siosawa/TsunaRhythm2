// 個別ユーザーのポストを作成しつつ、ユーザー詳細ページをインポートして合体させている。ファイル名は後々改名した方が本当は良い。
// ディレクトリ構成のリファクタリングももっとできそう
import React, { useState, useEffect } from "react";
import axios from "axios";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import Link from "next/link";
import EditPostModal from "@/app/diarys/components/EditPostModal";
import PostDelete from "@/app/diarys/components/PostDelete";
import PostPagination from "@/app/diarys/components/PostPagination";
import { Button } from "@/components/ui/button";
import UserProfile from "./UserProfile";

interface Post {
  id: number;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  user_id: number;
  current_user_id: number;
  user: {
    name: string;
  };
}

interface User {
  id: number;
  name: string;
  created_at: string;
  work: string;
  profile_text: string;
  avatar: {
    url: string;
  };
  posts_count: number;
  followers_count: number;
  following_count: number;
}

interface UserPostsViewProps {
  reload: boolean;
  user: User;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const UserPostsView = ({ reload, user, currentPage, onPageChange }: UserPostsViewProps) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [avatars, setAvatars] = useState<Record<number, string | null>>({});

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

  const fetchUserAvatar = async (userId: number) => {
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
    const fetchUserPostsData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/posts/user/${user.id}?page=${currentPage}`,
          {
            credentials: "include",
          }
        );
        const userPosts = await response.json();
        setPosts(userPosts.posts || []);
        setTotalPages(userPosts.total_pages || 1);

        const newAvatars: Record<number, string | null> = {};
        for (const post of userPosts.posts) {
          if (!avatars[post.user_id]) {
            const avatarUrl = await fetchUserAvatar(post.user_id);
            newAvatars[post.user_id] = avatarUrl;
          }
        }
        setAvatars((prevAvatars) => ({ ...prevAvatars, ...newAvatars }));
      } catch (error) {
        console.error("ユーザーポストの取得に失敗しました:", error);
      }
    };

    fetchUserPostsData();
  }, [user.id, reload, currentPage]);

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white rounded-3xl shadow-custom-dark">
      <UserProfile user={user} />
      {posts.map((post) => {
        const formattedDate = format(
          new Date(post.created_at),
          "yyyy/M/d HH:mm",
          { locale: ja }
        );
        return (
          <div key={post.id} className="border-b border-gray-200 py-4">
            <div className="flex items-center mb-2">
              {avatars[post.user_id] ? (
                <img
                  src={`${process.env.NEXT_PUBLIC_RAILS_URL}${avatars[post.user_id]}`}
                  alt={post.user.name}
                  width={60}
                  height={60}
                  className="rounded-full mr-4"
                />
              ) : (
                <div
                  className="flex items-center justify-center bg-gray-300 text-white text-xs font-bold rounded-full mr-4"
                  style={{ width: 60, height: 60, whiteSpace: "nowrap" }}
                >
                  NO IMAGE
                </div>
              )}
              <div className="flex flex-col flex-1">
                <div className="flex items-center">
                  <p className="text-lg font-semibold mr-2">{post.user.name}</p>
                  <div className="flex items-center space-x-2">
                    <p className="text-sm text-gray-500">{formattedDate}</p>
                    {post.user_id === post.current_user_id && (
                      <>
                        <Button
                          className="bg-sky-500 hover:bg-sky-600 text-white"
                          onClick={() => handleEditClick(post)}
                        >
                          編集
                        </Button>
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
            </div>
            <div className="mx-10">
              <Link href={`/diarys/${post.id}`}>
                <p className="mb-2 text-gray-800 text-xl font-bold hover:underline">
                  {post.title}
                </p>
              </Link>
              <div className="overflow-auto mb-4 text-gray-600 whitespace-pre-line">
                <Link href={`/diarys/${post.id}`} className="hover:underline">
                  {post.content.length > 40
                    ? `${post.content.slice(0, 290)}...`
                    : post.content}
                </Link>
              </div>
            </div>
          </div>
        );
      })}
      <PostPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
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

export default UserPostsView;
