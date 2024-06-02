"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const UserProfile = ({ user }) => {
  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center space-x-4">
        <div>
          <h1 className="text-4xl font-bold">{user.name}</h1>
          <div className="flex space-x-2">
            <Button variant="ghost" asChild>
              <Link href={`/users/${user.id}/following`}>
                フォロー {user.following_count}
              </Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href={`/users/${user.id}/followers`}>
                フォロワー {user.followers_count}
              </Link>
            </Button>
          </div>
        </div>
      </div>
      <div className="mt-4">
        <Button variant="ghost" asChild>
          <Link href="/edit-profile">プロフィール編集</Link>
        </Button>
      </div>
      <div className="mt-2">
        <label className="block text-gray-700">主なワーク: {user.work}</label>
      </div>
      <div className="mt-2">
        <label className="block text-gray-700">
          プロフィール文: {user.profile_text}
        </label>
      </div>
    </div>
  );
};

const UserPostView = ({ posts }) => {
  return (
    <div>
      {posts.map((post) => (
        <div key={post.id} className="mb-4 p-4 border rounded shadow-sm">
          <p className="font-bold text-lg">タイトル: {post.title}</p>
          <p>投稿: {post.content}</p>
          <p className="text-gray-500 text-sm">送信日時: {post.created_at}</p>
        </div>
      ))}
    </div>
  );
};

export default function UserPage() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [userPosts, setUserPosts] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/v1/users/${id}`,
          {
            credentials: "include",
          }
        );
        const user = await response.json();
        setUser(user);
      } catch (error) {
        console.error("ユーザー情報の取得に失敗しました:", error);
      }
    };

    const fetchUserPostsData = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/v1/posts/users/${id}`,
          {
            credentials: "include",
          }
        );
        const userPosts = await response.json();
        setUserPosts(userPosts.posts || []);
      } catch (error) {
        console.error("ユーザーポストの取得に失敗しました:", error);
      }
    };

    fetchUserData();
    fetchUserPostsData();
  }, [id]);

  if (!user) return <div>読み込み中...</div>;

  return (
    <div className="container mx-auto p-6">
      <UserProfile user={user} />
      <UserPostView posts={userPosts} />
    </div>
  );
}
