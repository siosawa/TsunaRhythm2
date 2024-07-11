"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";
import ja from "date-fns/locale/ja";
import { useParams } from "next/navigation";

const PostDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

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

        // Fetch user data
        const userRes = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/${userId}`,
          {
            withCredentials: true,
          }
        );
        setUser(userRes.data);
      } catch (error) {
        console.error("データの取得に失敗しました:", error);
        setError(error);
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
    locale: ja,
  });

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white rounded-3xl shadow-custom-dark mt-12">
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
  );
};

export default PostDetail;
