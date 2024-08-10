"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { format, Locale } from "date-fns";
import { ja as localeJa } from "date-fns/locale";
import { useParams } from "next/navigation";

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

const PostDetail = (): JSX.Element => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const postRes = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/posts/${id}`,
          {
            withCredentials: true,
          }
        );
        setPost(postRes.data);
        const userId = postRes.data.user_id;

        const userRes = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/${userId}`,
          {
            withCredentials: true,
          }
        );
        setUser(userRes.data);
      } catch (error) {
        console.error("データの取得に失敗しました:", error);
        setError(error as Error);
      }
    };

    fetchPost();
  }, [id]);

  if (error) {
    return <div>データの取得に失敗しました: {error.message}</div>;
  }

  if (!post || !user) {
    return <div>Loading...</div>;
  }

  const formattedDate = format(new Date(post.created_at), "yyyy/M/d HH:mm", {
    locale: localeJa as Locale,
  });

  return (
    <div className="flex justify-center">
      <div className="max-w-2xl p-4 bg-white rounded-3xl shadow-custom-dark mt-12 mx-7">
        <div className="flex items-center mb-4">
          {user.avatar.url ? (
            <img
              src={`${process.env.NEXT_PUBLIC_RAILS_URL}${user.avatar.url}`}
              alt={user.name}
              width={60}
              height={60}
              className="rounded-full mr-4"
            />
          ) : (
            <div
              className="flex items-center justify-center bg-gray-300 text-white text-xs font-bold rounded-full mr-4"
              style={{ width: 65, height: 65, whiteSpace: "nowrap" }}
            >
              NO IMAGE
            </div>
          )}
          <div>
            <p className="text-lg font-semibold">{user.name}</p>
            <p className="text-sm text-gray-500">{formattedDate}</p>
          </div>
        </div>
        <h1 className="text-2xl font-bold mb-4">{post.title}</h1>
        <div className="text-gray-800">{post.content}</div>
      </div>
    </div>
  );
};

export default PostDetail;
